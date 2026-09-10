import { generateFalResponse, type FalRequest } from "@/lib/ai/provider";
import { methodologyFor } from "@/lib/fortune/methodology";
import type { FortuneKind } from "@/lib/fortune/catalog";

export async function generateQualityFortune(input: FalRequest): ReturnType<typeof generateFalResponse> {
  const kind = input.kind as FortuneKind;
  const originalQuestion = input.question?.trim() || "Belirtilmedi";
  const guidedQuestion = [
    `YORUM METODOLOJİSİ:\n${methodologyFor(kind)}`,
    `KULLANICI SORUSU:\n${originalQuestion}`,
    `YAZIM KALİTESİ: Aynı kalıp cümleleri tekrarlama. Önce gözlem/kanıt, sonra yorum, sonra kullanıcının kararını destekleyen yumuşak bir öneri üret. Uydurma detay ekleme.`,
  ].join("\n\n");

  return generateFalResponse({ ...input, question: guidedQuestion });
}
