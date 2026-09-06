import { NextResponse } from "next/server";
import { iyzicoPost } from "@/lib/iyzico";
import { requireDb } from "@/lib/neon/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const token = String(form.get("token") || "");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  if (!token) {
    return NextResponse.redirect(`${siteUrl}/kredi?payment=failed`, 303);
  }

  try {
    const sql = requireDb();
    const result = await iyzicoPost<{
      status?: string;
      paymentStatus?: string;
      paymentId?: string;
      fraudStatus?: number;
      paidPrice?: number;
      currency?: string;
      basketId?: string;
      token?: string;
    }>("/payment/iyzipos/checkoutform/auth/ecom/detail", { locale: "tr", token });

    const orderId = result.basketId;
    if (!orderId || !result.paymentId || result.paymentStatus !== "SUCCESS" || result.fraudStatus !== 1) {
      if (orderId) await sql`update public.credit_orders set status = 'failed' where id = ${orderId}`;
      return NextResponse.redirect(`${siteUrl}/kredi?payment=failed`, 303);
    }

    const orderRows = await sql`
      select id, email, credits, price_try, status, iyzico_token
      from public.credit_orders
      where id = ${orderId}
      limit 1
    `;
    const order = orderRows[0];

    if (!order || order.iyzico_token !== token || Number(order.price_try) !== Number(result.paidPrice) || result.currency !== "TRY") {
      return NextResponse.redirect(`${siteUrl}/kredi?payment=failed`, 303);
    }

    const balanceRows = await sql`
      select public.grant_credit_purchase(
        ${order.email},
        ${Number(order.credits)},
        ${String(result.paymentId)},
        ${order.id},
        ${`${order.credits} kredi satın alımı`}
      ) as balance
    `;

    const balance = Number(balanceRows[0]?.balance ?? 0);

    await sql`
      insert into public.notifications (email, title, body, type)
      select ${order.email}, 'Kredi yüklemesi tamamlandı', ${`${Number(order.credits)} kredi hesabına eklendi. Yeni bakiyen ${balance} kredi.`}, 'purchase'
      where not exists (
        select 1 from public.notifications
        where email = ${order.email}
          and type = 'purchase'
          and body like ${`${Number(order.credits)} kredi hesabına eklendi.%`}
          and created_at > now() - interval '10 minutes'
      )
    `;

    return NextResponse.redirect(`${siteUrl}/kredi?payment=success&balance=${balance}`, 303);
  } catch (error) {
    console.error("Credit payment callback error:", error);
    return NextResponse.redirect(`${siteUrl}/kredi?payment=failed`, 303);
  }
}

export async function GET() {
  return NextResponse.json({ status: "ready" });
}
