import OpenAI from "openai";

export type FalKind = "coffee" | "love" | "money" | "career" | "future" | "daily" | "dream" | "astrology" | "numerology" | "general";
export type UserProfile = { name?: string; birthDate?: string; zodiac?: string; relationshipStatus?: string; workStatus?: string; interests?: string[] };
export type VisionInput = { imageUrls: string[]; question?: string; context?: string };
export type ReadingResult = { summary: string; symbols: Array<{ name: string; zone: string; meaning: string }>; sections: { love: string; career: string; money: string; future: string }; followUpQuestion: string };
export type FalRequest = { kind: FalKind; focus?: string; question?: string; images?: string[]; profile?: UserProfile };
export interface FortuneProvider { analyzeCoffee(input: VisionInput): Promise<ReadingResult> }

export class AIProviderError extends Error {
  constructor(message = "Yapay zekâ servisi şu anda kullanılamıyor.") {
    super(message);
    this.name = "AIProviderError";
  }
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
  const questionLine = question ? ` Özellikle “${question}” sorunun çevresinde bir netleşme ihtiyacı öne çıkıyor.` : "";
  return {
    summary: `${name}, bu okuma ${focusLabel} alanındaki mevcut enerjine ve paylaştığın bilgilere göre hazırlanmış kişisel bir yorumdur.${questionLine} Önümüzdeki dönemde seni aynı anda hem heyecanlandıran hem de karar vermeye zorlayan iki ayrı gelişme belirginleşebilir. Burada acele etmekten çok, hangi seçeneğin sana uzun vadede huzur verdiğine bakman önemli.`,
    symbols: [
      { name: "Kuş", zone: "Üst kenar", meaning: `${name}, beklediğin bir haberin veya konuşmanın hareketlenmesine işaret eden bir sembol. Mesajın içeriğinden çok, sende yaratacağı netleşme önemli.` },
      { name: "Anahtar", zone: "Orta bölüm", meaning: "Kapanmış sandığın bir konuyu yeniden açabilecek çözüm veya fırsat. Doğru kapıyı seçmek için sezginle mantığını birlikte kullan." },
      { name: "Yol", zone: "Dipten kenara", meaning: "Bir kararın seni yeni bir rotaya taşıyacağını gösteren hareketli enerji. Kısa vadeli konfordan çok uzun vadeli hedefi düşün." },
      { name: "Kalp", zone: "Sol bölüm", meaning: "Duygusal olarak önem verdiğin bir bağın hâlâ kararlarını etkilediğini anlatıyor. Açık iletişim burada belirleyici." },
      { name: "Yıldız", zone: "Üst bölüm", meaning: "Umut, görünürlük ve yeniden motive olma. Son dönemde ertelediğin bir isteği tekrar gündeme alabilirsin." },
      { name: "Halka", zone: "Dip", meaning: "Bir döngünün tamamlanması ve yerine daha sağlam bir düzen kurulması. Eski bir alışkanlık veya ilişki biçimi değişebilir." },
    ],
    sections: {
      love: `${name}, duygusal tarafta yüzeysel bir hareketten çok güven ve netlik arayışı öne çıkıyor. Hayatında biri varsa söyleyemediğin bir konuyu açıkça konuşmak ilişkinin yönünü değiştirebilir. Bekârsan, seni sadece heyecanlandıran değil yanında kendin gibi hissettiren bir enerjiye dikkat et. Geçmişten gelen bir kişi veya konu yeniden görünür olabilir; karar verirken eski kırgınlıklarla bugünkü gerçekleri birbirinden ayır.`,
      career: `İş tarafında görünürlüğünün arttığı bir dönemdesin. Üstlendiğin bir sorumluluk, yeni bir teklif ya da senden fikir istenmesi seni daha fazla öne çıkarabilir. ${name}, burada kendini olduğundan küçük göstermemen gerekiyor. Ancak sırf hızlı sonuç almak için her fırsata atlama; şartları, emeğinin karşılığını ve uzun vadeli gelişimini birlikte değerlendir.`,
      money: `Maddi alanda büyük bir sıçramadan önce düzen kurma mesajı var. Beklenen bir ödeme, ek gelir fırsatı veya masrafları azaltacak bir karar rahatlama sağlayabilir. ${name}, özellikle ani harcamalarda “nasıl olsa yerine gelir” düşüncesinden kaçınman iyi olur. Para konusunda net bir plan yaptığında önündeki seçenekler daha görünür hale gelecek.`,
      future: `Yakın gelecekte iki aşamalı bir hareketlilik görünüyor: önce haber veya konuşma, ardından somut bir karar. ${name}, bu dönemde başkalarının beklentisine göre değil, kendi önceliklerine göre seçim yaptığında daha rahat ilerleyeceksin. Önündeki değişim bir anda değil, birkaç küçük işaretin birleşmesiyle netleşecek.`,
    },
    followUpQuestion: question ? `“${question}” sorunun içinde seni en çok düşündüren kişi, karar veya tarih hangisi?` : `${name}, bu yorumda hangi konu senin için daha önemli: aşk, para, kariyer yoksa yakın gelecek?`,
  };
}

