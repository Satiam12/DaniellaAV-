import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { savePortfolioConfig } from "@/lib/portfolio";
import type { PortfolioConfig } from "@/lib/portfolio-types";

export async function PUT(request: Request) {
  try {
    const config = (await request.json()) as PortfolioConfig;
    const savedConfig = await savePortfolioConfig(config);
    revalidatePath("/");
    revalidatePath("/atelier-daniella-9f4k2-admin");

    return NextResponse.json({ config: savedConfig });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue pendant la sauvegarde.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
