import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getCreditPackage } from "@/lib/credits";
import { getMemberEmail } from "@/lib/member-session";
import { iyzicoPost } from "@/lib/iyzico";
import { requireDb } from "@/lib/neon/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const email = await getMemberEmail();
    if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

    const body = (await request.json().catch(() => null)) as { packageId?: string } | null;
    const pack = getCreditPackage(body?.packageId || "");
    if (!pack) return NextResponse.json({ error: "Geçersiz kredi paketi." }, { status: 400 });

    const sql = requireDb();
    const memberRows = await sql`
      select full_name, phone
      from public.profiles
      where email = ${email}
      limit 1
    `;
    const member = memberRows[0];

    await sql`
      select public.ensure_credit_profile(
        ${email},
        ${member?.full_name ?? null},
        ${member?.phone ?? null}
      ) as credits
    `;

    const orderId = crypto.randomUUID();
    const conversationId = `FK-${orderId}`;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const callbackUrl = `${siteUrl}/api/credits/callback`;

    await sql`
      insert into public.credit_orders
        (id, email, package_id, credits, price_try, conversation_id)
      values
        (${orderId}, ${email}, ${pack.id}, ${pack.credits}, ${pack.priceTry}, ${conversationId})
    `;

    const fullName = String(member?.full_name || email.split("@")[0] || "Fal Köşesi Üyes").trim();
    const nameParts = fullName.split(/\s+/);
    const surname = nameParts.length > 1 ? nameParts.pop()! : "Üye";
    const name = nameParts.join(" ") || "Fal Köşesi";
    const buyerId = `FK-${crypto.createHash("sha256").update(email).digest("hex").slice(0, 24)}`;

    const payload = {
      locale: "tr",
      conversationId,
      price: pack.priceTry,
      paidPrice: pack.priceTry,
      currency: "TRY",
      basketId: orderId,
      paymentGroup: "PRODUCT",
      callbackUrl,
      enabledInstallments: [1, 2, 3, 6, 9],
      buyer: {
        id: buyerId,
        name,
        surname,
        email,
        gsmNumber: member?.phone || "+905000000000",
        registrationDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        lastLoginDate: new Date().toISOString().slice(0, 19).replace("T", " "),
        registrationAddress: "Online hizmet",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34000",
        ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1",
      },
      billingAddress: {
        address: "Online hizmet",
        contactName: fullName,
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34000",
      },
      basketItems: [
        {
          id: pack.id,
          price: pack.priceTry,
          name: `${pack.credits} Kredi Paketi`,
          category1: "Fal Köşesi Kredi",
          category2: "Dijital Hizmet",
          itemType: "VIRTUAL",
        },
      ],
    };

    const result = await iyzicoPost<{
      status: string;
      token?: string;
      paymentPageUrl?: string;
      errorMessage?: string;
    }>("/payment/iyzipos/checkoutform/initialize/auth/ecom", payload);

    if (!result.paymentPageUrl || !result.token) throw new Error("iyzico ödeme sayfası oluşturulamadı.");

    await sql`
      update public.credit_orders
      set iyzico_token = ${result.token}
      where id = ${orderId}
    `;

    return NextResponse.json({ paymentUrl: result.paymentPageUrl, orderId });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ödeme başlatılamadı." },
      { status: 500 },
    );
  }
}
