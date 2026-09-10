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

const FALLBACK_BY_KIND: Partial<Record<FalKind, { summary: string; symbols: ReadingResult["symbols"]; sections: ReadingResult["sections"] }>> = {
  love: { summary: "Aşk okumasında ana tema karşılıklılık, iletişim ve sınırların netleşmesi. Sorundaki kişiyle ilgili kesin zihin okuması yapmak yerine davranışların ve senin beklentilerinin işaret ettiği gerilime odaklanıyorum.", symbols: [{ name: "Kalp", zone: "Merkez", meaning: "Duygusal bağ ve yakınlık ihtiyacını temsil eder." }, { name: "Mektup", zone: "Üst", meaning: "Konuşma, mesaj veya açıklığa kavuşması gereken bir konuyu temsil eder." }, { name: "Köprü", zone: "Orta", meaning: "İki taraf arasında yeniden bağlantı kurma ihtimalini sembolize eder." }], sections: { love: "Burada asıl mesele hislerden çok karşılıklı davranışların ne söylediği. İletişimde açık olmayan bir nokta varsa bunu varsayımla değil doğrudan konuşmayla netleştirmek daha güçlü. Yakın dönemde bir mesaj, görüşme veya tavır değişikliği dikkat çekebilir. Kendi sınırını korurken karşılıklılığı gözlemle.", career: "Bu aşk okumasının dışında kariyer başlığını özellikle büyütmüyorum; ilişki sorununun iş hayatına yansıyan kısmı varsa onu ayrıca düşünmek daha doğru.", money: "Para bu açılımın ana konusu değil. Maddi bir karar söz konusuysa bunu fal yorumundan ayrı, somut bütçe bilgileriyle değerlendirmek gerekir.", future: "Yakın dönemde ilişkinin yönünü tek bir olaydan çok iletişim biçimindeki değişiklik belirleyebilir. Beklemek yerine hangi davranışın senin için yeterli olduğunu netleştir." } },
  money: { summary: "Para ve kısmet okumasında odak, beklenen ödeme veya fırsattan çok para akışını etkileyen seçenekler. Büyük kazanç garantisi vermeden, fırsat ile gereksiz risk arasındaki ayrımı öne çıkarıyorum.", symbols: [{ name: "Anahtar", zone: "Merkez", meaning: "Çözüm ve yeni bir maddi seçenek temasını taşır." }, { name: "Terazi", zone: "Orta", meaning: "Gelir-gider dengesini ve seçimlerin mali sonucunu simgeler." }, { name: "Kese", zone: "Dip", meaning: "Birikim, korunma ve kaynakları kontrollü kullanma temasını anlatır." }], sections: { love: "Bu okumanın ana konusu para olduğu için ilişkiyi yalnızca kararlarını etkileyen bir yan tema olarak ele alıyorum.", career: "Maddi hareketin kaynağı bir iş, ek görev veya başvuruysa fırsatın şartlarını dikkatle karşılaştır. Gelir ihtimali kadar süre, emek ve risk de önemli.", money: "Önce mevcut akışı netleştirmek, sonra yeni fırsata bakmak daha güçlü görünüyor. Beklenen bir ödeme rahatlama sağlayabilir; ancak kesinleşmemiş parayı harcanmış kabul etme. Küçük ama sürdürülebilir bir düzen, hızlı kazanç beklentisinden daha sağlıklı bir sembolik mesaj.", future: "Yakın dönemde para konusunda bir haber veya seçenek belirginleşebilir. Kararı tek bir vaade göre değil, koşullar ve gerçek rakamlar üzerinden ver." } },
  career: { summary: "Kariyer okumasının merkezinde yön seçimi, görünürlük ve somut bir fırsata hazırlanma var. Burada sonuç garantisi değil, hangi davranışın seçeneklerini güçlendirdiği önemli.", symbols: [{ name: "Merdiven", zone: "Merkez", meaning: "Adım adım ilerleme ve sorumluluk artışını simgeler." }, { name: "Kapı", zone: "Üst", meaning: "Yeni görev, başvuru veya görüşme gibi bir seçeneği temsil eder." }, { name: "Pusula", zone: "Orta", meaning: "Yön değiştirme veya öncelik belirleme ihtiyacını anlatır." }], sections: { love: "İş yükünün ilişkilerine yansıyan tarafı varsa bunu fark etmek önemli; fakat bu açılımın ana konusu kariyer.", career: "Mevcut konumunda görünürlük kazanacağın bir görev veya başvuru öne çıkıyor. Hazırlık, iletişim ve yaptığın işi görünür kılmak fırsatın kendisi kadar önemli. Yön değiştirmeyi düşünüyorsan önce hangi becerini taşıyabileceğini belirle.", money: "Kariyer kararının maddi tarafında maaş kadar süreklilik ve koşulları da karşılaştır. Sadece daha yüksek rakam değil, uzun vadeli değer de önemli.", future: "Yakın dönemde bir görüşme, teklif veya yeni sorumluluk gündeme gelebilir. Hazırlığını bugünden yapmak belirsizliği azaltır." } },
  future: { summary: "Yakın gelecek okumasında tek bir kehanet yerine olayların sırasına bakıyorum: önce işaret, ardından gelişme, sonra senin vereceğin karar. Bu nedenle zamanlamayı esnek tutuyorum.", symbols: [{ name: "Saat", zone: "Üst", meaning: "Zamanlama ve sabır temasını temsil eder." }, { name: "Yol", zone: "Orta", meaning: "İki seçenek veya yön değişimini simgeler." }, { name: "Kuş", zone: "Üst kenar", meaning: "Haber, konuşma veya hızlı gelişmeyi temsil eder." }], sections: { love: "Yakın gelecekte duygusal bir gelişme olabilir; bunu bir kişinin kesin davranışı olarak değil, iletişim ihtimali olarak oku.", career: "İş tarafında yeni bir seçenek görünür hale gelebilir. Şartları öğrenmeden karar vermemek önemli.", money: "Maddi tarafta bir ödeme veya fırsat haberi gündeme gelebilir; kesinleşmeden harcama planı yapma.", future: "Önce bir haber veya konuşma, ardından seçim gerektiren bir gelişme teması var. Önümüzdeki haftalarda işaretleri not etmek, tek bir ana takılıp kalmaktan daha yararlı." } },
  daily: { summary: "Bugünün okumasında yalnızca günün temasına odaklanıyorum: neyi öne almak, nerede dikkatli olmak ve günü küçük bir adımla nasıl daha iyi kullanmak.", symbols: [{ name: "Güneş", zone: "Üst", meaning: "Görünürlük ve enerjiyi simgeler." }, { name: "Çapa", zone: "Merkez", meaning: "Önceliğe tutunmayı ve dağılmamayı temsil eder." }, { name: "Kıvılcım", zone: "Orta", meaning: "Bugün değerlendirilebilecek küçük bir başlangıcı anlatır." }], sections: { love: "Bugün ilişkilerde kısa ve açık iletişim daha iyi çalışabilir.", career: "Günün iş temasında tek bir önceliği bitirmek, çok sayıda işe dağılmaktan daha verimli.", money: "Bugün gereksiz bir harcamayı ertelemek bile küçük bir denge sağlayabilir.", future: "Uzak geleceğe değil, bugün atacağın tek net adıma odaklan." } },
  dream: { summary: "Rüya okumasında sembolleri tek bir gizli mesaja indirgemiyorum. En güçlü görüntüleri, rüyadaki duyguyu ve güncel hayatındaki çağrışımı ayrı katmanlarda ele alıyorum.", symbols: [{ name: "Kapı", zone: "Rüyanın ana sahnesi", meaning: "Geçiş, seçim veya bilinmeyen bir alana yaklaşmayı sembolize edebilir." }, { name: "Su", zone: "Duygusal alan", meaning: "Duyguların yoğunluğu veya değişkenliğiyle ilişkilendirilebilir." }, { name: "Ayna", zone: "Kişisel alan", meaning: "Kendini değerlendirme ve içsel bakışı temsil edebilir." }], sections: { love: "Rüyadaki ilişki figürleri varsa, onları gerçek kişinin kesin niyeti değil senin duygusal çağrışımların üzerinden yorumlamak daha doğru.", career: "İş veya sorumluluk teması rüyaya girdiyse kontrol, yetişememe veya değişim duygusunu gösterebilir.", money: "Maddi semboller varsa güvenlik ve kaynak yönetimiyle ilgili kişisel kaygıları temsil edebilir.", future: "Rüyayı gelecek haberi gibi değil, zihninin mevcut deneyimleri işleme biçimi olarak ele al. Tekrarlanan sembol varsa onu not etmek faydalı." } },
  general: { summary: "Falına sorduğun tek konuyu merkeze alıyorum. Cevabı başka fal başlıklarına dağıtmak yerine sorudaki kişi, karar ve belirsizliği ayırıp en yararlı düşünme adımına bağlıyorum.", symbols: [{ name: "Pusula", zone: "Merkez", meaning: "Yön ve öncelik seçimini temsil eder." }, { name: "Anahtar", zone: "Orta", meaning: "Çözüm için erişilebilir bir seçeneği simgeler." }, { name: "Yol", zone: "Dipten kenara", meaning: "Karar sonrası değişen rotayı anlatır." }], sections: { love: "Sorun aşk ile ilgiliyse burada yalnızca sorudaki ilişki boyutuna odaklan.", career: "Sorun iş ile ilgiliyse mevcut seçenekleri ve atılabilecek somut adımı merkeze al.", money: "Sorun para ile ilgiliyse sembolik mesajı gerçek bütçe kararının yerine koyma.", future: "Sorunun sonraki adımına ilişkin olasılıkları düşün; kesin gelecek iddiası kurma." } },
};

