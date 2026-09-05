import OpenAI from "openai";

export type FalKind = "coffee" | "love" | "money" | "career" | "future" | "general";

export type VisionInput = {
  imageUrls: string[];
  question?: string;
  context?: string;
};

export type ReadingResult = {
  summary: string;
  symbols: Array<{ name: string; zone: string; meaning: string }>;
  sections: { love: string; career: string; money: string; future: string };
  followUpQuestion: string;
};

export type FalRequest = {
  kind: FalKind;
  focus?: string;
  question?: string;
  images?: string[];
};

export interface FortuneProvider {
  analyzeCoffee(input: VisionInput): Promise<ReadingResult>;
}

function makeFallbackReading(input: FalRequest): ReadingResult {
  const focusLabel = input.focus ?? "genel";
  const question = input.question?.trim() || "Bu fal için net bir soru yazılmadı.";

  return {
    summary: `Bu fal yorumu, ${focusLabel} odaklı olarak sizin içsel dinamiklerinizi ve yakın dönem fırsatlarını yansıtıyor. ${question} sorusu için ruhsal ve pratik eğilimler birlikte okunuyor.`,
    symbols: [
      { name: "Fincan", zone: "Merkez", meaning: "Güçlü içsel farkındalık ve kalıcı bir dönüm noktası." },
      { name: "Kuş", zone: "Sağ taraf", meaning: "Haber, destek ve olumlu bir gelişme yaklaşıyor." },
      { name: "Kapı", zone: "Sol taraf", meaning: "Yeni fırsatların kapısı açılıyor; cesaret gerekli." },
      { name: "Yol", zone: "Alt", meaning: "Yolculukta sabır ve doğru adımın zamanlaması önemli." },
    ],
    sections: {
      love: "İlişkiniz daha açık ve samimi bir iletişim dili kurma fırsatı yakalıyor. Duygularınızı paylaşmak, güveni güçlendirir.",
      career: "İş ve kariyer alanında yeni fırsatlar oluşabilir; özellikle iletişim ve liderlik temelli adımlar öne çıkar.",
      money: "Mali akışta olumlu bir dönüşüm yaşanabilir. Planlı ve sabırlı hareket etmek daha kazançlı sonuç verir.",
      future: "Geleceğe dair güven artıyor. Kendi iç sesinizi dinleyin, küçük ama doğru adımlar sizi ileri taşıyacak.",
    },
    followUpQuestion: "Bu yorumu biraz daha özel hale getirmek için en çok hangi alanı derinleştirmek istersiniz?",
  };
}

function stripCodeFences(value: string) {
  return value.replace(/^```json\s*|^```\s*|```\s*$/gim, "").trim();
}

function parseReadingFromText(text: string, input: FalRequest): ReadingResult {
  try {
    const cleaned = stripCodeFences(text);
    const parsed = JSON.parse(cleaned) as Partial<ReadingResult>;
    if (parsed.summary && parsed.sections && parsed.symbols) {
      return {
        summary: parsed.summary,
        symbols: parsed.symbols.map((item) => ({
          name: item.name ?? "Sembol",
          zone: item.zone ?? "Genel",
          meaning: item.meaning ?? "Anlam yükleniyor.",
        })),
        sections: {
          love: parsed.sections.love ?? "Sevgi alanında olumlu bir zihin açılımı bekleniyor.",
          career: parsed.sections.career ?? "Kariyer alanında doğru fırsatlar şekilleniyor.",
          money: parsed.sections.money ?? "Mali akışta düzen ve bilinçli hareketin önemi öne çıkıyor.",
          future: parsed.sections.future ?? "Gelecek için açıklık ve cesaret önemli bir trend.",
        },
        followUpQuestion: parsed.followUpQuestion ?? "Bu yorumu başka bir bakış açısıyla açmak ister misiniz?",
      };
    }
  } catch {
    // ignore and use fallback below
  }

  return makeFallbackReading(input);
}

export async function generateFalResponse(input: FalRequest): Promise<ReadingResult> {
  const apiKey = process.env.HF_TOKEN || process.env.AI_API_KEY;

  if (!apiKey) {
    return makeFallbackReading(input);
  }

  try {
    const client = new OpenAI({
      apiKey,
      baseURL: "https://router.huggingface.co/v1",
    });

    const systemPrompt = `Sen bir mistik fal yorumlayıcısısın. Türkçe cevap ver. Her cevap JSON formatında olmalı. Düzgün bir yapı döndür: summary, symbols (name, zone, meaning), sections {love, career, money, future}, followUpQuestion.`;

    const userPrompt = `Falcılık türü: ${input.kind}. Odak alanı: ${input.focus ?? "genel"}. Kullanıcı sorusu: ${input.question ?? "Yok"}. Görseller: ${input.images?.length ? `${input.images.length} adet fotoğraf` : "fotoğraf yok"}. Bu bilgileri kullanarak kısa ama anlamlı bir fal yorumu üret. JSON olarak sadece gerekli alanları döndür.`;

    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b:fastest",
      temperature: 0.8,
      max_tokens: 600,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const responseText = completion.choices[0]?.message?.content ?? "";
    return parseReadingFromText(responseText, input);
  } catch (error) {
    console.error("AI provider failed, using fallback response:", error);
    return makeFallbackReading(input);
  }
}

export function getConfiguredProvider() {
  const provider = process.env.AI_PROVIDER || "none";
  if (provider === "none") return null;

  return {
    analyzeCoffee: async (input: VisionInput) => {
      return generateFalResponse({
        kind: "coffee",
        focus: "genel",
        question: input.question ?? "",
        images: input.imageUrls,
      });
    },
  } satisfies FortuneProvider;
}
