import { NextResponse } from "next/server";
import { iyzicoPost } from "@/lib/iyzico";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const form = await request.formData();
  const token = String(form.get("token") || "");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  if (!token || !supabaseAdmin) {
    return NextResponse.redirect(`${siteUrl}/kredi?payment=failed`, 303);
  }

  try {
    const result = await iyzicoPost<{
      status?: string;
      paymentStatus?: string;
      paymentId?: string;
      fraudStatus?: number;
      paidPrice?: number;
      currency?: string;
      basketId?: string;
      token?: string;
    }>("/payment/iyzipos/checkoutform/auth/ecom/detail", {
      locale: "tr",
      token,
    });

    const orderId = result.basketId;
    if (!orderId || !result.paymentId || result.paymentStatus !== "SUCCESS" || result.fraudStatus !== 1) {
      if (orderId) await supabaseAdmin.from("credit_orders").update({ status: "failed" }).eq("id", orderId);
      return NextResponse.redirect(`${siteUrl}/kredi?payment=failed`, 303);
    }

    const { data: order } = await supabaseAdmin
      .from("credit_orders")
      .select("id,email,credits,price_try,status,iyzico_token")
      .eq("id", orderId)
      .maybeSingle();

    if (!order || order.iyzico_token !== token || Number(order.price_try) !== Number(result.paidPrice) || result.currency !== "TRY") {
      return NextResponse.redirect(`${siteUrl}/kredi?payment=failed`, 303);
    }

    const { data: balance, error } = await supabaseAdmin.rpc("grant_credit_purchase", {
      p_email: order.email,
      p_amount: order.credits,
      p_payment_id: String(result.paymentId),
      p_order_id: order.id,
      p_description: `${order.credits} kredi satın alımı`,
    });

    if (error) throw new Error(error.message);

    return NextResponse.redirect(`${siteUrl}/kredi?payment=success&balance=${Number(balance) || 0}`, 303);
  } catch {
    return NextResponse.redirect(`${siteUrl}/kredi?payment=failed`, 303);
  }
}

export async function GET() {
  return NextResponse.json({ status: "ready" });
}
