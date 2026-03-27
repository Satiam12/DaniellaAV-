import { NextResponse } from "next/server";

import { savePortfolioConfig, type PortfolioConfig } from "@/lib/portfolio";

export async function PUT(request: Request) {
  const config = (await request.json()) as PortfolioConfig;
  const savedConfig = await savePortfolioConfig(config);

  return NextResponse.json({ config: savedConfig });
}
