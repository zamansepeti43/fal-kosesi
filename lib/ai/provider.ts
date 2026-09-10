import OpenAI from "openai";
import { methodologyFor } from "@/lib/fortune/methodology";

export type FalKind = "coffee" | "love" | "money" | "career" | "future" | "daily" | "dream" | "astrology" | "numerology" | "general" | "tarot" | "katina" | "lenormand" | "angel";
export type UserProfile = { name?: string; birthDate?: string; zodiac?: string; relationshipStatus?: string; workStatus?: string; interests?: string[] };
export type VisionInput = { imageUrls: string[]; question?: string; context?: string };
export type ReadingResult = { summary: string; symbols: Array<{ name: string; zone: string; meaning: string }>; sections: { love: string; career: string; money: string; future: string }; followUpQuestion: string; metadata?: { methodology?: string; confidence?: number; generatedAt?: string } };
export type FalRequest = { kind: FalKind; focus?: string; question?: string; images?: string[]; profile?: UserProfile };
export interface FortuneProvider { analyzeCoffee(input: VisionInput): Promise<ReadingResult> }

export class AIProviderError extends Error {
  constructor(message = "Yapay zekâ servisi şu anda kullanılamıyor.") { super(message); this.name = "AIProviderError"; }
}

function profileText(profile?: UserProfile) {
  if (!profile) return "Kullanıcı profili paylaşılmadı.";
  const interests = profile.interests?.length ? profile.interests.join(", ") : "belirtilmedi";
  return [`İsim: ${profile.name || "belirtilmedi"}`, `Doğum tarihi: ${profile.birthDate || "belirtilmedi"}`, `Burç: ${profile.zodiac || "belirtilmedi"}`, `İlişki durumu: ${profile.relationshipStatus || "belirtilmedi"}`, `İş durumu: ${profile.workStatus || "belirtilmedi"}`, `İlgi/odak alanları: ${interests}`].join("\n");
}

function makeFallbackReading(input: FalRequest): ReadingResult {
  const name = input.profile?.name?.trim() || "sen";
  const focusLabel = input.focus ?? "genel";
  const question = input.question?.trim();
  return {
    summary: `${name}, bu sembolik okuma ${focusLabel} alanındaki merakını ve paylaştığın bağlamı birlikte ele alıyor.${question ? ` Özellikle “${question}” sorunda netleşme ihtiyacı öne çıkıyor.` : " Önünde iki seçeneği karşılaştıracağın bir dönem hissi var."} Acele karar yerine hangi seçeneğin sana daha fazla açıklık ve huzur verdiğine bak.`,
    symbols: [
      { name: "Kuş", zone: "Üst kenar", meaning: "Haber, mesaj veya hızlanan bir konuşma teması. İçeriğinden çok sende oluşturacağı netleşme önemli." },
      { name: "Anahtar", zone: "Orta bölüm", meaning: "Çözüm veya yeni bir kapı sembolü. Sorunu tek hamlede değil, doğru seçimi yaparak açma temasını taşır." },
      { name: "Yol", zone: "Dipten kenara", meaning: "Bir kararın yeni bir rotaya açılması. Kısa vadeli rahatlık ile uzun vadeli hedef arasında denge kurmak gerekiyor." },
      { name: "Kalp", zone: "Sol bölüm", meaning: "Duygusal bağın kararlarını etkilediğini gösteren sembolik vurgu. Açık iletişim burada belirleyici." },
      { name: "Yıldız", zone: "Üst bölüm", meaning: "Umut, görünürlük ve yeniden motive olma. Ertelediğin bir isteği tekrar gündeme alma arzusu yaratabilir." },
    ],
    sections: {
      love: `${name}, duygusal tarafta güven ve netlik arayışı belirgin. Hayatında biri varsa konuşulmayan bir konuyu sakin biçimde ele almak ilişkinin havasını değiştirebilir. Bekârsan yalnızca heyecan veren değil, yanında kendin gibi olabildiğin kişilere dikkat et. Geçmişten gelen bir konu görünürse bugünkü davranışlarla eski hikâyeyi birbirinden ayır.`,
      career: `${name}, iş tarafında görünürlük ve sorumluluk teması öne çıkıyor. Yeni bir görev, başvuru veya fikir sunma fırsatı gündeme gelebilir. Kendini küçük göstermemek önemli ama her fırsata atlamadan şartları karşılaştır. Öğrenme ve beceri geliştirme bu dönemde uzun vadeli avantaj sağlar.`,
      money: `Maddi alanda önce düzen, sonra genişleme teması var. Beklenen bir ödeme veya ek gelir rahatlatabilir; aynı zamanda plansız gider riski de görünüyor. Büyük kazanç sözü yerine bütçe ve seçenekleri artıran adımları önemse. Parayı korumak da bu okumanın parçası.`,
      future: `Yakın dönemde önce bir haber/konuşma, ardından somut bir karar teması beliriyor. Değişim bir gecede olmak zorunda değil; birkaç küçük işaret bir araya gelerek yönü netleştirebilir. Başkalarının beklentisi yerine kendi önceliklerini yazılı hale getir. Sonraki adım daha görünür hale gelecektir.`,
    },
    followUpQuestion: question ? `Bu sorunun içinde seni en çok düşündüren kişi, karar veya zaman aralığı hangisi?` : `${name}, bu okumada en çok hangi alanı derinleştirmek istersin?`,
    metadata: { methodology: input.kind, confidence: 0.35, generatedAt: new Date().toISOString() },
  };
}

