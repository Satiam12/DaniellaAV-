export const adminBasePath = "/atelier-daniella-9f4k2-admin";

export const adminPageKeys = [
  "overview",
  "site",
  "typography",
  "hero",
  "sections",
  "content",
  "translations",
  "colors",
] as const;

export type AdminPageKey = (typeof adminPageKeys)[number];

export const adminPageLabels: Record<AdminPageKey, string> = {
  overview: "Tableau de bord",
  site: "Site",
  typography: "Polices",
  hero: "Hero",
  sections: "Sections",
  content: "Contenu",
  translations: "Traductions",
  colors: "Couleurs",
};

export function isAdminPageKey(value: string): value is AdminPageKey {
  return adminPageKeys.includes(value as AdminPageKey);
}

export function getAdminPageHref(page: AdminPageKey) {
  if (page === "overview") {
    return adminBasePath;
  }

  return `${adminBasePath}/${page}`;
}