function makeFallbackReading(input: FalRequest): ReadingResult {
  const name = input.profile?.name?.trim() || "sen";
  const question = input.question?.trim();
  const template = FALLBACK_BY_KIND[input.kind] ?? FALLBACK_BY_KIND.general!;
  return {
    summary: `${name}, ${template.summary}${question ? ` Sorundaki ana nokta: “${question}”` : ""}`,
    symbols: template.symbols,
    sections: template.sections,
    followUpQuestion: question ? `Bu soruda sonucu değiştirebilecek en somut davranış veya bilgi sence hangisi?` : `Bu okumada hangi tek noktayı daha derinleştirmek istersin?`,
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
        sections: { love: parsed.sections.love ?? "", career: parsed.sections.career ?? "", money: parsed.sections.money ?? "", future: parsed.sections.future ?? "" },
        followUpQuestion: parsed.followUpQuestion ?? "Hangi alanı daha derin incelemek istersin?",
        metadata: { ...parsed.metadata, methodology: input.kind, generatedAt: new Date().toISOString() },
      };
    }
  } catch { /* invalid model output */ }
  throw new AIProviderError("Yapay zekâ geçerli bir fal yorumu üretemedi.");
}

function isImageData(value: string) { return /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(value); }

const TYPE_RULES: Record<FalKind, string> = {
  coffee: "YALNIZCA KAHVE: Fotoğrafta gerçekten görülen şekil, yoğunluk ve konumları yorumla. Görsel yoksa sembol uydurma.",
  love: "YALNIZCA AŞK: İlişki durumu, karşılıklılık, iletişim, davranış, sınır ve yakın dönem duygusal akışı merkeze al. Kariyer veya para anlatısını ana cevap yapma.",
  money: "YALNIZCA PARA & KISMET: Gelir, ödeme, fırsat, gider, birikim ve maddi seçimleri merkeze al. Aşkı veya kariyeri ana konuya dönüştürme.",
  career: "YALNIZCA İŞ & KARİYER: Görev, başvuru, görüşme, ekip, yönetici, görünürlük, beceri ve yön değişimini merkeze al. Aşkı ana cevap yapma.",
  future: "YALNIZCA YAKIN GELECEK: Olası yakın dönem gelişmeleri sıralı biçimde yorumla; zaman aralığını yumuşak tut ve kesin kehanet kurma.",
  daily: "YALNIZCA GÜNLÜK: Bugünün tek ana temasını, dikkat noktasını ve küçük eylemini ver. Uzak gelecek anlatma.",
  dream: "YALNIZCA RÜYA: Verilen rüya içeriğindeki sembol + duygu + kişisel çağrışımı yorumla. Rüyayı gerçek bir kehanet gibi sunma.",
  astrology: "YALNIZCA ASTROLOJİ: Verilen doğum verilerini ve varsa gerçek astrolojik veriyi kullan. Veri yoksa gezegen/ev/açı uydurma.",
  numerology: "YALNIZCA NUMEROLOJİ: Hesaplanabilir sayı verileri üzerinden yorumla. Hesaplanmamış sayıları uydurma.",
  general: "YALNIZCA FALCIYA SOR: Kullanıcının tek sorusuna doğrudan cevap ver; konu dışı aşk/kariyer/para bölümleriyle metni doldurma.",
  tarot: "YALNIZCA TAROT: Verilen kart, pozisyon, düz/ters yön, suit ve kombinasyonları kullan. Kartların ortak hikâyesini kur; kart anlamlarını mekanik biçimde tekrar etme.",
  katina: "YALNIZCA KATİNA: Kişi, duygu, niyet, engel ve yakın akışı kart ilişkileriyle yorumla.",
  lenormand: "YALNIZCA LENORMAND: Kart çiftleri/üçlüleri ve zincirleri birlikte yorumla; bağımsız klişe cümleler üretme.",
  angel: "YALNIZCA MELEK/ORACLE: Mesaj, destek, engel ve tek uygulanabilir adımı seçilen konuya bağla; ruhsal otorite iddiası kurma.",
};