function stripCodeFences(value: string) { return value.replace(/^```json\s*|^```\s*|```\s*$/gim, "").trim(); }

function parseReadingFromText(text: string, input: FalRequest): ReadingResult {
  try {
    const parsed = JSON.parse(stripCodeFences(text)) as Partial<ReadingResult>;
    if (parsed.summary && parsed.sections && Array.isArray(parsed.symbols)) {
      return {
        summary: String(parsed.summary),
        symbols: parsed.symbols.slice(0, 8).map((item) => ({ name: item?.name ?? "Sembol", zone: item?.zone ?? "Genel", meaning: item?.meaning ?? "Bu sembolün yorumu hazırlanıyor." })),
        sections: { love: parsed.sections.love ?? "Duygusal alanda netleşme öne çıkıyor.", career: parsed.sections.career ?? "Kariyer alanında yeni seçenekler öne çıkıyor.", money: parsed.sections.money ?? "Maddi konularda planlı hareket etmek avantaj sağlar.", future: parsed.sections.future ?? "Yakın gelecekte haber ve karar teması belirgin." },
        followUpQuestion: parsed.followUpQuestion ?? "Hangi alanı daha derin incelemek istersin?",
        metadata: { ...parsed.metadata, methodology: input.kind, generatedAt: new Date().toISOString() },
      };
    }
  } catch { /* invalid model output */ }
  throw new AIProviderError("Yapay zekâ geçerli bir fal yorumu üretemedi.");
}

function isImageData(value: string) { return /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value); }

export async function generateFalResponse(input: FalRequest): Promise<ReadingResult> {
  const apiKey = process.env.HF_TOKEN || process.env.AI_API_KEY;
  if (!apiKey) return makeFallbackReading(input);
  try {
    const client = new OpenAI({ apiKey, baseURL: "https://router.huggingface.co/v1" });
    const methodology = methodologyFor(input.kind);
    const systemPrompt = `Sen Fal Köşesi'nin uzman dijital fal yorumcususun. Türkçe yaz; doğrudan kullanıcıya hitap et. İçerik eğlence ve kişisel farkındalık amaçlıdır; kesin gelecek vaadi, tıbbi/hukuki/finansal kesinlik veya kaderin değişmez olduğu iddiası kullanma. Her çıkarımı verilen veriye bağla; görünmeyen şeyi uydurma. Klişe ve birbirinin aynısı cümlelerden kaçın. JSON dışında hiçbir şey döndürme. summary 4-6 cümle; symbols 5-8 öğe, her meaning 2-3 cümle; sections love/career/money/future her biri 4-6 cümle; followUpQuestion tek kişisel soru.\n\nYÖNTEM:\n${methodology}`;
    const textPrompt = `Fal türü: ${input.kind}\nOdak: ${input.focus ?? "genel"}\nKullanıcının sorusu: ${input.question?.trim() || "Belirtilmedi"}\nProfil:\n${profileText(input.profile)}\n${input.kind === "coffee" ? "Bu bir kahve falı. Ekli gerçek fotoğrafları analiz et. Sadece fotoğrafta seçebildiğin şekilleri ve konumları kullan; bulanık alanda sembol icat etme." : "Bu fal türü için verilen yöntemi uygula; görsel veri yoksa görsel varmış gibi davranma."}`;
    const images = (input.images ?? []).filter(isImageData).slice(0, 3);
    const userContent: Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }> = [{ type: "text", text: textPrompt }];
    if (input.kind === "coffee") for (const image of images) userContent.push({ type: "image_url", image_url: { url: image } });

    const completion = await client.chat.completions.create({
      model: "Qwen/Qwen2.5-VL-72B-Instruct",
      temperature: input.kind === "coffee" ? 0.62 : 0.72,
      max_tokens: 2600,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userContent }],
    });
    return parseReadingFromText(completion.choices[0]?.message?.content ?? "", input);
  } catch (error) {
    console.error("AI provider failed:", error);
    if (error instanceof AIProviderError) throw error;
    return makeFallbackReading(input);
  }
}

export function getConfiguredProvider() {
  const provider = process.env.AI_PROVIDER || "none";
  if (provider === "none") return null;
  return { analyzeCoffee: async (input: VisionInput) => generateFalResponse({ kind: "coffee", question: input.question, images: input.imageUrls, focus: "genel" }) } satisfies FortuneProvider;
}
