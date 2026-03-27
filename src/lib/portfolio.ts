import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type ThemeMode = "light" | "dark";

export type PortfolioConfig = {
  site: {
    ownerName: string;
    navTitle: string;
    location: string;
  };
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    darkBackground: string;
    darkSurface: string;
    darkText: string;
    darkMuted: string;
  };
  preferences: {
    defaultMode: ThemeMode;
    showDarkModeToggle: boolean;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    showProfileImage: boolean;
    profileImage: string;
    primaryButton: { label: string; href: string; enabled: boolean };
    secondaryButton: { label: string; href: string; enabled: boolean };
    heroImage: string;
    stats: Array<{ label: string; value: string }>;
  };
  about: {
    enabled: boolean;
    heading: string;
    body: string;
  };
  services: {
    enabled: boolean;
    heading: string;
    items: Array<{ title: string; description: string }>;
  };
  projects: {
    enabled: boolean;
    heading: string;
    items: Array<{ name: string; summary: string; url: string; image?: string }>;
  };
  gallery: {
    enabled: boolean;
    heading: string;
    images: Array<{ src: string; alt: string }>;
  };
  contact: {
    enabled: boolean;
    heading: string;
    email: string;
    phone: string;
    callToAction: string;
  };
  socialLinks: Array<{ label: string; href: string }>;
};

const configPath = path.join(process.cwd(), "data", "portfolio-config.json");
const uploadsPath = path.join(process.cwd(), "public", "uploads");

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
  },
  hero: {
    badge: "Portfolio personnalisable",
    title: "Je transforme mes idees en experiences web nettes, rapides et memorables.",
    subtitle: "Designer developpeur freelance",
    description:
      "Portfolio Next.js personnalisable. Chaque section, bouton, photo et couleur peut etre modifiee sans toucher au code.",
    showProfileImage: true,
    profileImage: "/uploads/satiam-hero.svg",
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
    heroImage: "/uploads/satiam-hero.svg",
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
        image: "/uploads/satiam-hero.svg",
      },
      {
        name: "Atelier Mono",
        summary:
          "Portfolio minimaliste avec CMS maison et galerie medias modulable.",
        url: "https://example.com",
        image: "",
      },
      {
        name: "Pulse Event",
        summary:
          "Site evenementiel avec planning, speakers et edition rapide du contenu.",
        url: "https://example.com",
        image: "",
      },
    ],
  },
  gallery: {
    enabled: true,
    heading: "Galerie",
    images: [
      {
        src: "/uploads/satiam-hero.svg",
        alt: "Visuel hero du portfolio satiam",
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
      profileImage:
        incoming?.hero?.profileImage ?? defaultPortfolioConfig.hero.profileImage,
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
    gallery: {
      ...defaultPortfolioConfig.gallery,
      ...incoming?.gallery,
      images: incoming?.gallery?.images ?? defaultPortfolioConfig.gallery.images,
    },
    contact: { ...defaultPortfolioConfig.contact, ...incoming?.contact },
    socialLinks: incoming?.socialLinks ?? defaultPortfolioConfig.socialLinks,
  };
}

export async function ensurePortfolioStorage() {
  await mkdir(path.dirname(configPath), { recursive: true });
  await mkdir(uploadsPath, { recursive: true });
}

export async function getPortfolioConfig() {
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
  await ensurePortfolioStorage();
  await writeFile(configPath, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
}

export function getThemeStyles(config: PortfolioConfig): Record<string, string> {
  return {
    "--color-primary": config.theme.primary,
    "--color-secondary": config.theme.secondary,
    "--color-accent": config.theme.accent,
    "--color-background": config.theme.background,
    "--color-surface": config.theme.surface,
    "--color-text": config.theme.text,
    "--color-muted": config.theme.muted,
    "--color-dark-background": config.theme.darkBackground,
    "--color-dark-surface": config.theme.darkSurface,
    "--color-dark-text": config.theme.darkText,
    "--color-dark-muted": config.theme.darkMuted,
  };
}
