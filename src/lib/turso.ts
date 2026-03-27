import { createClient, type Client } from "@libsql/client";

let cachedClient: Client | null = null;
let schemaReady: Promise<void> | null = null;

function getTursoCredentials() {
  const url = process.env.TURSO_DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (!url) {
    return null;
  }

  return { url, authToken };
}

export function hasTursoConfig() {
  return Boolean(getTursoCredentials());
}

export function getTursoClient() {
  if (cachedClient) {
    return cachedClient;
  }

  const credentials = getTursoCredentials();

  if (!credentials) {
    throw new Error(
      "Turso n'est pas configure. Ajoute TURSO_DATABASE_URL et TURSO_AUTH_TOKEN dans l'environnement.",
    );
  }

  cachedClient = createClient({
    url: credentials.url,
    authToken: credentials.authToken,
  });

  return cachedClient;
}

export async function ensureTursoSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const client = getTursoClient();

      await client.execute(`
        CREATE TABLE IF NOT EXISTS portfolio_config (
          id TEXT PRIMARY KEY,
          data TEXT NOT NULL,
          updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `);
    })();
  }

  await schemaReady;
}
