import { NextResponse } from "next/server";

type TranslatePayload = {
  target?: string;
  texts?: string[];
};

async function translateText(text: string, target: string) {
  if (!text.trim()) {
    return text;
  }

  const url = new URL("https://translate.googleapis.com/translate_a/single");
  url.searchParams.set("client", "gtx");
  url.searchParams.set("sl", "auto");
  url.searchParams.set("tl", target);
  url.searchParams.set("dt", "t");
  url.searchParams.set("q", text);

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Erreur de traduction");
  }

  const data = (await response.json()) as unknown;
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    return text;
  }

  const segments = data[0] as Array<unknown>;
  const translated = segments
    .map((segment) =>
      Array.isArray(segment) ? String(segment[0] ?? "") : "",
    )
    .join("");

  return translated || text;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as TranslatePayload;
    const target = payload.target?.toString().toLowerCase();
    const texts = Array.isArray(payload.texts) ? payload.texts : [];

    if (!target || texts.length === 0) {
      return NextResponse.json(
        { error: "Parametres manquants" },
        { status: 400 },
      );
    }

    const translations: string[] = [];
    for (const text of texts) {
      try {
        translations.push(await translateText(text, target));
      } catch {
        translations.push(text);
      }
    }

    return NextResponse.json({ translations });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur inconnue pendant la traduction.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
