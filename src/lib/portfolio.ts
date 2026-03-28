import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  ensureTursoSchema,
  getTursoClient,
  hasTursoConfig,
  getTursoConfigStatus,
} from "@/lib/turso";
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
    fontSizes: {
      heroTitle: 72,
      heroBody: 18,
      about: 18,
      services: 17,
      cursus: 17,
      experience: 17,
      projects: 17,
      contact: 18,
    },
    sectionFonts: {
      hero: "inherit",
      about: "inherit",
      services: "inherit",
      cursus: "inherit",
      experience: "inherit",
      projects: "inherit",
      contact: "inherit",
    },
  },
  ui: {
    themeToggle: {
      darkLabel: "Mode sombre",
      lightLabel: "Mode clair",
    },
    languageLabels: {
      fr: "FR",
      mg: "MG",
      en: "EN",
    },
  },
  hero: {
    badge: "Disponible pour missions freelance",
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
    title: "Une presence digitale qui reste simple a faire evoluer.",
    body: "Je construis des sites et interfaces qui inspirent confiance en quelques secondes. Mon approche melange direction artistique, structure claire et outils modernes pour livrer des experiences simples a faire evoluer.",
  },
  services: {
    enabled: true,
    heading: "Services",
    title: "Un portfolio qui suit ton rythme.",
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
  cursus: {
    enabled: true,
    label: "Cursus",
    heading: "Cursus",
    items: [
      {
        period: "2020 - 2023",
        diploma: "Licence en informatique",
        institution: "Universite d'Antananarivo",
        details:
          "Parcours developpement web, architecture logicielle et gestion de projet numerique.",
      },
      {
        period: "2019 - 2020",
        diploma: "Formation UI/UX",
        institution: "Programme intensif de design digital",
        details:
          "Conception d'interfaces, prototypage et systemes visuels orientes experience utilisateur.",
      },
    ],
  },
  experience: {
    enabled: true,
    label: "Experiences",
    heading: "Experiences professionnelles",
    items: [
      {
        period: "2024 - Aujourd'hui",
        role: "Developpeur Next.js freelance",
        company: "Satiam Studio",
        details:
          "Creation de portfolios, vitrines et panneaux d'administration pour independants et TPE.",
      },
      {
        period: "2022 - 2024",
        role: "Developpeur frontend",
        company: "Agence digitale locale",
        details:
          "Realisation d'interfaces React, optimisation responsive et maintenance continue.",
      },
    ],
  },
  projects: {
    enabled: true,
    heading: "Projets",
    title: "Selection recente",
    openLabel: "Ouvrir",
    items: [
      {
        name: "Studio Horizon",
        summary:
          "Page vitrine premium avec storytelling visuel et formulaire de conversion.",
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
          "Site evenementiel avec planning, intervenants et edition rapide du contenu.",
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
  const normalizedHeroBadge =
    incoming?.hero?.badge === "Portfolio personnalisable"
      ? defaultPortfolioConfig.hero.badge
      : incoming?.hero?.badge;

  return {
    ...defaultPortfolioConfig,
    ...incoming,
    site: { ...defaultPortfolioConfig.site, ...incoming?.site },
    theme: { ...defaultPortfolioConfig.theme, ...incoming?.theme },
    preferences: {
      ...defaultPortfolioConfig.preferences,
      ...incoming?.preferences,
      fontSizes: {
        ...defaultPortfolioConfig.preferences.fontSizes,
        ...incoming?.preferences?.fontSizes,
      },
      sectionFonts: {
        ...defaultPortfolioConfig.preferences.sectionFonts,
        ...incoming?.preferences?.sectionFonts,
      },
    },
    ui: {
      ...defaultPortfolioConfig.ui,
      ...incoming?.ui,
      themeToggle: {
        ...defaultPortfolioConfig.ui.themeToggle,
        ...incoming?.ui?.themeToggle,
      },
      languageLabels: {
        ...defaultPortfolioConfig.ui.languageLabels,
        ...incoming?.ui?.languageLabels,
      },
    },
    hero: {
      ...defaultPortfolioConfig.hero,
      ...incoming?.hero,
      badge: normalizedHeroBadge ?? defaultPortfolioConfig.hero.badge,
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
    cursus: {
      ...defaultPortfolioConfig.cursus,
      ...incoming?.cursus,
      items: incoming?.cursus?.items ?? defaultPortfolioConfig.cursus.items,
    },
    experience: {
      ...defaultPortfolioConfig.experience,
      ...incoming?.experience,
      items:
        incoming?.experience?.items ?? defaultPortfolioConfig.experience.items,
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
    const turso = getTursoConfigStatus();
    const missing = [
      !turso.hasUrl ? "TURSO_DATABASE_URL" : null,
      !turso.hasAuthToken ? "TURSO_AUTH_TOKEN" : null,
    ]
      .filter(Boolean)
      .join(", ");

    throw new Error(
      `Sur Vercel, Turso n'est pas completement configure. Variables manquantes: ${missing}.`,
    );
  }

  await ensurePortfolioStorage();
  await writeFile(configPath, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
}