function stripCodeFences(value: string) { return value.replace(/^```json\s*|^```\s*|```\s*$/gim, "").trim(); }

function parseReadingFromText(text: string, input: FalRequest): ReadingResult {
  try {
    const parsed = JSON.parse(stripCodeFences(text)) as Partial<ReadingResult>;
    if (parsed.summary && parsed.sections && Array.isArray(parsed.symbols)) {
      return {
        summary: parsed.summary,
        symbols: parsed.symbols.slice(0, 8).map((item) => ({ name: item.name ?? "Sembol", zone: item.zone ?? "Genel", meaning: item.meaning ?? "Bu sembolün yorumu hazırlanıyor." })),
        sections: { love: parsed.sections.love ?? "Duygusal alanda netleşme ve açık iletişim öne çıkıyor.", career: parsed.sections.career ?? "Kariyer alanında görünürlük ve yeni seçenekler öne çıkıyor.", money: parsed.sections.money ?? "Maddi konularda planlı hareket etmek avantaj sağlayabilir.", future: parsed.sections.future ?? "Yakın gelecekte haber ve karar teması belirginleşiyor." },
        followUpQuestion: parsed.followUpQuestion ?? "Bu yorumda hangi alanı daha derin incelemek istersin?",
      };
    }
  } catch { /* invalid model output */ }
  throw new AIProviderError("Yapay zekâ geçerli bir fal yorumu üretemedi.");
}

function isImageData(value: string) { return /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value); }

export async function generateFalResponse(input: FalRequest): Promise<ReadingResult> {
  const apiKey = process.env.HF_TOKEN || process.env.AI_API_KEY;
  if (!apiKey) throw new AIProviderError("Yapay zekâ anahtarı yapılandırılmamış.");
  try {
    const client = new OpenAI({ apiKey, baseURL: "https://router.huggingface.co/v1" });
    const systemPrompt = `Sen Fal Köşesi'nin premium dijital fal yorumcususun. Türkçe yaz. Bu içerik eğlence ve kişisel farkındalık amaçlıdır; kesin gelecek vaadi, tıbbi/hukuki/finansal kesinlik veya kaderin değişmez olduğu iddiası kullanma. Kullanıcıya doğrudan adıyla hitap et ve ikinci tekil şahıs kullan. Verilen profil, soru, odak ve özellikle kahve falında gerçek görselleri inceleyerek kişisel bir okuma üret. Kahve görsellerindeki telve şekillerini, fincanın iç yüzeyindeki konumları, yoğunlukları ve belirgin siluetleri gözlemle; görselde seçemediğin şeyi uydurma. Görsel yoksa bunu varsayım gibi sunma. Tekrarlayan klişelerden kaçın. JSON dışında hiçbir şey döndürme. summary 3-5 cümle; symbols 6-8 öğe ve her meaning en az 2 cümle; sections love/career/money/future her biri 4-6 cümle; followUpQuestion tek kişisel soru olsun.`;
    const textPrompt = `Fal türü: ${input.kind}\nOdak: ${input.focus ?? "genel"}\nKullanıcının sorusu: ${input.question?.trim() || "Belirtilmedi"}\nProfil:\n${profileText(input.profile)}\n${input.kind === "coffee" ? "Bu bir kahve falı. Ekli fincan fotoğraflarını gerçekten görsel olarak analiz et ve sembolleri yalnızca fotoğraflarda gördüğün şekillere bağla." : "Görsel fal analizi gerekmiyor."}`;
    const images = (input.images ?? []).filter(isImageData).slice(0, 3);
    const userContent: Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }> = [{ type: "text", text: textPrompt }];
    if (input.kind === "coffee") for (const image of images) userContent.push({ type: "image_url", image_url: { url: image } });

    const completion = await client.chat.completions.create({
      model: "Qwen/Qwen2.5-VL-72B-Instruct",
      temperature: 0.75,
      max_tokens: 2200,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userContent }],
    });
    return parseReadingFromText(completion.choices[0]?.message?.content ?? "", input);
  } catch (error) {
    console.error("AI provider failed:", error);
    if (error instanceof AIProviderError) throw error;
    throw new AIProviderError();
  }
}

export function getConfiguredProvider() {
  const provider = process.env.AI_PROVIDER || "none";
  if (provider === "none") return null;
  return { analyzeCoffee: async (input: VisionInput) => generateFalResponse({ kind: "coffee", question: input.question, images: input.imageUrls, focus: "genel" }) } satisfies FortuneProvider;
}
