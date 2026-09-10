import { NextResponse } from "next/server";
import { getMemberEmail } from "@/lib/member-session";
import { requireDb } from "@/lib/neon/db";
import { generateFalResponse } from "@/lib/ai/provider";
import { DIGITAL_COMMENTATORS, type FortuneKind } from "@/lib/fortune/catalog";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const email = await getMemberEmail();
  if (!email) return NextResponse.json({ error: "Önce üye girişi yapmalısın." }, { status: 401 });

  try {
    const body = await request.json();
    const readingId = String(body.readingId ?? "");
    const commentatorId = String(body.commentatorId ?? "");
    const commentator = DIGITAL_COMMENTATORS.find((item) => item.id === commentatorId && item.specialties.includes("tarot" as FortuneKind));
    if (!commentator) return NextResponse.json({ error: "Seçilen tarot karakteri bulunamadı." }, { status: 400 });
    if (!readingId) return NextResponse.json({ error: "Tarot açılım kaydı bulunamadı." }, { status: 400 });

    const question = String(body.question ?? "").trim();
    const cards = String(body.cards ?? "").trim();
    if (!cards) return NextResponse.json({ error: "Kartlar gerekli." }, { status: 400 });

    const sql = requireDb();
    const purchasedRows = await sql`
      select id, price_credits, created_at
      from public.readings
      where id = ${readingId}
        and email = ${email}
        and kind = 'tarot'
        and commentator_id = ${commentator.id}
        and status = 'pending_completion'
      limit 1
    `;

    const purchased = purchasedRows[0];
    if (!purchased) {
      return NextResponse.json({ error: "Bu tarot açılımı bulunamadı, daha önce tamamlanmış olabilir veya satın alma kaydı geçersiz." }, { status: 409 });
    }

    const rawAnswers: unknown[] = Array.isArray(body.answers) ? body.answers : [];
    const answers = rawAnswers.map((x: unknown) => String(x ?? "").trim()).filter(Boolean);
    const profile = body.profile && typeof body.profile === "object" ? body.profile : {};
    const spreadId = String(body.spreadId ?? "three");
    const spreadLabel = String(body.spreadLabel ?? "3 Kart");
    const personalContext = [
      question ? `Kullanıcının özellikle sorduğu konu: ${question}` : "Kullanıcı özel bir soru bırakmadı; kartların genel hikâyesini kişisel bağlam üzerinden yorumla.",
      answers.length ? `Sohbette gönüllü olarak paylaştığı cevaplar:\n${answers.map((x: string, i: number) => `${i + 1}. ${x}`).join("\n")}` : "Kullanıcı sohbet sorularını cevaplamayı tercih etmedi.",
      profile && typeof profile === "object" && "name" in profile ? `Profil adı: ${String((profile as { name?: unknown }).name ?? "")}` : "",
    ].filter(Boolean).join("\n\n");

    const persona = [
      `Yorum karakteri: ${commentator.name}`,
      `Karakter unvanı: ${commentator.title}`,
      `Karakter uzmanlığı: ${commentator.specialties.join(", ")}`,
      `Karakter tanımı: ${commentator.description}`,
    ].join("\n");

    const result = await generateFalResponse({
      kind: "tarot",
      focus: spreadId,
      question: [
        `Bu tarot açılımını ${commentator.name} adlı sanal AI tarot karakteri yapıyor. Karakter gerçek bir kişi değildir.`,
        persona,
        `Açılım: ${spreadLabel}`,
        personalContext,
        `Seçilen kartlar ve pozisyonları:\n${cards}`,
        "YAZIM KURALI: Sonucu dışarıdan bir sistem anlatıyormuş gibi yazma. Falı doğrudan karakterin ağzından, sıcak ve samimi bir falcı üslubuyla anlat. Kullanıcıya doğal biçimde seslen; profil adı mevcutsa adını kullan. 'Kartların bana şunu söylüyor', 'burada özellikle dikkatimi çeken' gibi birinci tekil şahıs ifadeleri kullan. Kullanıcının verdiği cevapları kartlarla ilişkilendir ama cevaplarda olmayan olayları uydurma. Kesin gelecek, kader garantisi, sağlık/finans/hukuk konusunda kesin hüküm verme. Eğlence ve kişisel farkındalık çerçevesini koru. Her kartı tek başına açıklamak yerine önce bütün hikâyeyi kur; ardından pozisyon, düz/ters yön, kart kombinasyonları ve tekrar eden temaları birbirine bağla. Ters kartı kötü haber olarak değil; gecikme, içe dönüş, blokaj veya aşırılık olarak ele al. Aynı kart anlamını tekrar tekrar kullanma. Sonunda karakterin kullanıcıya söylemek istediği en net mesajı ve küçük, uygulanabilir bir düşünce/eylem önerisini yine kendi ağzından ver.",
      ].join("\n\n"),
      images: [],
      profile,
    });

    await sql`
      update public.readings
      set question = ${question},
          result = ${JSON.stringify(result)}::jsonb,
          status = 'ready',
          completed_at = now(),
          input = ${JSON.stringify({ commentatorId: commentator.id, commentatorName: commentator.name, spreadId, spreadLabel, cards, answers: rawAnswers, profile })}::jsonb
      where id = ${readingId}
        and email = ${email}
        and status = 'pending_completion'
    `;

    await sql`
      insert into public.notifications (email, title, body, type)
      values (${email}, 'Tarot açılımın hazır ✦', ${`${commentator.name} karakterinin tarot yorumun hazırlandı.`}, 'reading')
    `;

    return NextResponse.json({
      ...result,
      readingId,
      commentator: { id: commentator.id, name: commentator.name, priceCredits: commentator.priceCredits },
    });
  } catch (error) {
    console.error("Tarot completion error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Tarot yorumu hazırlanamadı." }, { status: 500 });
  }
}
