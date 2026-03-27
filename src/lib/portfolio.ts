import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { ensureTursoSchema, getTursoClient, hasTursoConfig } from "@/lib/turso";
import type { PortfolioConfig } from "@/lib/portfolio-types";

const configPath = path.join(process.cwd(), "data", "portfolio-config.json");

export const defaultPortfolioConfig: PortfolioConfig = {
  site: {
    ownerName: "satiam",
    navTitle: "satiam portfolio",
    location: "Antananarivo, Madagascar",
  },
  theme: {
    primary: "#d05f32",
    secondary: "#f3b57d",
    accent: "#1d6c63",
    background: "#f7efe3",
    surface: "#fff8ef",
    text: "#24150f",
    muted: "#6b564c",
    darkBackground: "#101213",
    darkSurface: "#171d1f",
    darkText: "#f7efe3",
    darkMuted: "#bcab9e",
  },
  preferences: {
    defaultMode: "light",
    showDarkModeToggle: true,
    fontPreset: "editorial",
  },
  hero: {
    badge: "Portfolio personnalisable",
    title: "Je transforme mes idees en experiences web nettes, rapides et memorables.",
    subtitle: "Designer developpeur freelance",
    description:
      "Portfolio Next.js simple a ajuster: textes, sections, couleurs, mode clair ou sombre et polices.",
    primaryButton: {
      label: "Demarrer un projet",
      href: "#contact",
      enabled: true,
    },
    secondaryButton: {
      label: "Voir mes projets",
      href: "#projects",
      enabled: true,
    },
    stats: [
      { label: "Projets livres", value: "18+" },
      { label: "Clients accompagnes", value: "11" },
      { label: "Temps de reponse", value: "24h" },
    ],
  },
  about: {
    enabled: true,
    heading: "A propos",
    body: "Je construis des sites et interfaces qui donnent confiance des les premieres secondes. Mon approche melange direction artistique, structure claire et outils modernes pour livrer des experiences simples a faire evoluer.",
  },
  services: {
    enabled: true,
    heading: "Services",
    items: [
      {
        title: "Direction visuelle",
        description:
          "Identite, palettes, hierarchie typographique et direction UI coherente.",
      },
      {
        title: "Developpement Next.js",
        description:
          "Interfaces rapides, panneaux de gestion, formulaires et deploiement Vercel.",
      },
      {
        title: "Autonomie client",
        description:
          "Outils simples pour changer le contenu, les sections et les visuels sans redeploiement manuel.",
      },
    ],
  },
  projects: {
    enabled: true,
    heading: "Projets",
    items: [
      {
        name: "Studio Horizon",
        summary:
          "Landing page premium avec storytelling visuel et formulaire de conversion.",
        url: "https://example.com",
      },
      {
        name: "Atelier Mono",
        summary: "Portfolio minimaliste avec zone d'edition simple et rapide.",
        url: "https://example.com",
      },
      {
        name: "Pulse Event",
        summary:
          "Site evenementiel avec planning, speakers et edition rapide du contenu.",
        url: "https://example.com",
      },
    ],
  },
  contact: {
    enabled: true,
    heading: "Contact",
    email: "contact@satiam.dev",
    phone: "+261 34 00 000 00",
    callToAction:
      "Parlons de votre prochaine vitrine, refonte ou identite digitale.",
  },
  socialLinks: [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "GitHub", href: "https://github.com" },
  ],
};

function mergePortfolioConfig(
  incoming?: Partial<PortfolioConfig>,
): PortfolioConfig {
  return {
    ...defaultPortfolioConfig,
    ...incoming,
    site: { ...defaultPortfolioConfig.site, ...incoming?.site },
    theme: { ...defaultPortfolioConfig.theme, ...incoming?.theme },
    preferences: {
      ...defaultPortfolioConfig.preferences,
      ...incoming?.preferences,
    },
    hero: {
      ...defaultPortfolioConfig.hero,
      ...incoming?.hero,
      primaryButton: {
        ...defaultPortfolioConfig.hero.primaryButton,
        ...incoming?.hero?.primaryButton,
      },
      secondaryButton: {
        ...defaultPortfolioConfig.hero.secondaryButton,
        ...incoming?.hero?.secondaryButton,
      },
      stats: incoming?.hero?.stats ?? defaultPortfolioConfig.hero.stats,
    },
    about: { ...defaultPortfolioConfig.about, ...incoming?.about },
    services: {
      ...defaultPortfolioConfig.services,
      ...incoming?.services,
      items: incoming?.services?.items ?? defaultPortfolioConfig.services.items,
    },
    projects: {
      ...defaultPortfolioConfig.projects,
      ...incoming?.projects,
      items: incoming?.projects?.items ?? defaultPortfolioConfig.projects.items,
    },
    contact: { ...defaultPortfolioConfig.contact, ...incoming?.contact },
    socialLinks: incoming?.socialLinks ?? defaultPortfolioConfig.socialLinks,
  };
}

export async function ensurePortfolioStorage() {
  await mkdir(path.dirname(configPath), { recursive: true });
}

export async function getPortfolioConfig() {
  if (hasTursoConfig()) {
    await ensureTursoSchema();

    const client = getTursoClient();
    const result = await client.execute({
      sql: "SELECT data FROM portfolio_config WHERE id = ?",
      args: ["main"],
    });
    const row = result.rows[0] as { data?: string } | undefined;

    if (!row?.data) {
      await client.execute({
        sql: `
          INSERT INTO portfolio_config (id, data, updated_at)
          VALUES (?, ?, CURRENT_TIMESTAMP)
        `,
        args: ["main", JSON.stringify(defaultPortfolioConfig)],
      });

      return defaultPortfolioConfig;
    }

    try {
      return mergePortfolioConfig(
        JSON.parse(row.data) as Partial<PortfolioConfig>,
      );
    } catch {
      return defaultPortfolioConfig;
    }
  }

  await ensurePortfolioStorage();

  try {
    const content = await readFile(configPath, "utf8");
    return mergePortfolioConfig(JSON.parse(content) as Partial<PortfolioConfig>);
  } catch {
    await writeFile(
      configPath,
      JSON.stringify(defaultPortfolioConfig, null, 2),
      "utf8",
    );
    return defaultPortfolioConfig;
  }
}

export async function savePortfolioConfig(config: PortfolioConfig) {
  const normalized = mergePortfolioConfig(config);

  if (hasTursoConfig()) {
    await ensureTursoSchema();

    const client = getTursoClient();
    await client.execute({
      sql: `
        INSERT INTO portfolio_config (id, data, updated_at)
        VALUES (?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          data = excluded.data,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: ["main", JSON.stringify(normalized)],
    });

    return normalized;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Sur Vercel, ajoute TURSO_DATABASE_URL et TURSO_AUTH_TOKEN pour enregistrer les changements de l'admin.",
    );
  }

  await ensurePortfolioStorage();
  await writeFile(configPath, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
}
