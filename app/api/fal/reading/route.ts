import { NextResponse } from "next/server";
import { generateFalResponse } from "@/lib/ai/provider";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await generateFalResponse({
      kind: body.kind ?? "coffee",
      focus: body.focus ?? "genel",
      question: body.question ?? "",
      images: Array.isArray(body.images) ? body.images : [],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Fal reading error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Fal analizi sırasında bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}