export async function generateFalResponse(input: FalRequest): Promise<ReadingResult> {
  const apiKey = process.env.HF_TOKEN || process.env.AI_API_KEY;
  if (!apiKey) return makeFallbackReading(input);
  try {
    const client = new OpenAI({ apiKey, baseURL: "https://router.huggingface.co/v1" });
    const methodology = methodologyFor(input.kind);
    const systemPrompt = `Sen Fal Köşesi'nin uzman dijital fal yorumcususun. Türkçe yaz; doğrudan kullanıcıya hitap et. İçerik eğlence ve kişisel farkındalık amaçlıdır; kesin gelecek vaadi, tıbbi/hukuki/finansal kesinlik veya kaderin değişmez olduğu iddiası kullanma. Her çıkarımı verilen veriye bağla; görünmeyen şeyi uydurma. Aynı metni farklı fal türlerinde yeniden kullanmak kesinlikle yasaktır. Kullanıcının sorusu ve fal türü cevabın omurgasıdır. Konu dışı bölümlere sırf uzunluk için girme. Her fal türünde farklı kelime seçimi, farklı sembolik odak ve farklı sonuç üret. JSON dışında hiçbir şey döndürme. summary 4-6 cümle; symbols 3-6 öğe, her meaning 1-3 cümle; sections love/career/money/future yalnızca ilgiliyse dolu ve anlamlı olsun, diğerlerinde kısa ve açıkça konu dışı olduğunu belirt; followUpQuestion tek kişisel soru.\n\nFAL TÜRÜ KURALI:\n${TYPE_RULES[input.kind]}\n\nYÖNTEM:\n${methodology}`;
    const textPrompt = `Fal türü: ${input.kind}\nOdak: ${input.focus ?? "genel"}\nKullanıcının sorusu: ${input.question?.trim() || "Belirtilmedi"}\nProfil:\n${profileText(input.profile)}\nBu isteğe özel cevap üret. Sorudaki ana varlıkları (kişi, konu, karar, zaman) doğrudan kullan. Önceki/başka fal türlerinden hazır cevap taşıma. ${input.kind === "coffee" ? "Ekli gerçek fotoğrafları analiz et; sadece gerçekten seçebildiğin şekilleri ve konumları kullan." : "Görsel veri yoksa görsel varmış gibi davranma."}`;
    const images = (input.images ?? []).filter(isImageData).slice(0, 3);
    const userContent: Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string } }> = [{ type: "text", text: textPrompt }];
    if (input.kind === "coffee") for (const image of images) userContent.push({ type: "image_url", image_url: { url: image } });
    const completion = await client.chat.completions.create({
      model: "Qwen/Qwen2.5-VL-72B-Instruct",
      temperature: input.kind === "coffee" ? 0.62 : 0.82,
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
