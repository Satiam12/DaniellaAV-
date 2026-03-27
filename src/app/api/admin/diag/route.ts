import { NextResponse } from "next/server";

import {
  ensureTursoSchema,
  getTursoClient,
  getTursoConfigStatus,
  hasTursoConfig,
} from "@/lib/turso";

export async function GET() {
  const turso = getTursoConfigStatus();
  const dbCheck: {
    attempted: boolean;
    connected: boolean;
    canWrite: boolean;
    error: string | null;
  } = {
    attempted: false,
    connected: false,
    canWrite: false,
    error: null,
  };

  if (hasTursoConfig()) {
    dbCheck.attempted = true;
    try {
      await ensureTursoSchema();
      const client = getTursoClient();

      await client.execute("SELECT 1");
      dbCheck.connected = true;

      await client.execute({
        sql: `
          INSERT INTO portfolio_config (id, data, updated_at)
          VALUES (?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET
            data = excluded.data,
            updated_at = CURRENT_TIMESTAMP
        `,
        args: ["__diag__", '{"ok":true}'],
      });

      await client.execute({
        sql: "DELETE FROM portfolio_config WHERE id = ?",
        args: ["__diag__"],
      });

      dbCheck.canWrite = true;
    } catch (error) {
      dbCheck.error =
        error instanceof Error ? error.message : "Unknown Turso error.";
    }
  }

  return NextResponse.json({
    ok: true,
    runtime: {
      vercel: Boolean(process.env.VERCEL),
      env: process.env.VERCEL_ENV ?? null,
      region: process.env.VERCEL_REGION ?? null,
      commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
    },
    turso: {
      hasDatabaseUrl: turso.hasUrl,
      hasAuthToken: turso.hasAuthToken,
      databaseUrlPreview: turso.hasUrl
        ? `${turso.url.slice(0, 20)}...`
        : null,
      authTokenPreview: turso.hasAuthToken
        ? `${turso.authToken.slice(0, 12)}...`
        : null,
    },
    dbCheck,
  });
}
