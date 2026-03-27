export type ThemeMode = "light" | "dark";
export type FontPreset = "editorial" | "modern" | "classic";

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
    fontPreset: FontPreset;
    fontSizes: {
      heroTitle: number;
      heroBody: number;
      about: number;
      services: number;
      cursus: number;
      experience: number;
      projects: number;
      contact: number;
    };
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    primaryButton: { label: string; href: string; enabled: boolean };
    secondaryButton: { label: string; href: string; enabled: boolean };
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
  cursus: {
    enabled: boolean;
    heading: string;
    items: Array<{
      period: string;
      diploma: string;
      institution: string;
      details: string;
    }>;
  };
  experience: {
    enabled: boolean;
    heading: string;
    items: Array<{
      period: string;
      role: string;
      company: string;
      details: string;
    }>;
  };
  projects: {
    enabled: boolean;
    heading: string;
    items: Array<{ name: string; summary: string; url: string }>;
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
