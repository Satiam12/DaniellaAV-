"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import {
  adminPageKeys,
  adminPageLabels,
  getAdminPageHref,
  type AdminPageKey,
} from "@/lib/admin-pages";
import { getTranslationFields } from "@/lib/portfolio-translations";
import type {
  FontPreset,
  ManualTranslationLanguage,
  PortfolioConfig,
  PortfolioSectionId,
  SectionFontPreset,
  ThemeMode,
} from "@/lib/portfolio-types";

type AdminEditorProps = {
  initialConfig: PortfolioConfig;
  currentPage: AdminPageKey;
};

const paletteSuggestions = [
  { name: "Kamelia doux", theme: { primary: "#b15c3b", secondary: "#ead7c4", accent: "#2f6f63", background: "#f8f1ea", surface: "#fffaf5", text: "#261b17", muted: "#78665d", darkBackground: "#151312", darkSurface: "#211d1a", darkText: "#fbf2e9", darkMuted: "#c5b7aa" } },
  { name: "Terre chaude", theme: { primary: "#d05f32", secondary: "#f3b57d", accent: "#1d6c63", background: "#f7efe3", surface: "#fff8ef", text: "#24150f", muted: "#6b564c", darkBackground: "#101213", darkSurface: "#171d1f", darkText: "#f7efe3", darkMuted: "#bcab9e" } },
  { name: "Ocean atelier", theme: { primary: "#0f6c7a", secondary: "#b6e3ea", accent: "#f08a5d", background: "#edf8fa", surface: "#ffffff", text: "#14343a", muted: "#5c7c82", darkBackground: "#09181d", darkSurface: "#10242b", darkText: "#ecf7f8", darkMuted: "#91afb4" } },
];

const defaultSectionOrder: PortfolioSectionId[] = [
  "about",
  "services",
  "cursus",
  "experience",
  "projects",
  "contact",
];

export function AdminEditor({ initialConfig, currentPage }: AdminEditorProps) {
  const [config, setConfig] = useState(initialConfig);
  const [translationLanguage, setTranslationLanguage] =
    useState<ManualTranslationLanguage>("mg");
  const [status, setStatus] = useState("Pret a enregistrer");
  const [isPending, startTransition] = useTransition();
  const translationFields = getTranslationFields(config);

  function updateConfig(updater: (current: PortfolioConfig) => PortfolioConfig) {
    setConfig((current) => updater(current));
  }

  function updateFontSize(
    key: keyof PortfolioConfig["preferences"]["fontSizes"],
    value: string,
  ) {
    const parsed = Number.parseInt(value, 10);
    const safeValue = Number.isFinite(parsed) ? Math.max(8, parsed) : 16;

    updateConfig((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        fontSizes: {
          ...current.preferences.fontSizes,
          [key]: safeValue,
        },
      },
    }));
  }

  function updateSectionFont(
    key: keyof PortfolioConfig["preferences"]["sectionFonts"],
    value: string,
  ) {
    const preset = value as SectionFontPreset;

    updateConfig((current) => ({
      ...current,
      preferences: {
        ...current.preferences,
        sectionFonts: {
          ...current.preferences.sectionFonts,
          [key]: preset,
        },
      },
    }));
  }

  function moveSection(
    sectionId: PortfolioSectionId,
    direction: -1 | 1,
  ) {
    updateConfig((current) => {
      const order = current.preferences.sectionOrder.length
        ? current.preferences.sectionOrder
        : defaultSectionOrder;
      const index = order.indexOf(sectionId);
      if (index === -1) {
        return current;
      }

      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= order.length) {
        return current;
      }

      const nextOrder = [...order];
      const [moved] = nextOrder.splice(index, 1);
      nextOrder.splice(nextIndex, 0, moved);

      return {
        ...current,
        preferences: {
          ...current.preferences,
          sectionOrder: nextOrder,
        },
      };
    });
  }

  function getSectionLabel(sectionId: PortfolioSectionId, current: PortfolioConfig) {
    switch (sectionId) {
      case "about":
        return current.about.heading;
      case "services":
        return current.services.heading;
      case "cursus":
        return current.cursus.label || current.cursus.heading;
      case "experience":
        return current.experience.label || current.experience.heading;
      case "projects":
        return current.projects.heading;
      case "contact":
        return current.contact.heading;
      default:
        return sectionId;
    }
  }

  function updateHeroStat(index: number, key: "label" | "value", value: string) {
    updateConfig((current) => ({
      ...current,
      hero: {
        ...current.hero,
        stats: current.hero.stats.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item,
        ),
      },
    }));
  }

  function updateService(index: number, key: "title" | "description", value: string) {
    updateConfig((current) => ({
      ...current,
      services: {
        ...current.services,
        items: current.services.items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item,
        ),
      },
    }));
  }

  function updateProject(index: number, key: "name" | "summary" | "url", value: string) {
    updateConfig((current) => ({
      ...current,
      projects: {
        ...current.projects,
        items: current.projects.items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item,
        ),
      },
    }));
  }

  function updateCursus(
    index: number,
    key: "period" | "diploma" | "institution" | "details",
    value: string,
  ) {
    updateConfig((current) => ({
      ...current,
      cursus: {
        ...current.cursus,
        items: current.cursus.items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item,
        ),
      },
    }));
  }

  function updateExperience(
    index: number,
    key: "period" | "role" | "company" | "details",
    value: string,
  ) {
    updateConfig((current) => ({
      ...current,
      experience: {
        ...current.experience,
        items: current.experience.items.map((item, itemIndex) =>
          itemIndex === index ? { ...item, [key]: value } : item,
        ),
      },
    }));
  }

  function updateSocial(index: number, key: "label" | "href", value: string) {
    updateConfig((current) => ({
      ...current,
      socialLinks: current.socialLinks.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    }));
  }

  function updateManualTranslation(source: string, value: string) {
    updateConfig((current) => ({
      ...current,
      translations: {
        ...current.translations,
        [translationLanguage]: {
          ...current.translations[translationLanguage],
          [source]: value,
        },
      },
    }));
  }

  function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) {
      return items;
    }
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(nextIndex, 0, moved);
    return next;
  }

  function moveHeroStat(index: number, direction: -1 | 1) {
    updateConfig((current) => ({
      ...current,
      hero: {
        ...current.hero,
        stats: moveItem(current.hero.stats, index, direction),
      },
    }));
  }

  function moveServiceItem(index: number, direction: -1 | 1) {
    updateConfig((current) => ({
      ...current,
      services: {
        ...current.services,
        items: moveItem(current.services.items, index, direction),
      },
    }));
  }

  function moveProjectItem(index: number, direction: -1 | 1) {
    updateConfig((current) => ({
      ...current,
      projects: {
        ...current.projects,
        items: moveItem(current.projects.items, index, direction),
      },
    }));
  }

  function moveCursusItem(index: number, direction: -1 | 1) {
    updateConfig((current) => ({
      ...current,
      cursus: {
        ...current.cursus,
        items: moveItem(current.cursus.items, index, direction),
      },
    }));
  }

  function moveExperienceItem(index: number, direction: -1 | 1) {
    updateConfig((current) => ({
      ...current,
      experience: {
        ...current.experience,
        items: moveItem(current.experience.items, index, direction),
      },
    }));
  }

  function moveSocialLink(index: number, direction: -1 | 1) {
    updateConfig((current) => ({
      ...current,
      socialLinks: moveItem(current.socialLinks, index, direction),
    }));
  }

  async function saveConfig() {
    startTransition(async () => {
      setStatus("Enregistrement...");
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!response.ok) {
        const errorData = (await response.json()) as { error?: string };
        setStatus(errorData.error ?? "Erreur pendant l'enregistrement");
        return;
      }
      const data = (await response.json()) as { config: PortfolioConfig };
      setConfig(data.config);
      setStatus("Configuration enregistree");
    });
  }

  const adminPages = adminPageKeys.map((page) => ({
    key: page,
    label: adminPageLabels[page],
    href: getAdminPageHref(page),
  }));

  const isPage = (page: AdminPageKey) => currentPage === page;

  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <p className="sidebarKicker">Console de pilotage</p>
        <h1>Daniella AV</h1>
        <p>Espace calme pour piloter les textes, les offres, les couleurs et l&apos;ordre des sections.</p>
        <button className="buttonPrimaryAction" disabled={isPending} onClick={saveConfig} type="button">
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
        <span className="statusPill">{status}</span>
        <div className="adminMiniGrid">
          <div className="miniStat"><strong>{config.projects.items.length}</strong><span>Projets</span></div>
          <div className="miniStat"><strong>{config.services.items.length}</strong><span>Services</span></div>
          <div className="miniStat"><strong>{config.preferences.fontPreset}</strong><span>Police</span></div>
        </div>
        <Link href="/">Voir le portfolio public</Link>
      </aside>

      <section className="adminPanels">
        <nav className="adminTopbar" role="navigation" aria-label="Navigation admin">
          {adminPages.map((item) => (
            <Link
              className={currentPage === item.key ? "active" : undefined}
              href={item.href}
              key={item.key}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {isPage("overview") ? (
        <article className="adminHeroCard" id="admin-overview">
          <div>
            <p className="sectionLabel">Tableau de bord</p>
            <h2>Interface inspiree assistante virtuelle, claire et facile a maintenir</h2>
            <p className="adminHeroText">Le site public garde une presentation editoriale, chaleureuse et orientee prise de rendez-vous.</p>
          </div>
          <div className="adminQuickGrid">
            <div className="quickCard"><span>Police active</span><strong>{config.preferences.fontPreset}</strong></div>
            <div className="quickCard"><span>Mode sombre</span><strong>{config.preferences.showDarkModeToggle ? "Disponible" : "Masque"}</strong></div>
            <div className="quickCard"><span>Couleur active</span><strong>{config.theme.primary}</strong></div>
          </div>
        </article>
        ) : null}

        {isPage("site") ? (
        <article className="adminCard" id="admin-site">
          <div className="cardHeader">
            <div>
              <p className="sectionLabel">Site</p>
              <h2>Identite generale</h2>
              <p className="cardDescription">Renseigne les infos de base et choisis la famille de polices.</p>
            </div>
          </div>
          <div className="formGrid">
            <label>Nom du proprietaire<input value={config.site.ownerName} onChange={(event) => updateConfig((current) => ({ ...current, site: { ...current.site, ownerName: event.target.value } }))} /></label>
            <label>Titre de navigation<input value={config.site.navTitle} onChange={(event) => updateConfig((current) => ({ ...current, site: { ...current.site, navTitle: event.target.value } }))} /></label>
            <label>Localisation<input value={config.site.location} onChange={(event) => updateConfig((current) => ({ ...current, site: { ...current.site, location: event.target.value } }))} /></label>
            <label>Style de police<select value={config.preferences.fontPreset} onChange={(event) => updateConfig((current) => ({ ...current, preferences: { ...current.preferences, fontPreset: event.target.value as FontPreset } }))}><option value="editorial">Editorial</option><option value="modern">Modern</option><option value="classic">Classic</option></select></label>
            <label>Mode par defaut<select value={config.preferences.defaultMode} onChange={(event) => updateConfig((current) => ({ ...current, preferences: { ...current.preferences, defaultMode: event.target.value as ThemeMode } }))}><option value="light">Clair</option><option value="dark">Sombre</option></select></label>
            <label className="checkboxRow"><input checked={config.preferences.showDarkModeToggle} onChange={(event) => updateConfig((current) => ({ ...current, preferences: { ...current.preferences, showDarkModeToggle: event.target.checked } }))} type="checkbox" />Afficher le bouton mode sombre</label>
            <label>Texte bouton mode sombre<input value={config.ui.themeToggle.darkLabel} onChange={(event) => updateConfig((current) => ({ ...current, ui: { ...current.ui, themeToggle: { ...current.ui.themeToggle, darkLabel: event.target.value } } }))} /></label>
            <label>Texte bouton mode clair<input value={config.ui.themeToggle.lightLabel} onChange={(event) => updateConfig((current) => ({ ...current, ui: { ...current.ui, themeToggle: { ...current.ui.themeToggle, lightLabel: event.target.value } } }))} /></label>
            <label>Label langue FR<input value={config.ui.languageLabels.fr} onChange={(event) => updateConfig((current) => ({ ...current, ui: { ...current.ui, languageLabels: { ...current.ui.languageLabels, fr: event.target.value } } }))} /></label>
            <label>Label langue MG<input value={config.ui.languageLabels.mg} onChange={(event) => updateConfig((current) => ({ ...current, ui: { ...current.ui, languageLabels: { ...current.ui.languageLabels, mg: event.target.value } } }))} /></label>
            <label>Label langue EN<input value={config.ui.languageLabels.en} onChange={(event) => updateConfig((current) => ({ ...current, ui: { ...current.ui, languageLabels: { ...current.ui.languageLabels, en: event.target.value } } }))} /></label>
          </div>
        </article>
        ) : null}

        {isPage("typography") ? (
        <article className="adminCard" id="admin-font-sizes">
          <div className="cardHeader">
            <div>
              <p className="sectionLabel">Polices</p>
              <h2>Typographie par section</h2>
              <p className="cardDescription">Choisis les tailles et la famille de police pour chaque bloc du portfolio.</p>
            </div>
          </div>
          <div className="formGrid">
            <label>Titre hero (px)<input min={8} type="number" value={config.preferences.fontSizes.heroTitle} onChange={(event) => updateFontSize("heroTitle", event.target.value)} /></label>
            <label>Texte hero (px)<input min={8} type="number" value={config.preferences.fontSizes.heroBody} onChange={(event) => updateFontSize("heroBody", event.target.value)} /></label>
            <label>A propos (px)<input min={8} type="number" value={config.preferences.fontSizes.about} onChange={(event) => updateFontSize("about", event.target.value)} /></label>
            <label>Services (px)<input min={8} type="number" value={config.preferences.fontSizes.services} onChange={(event) => updateFontSize("services", event.target.value)} /></label>
            <label>Cursus (px)<input min={8} type="number" value={config.preferences.fontSizes.cursus} onChange={(event) => updateFontSize("cursus", event.target.value)} /></label>
            <label>Experiences (px)<input min={8} type="number" value={config.preferences.fontSizes.experience} onChange={(event) => updateFontSize("experience", event.target.value)} /></label>
            <label>Projets (px)<input min={8} type="number" value={config.preferences.fontSizes.projects} onChange={(event) => updateFontSize("projects", event.target.value)} /></label>
            <label>Contact (px)<input min={8} type="number" value={config.preferences.fontSizes.contact} onChange={(event) => updateFontSize("contact", event.target.value)} /></label>
          </div>
          <div className="formGrid">
            <label className="fullWidth">Police par section</label>
            <label>Hero<select value={config.preferences.sectionFonts.hero} onChange={(event) => updateSectionFont("hero", event.target.value)}><option value="inherit">Global</option><option value="editorial">Editorial</option><option value="modern">Modern</option><option value="classic">Classic</option></select></label>
            <label>A propos<select value={config.preferences.sectionFonts.about} onChange={(event) => updateSectionFont("about", event.target.value)}><option value="inherit">Global</option><option value="editorial">Editorial</option><option value="modern">Modern</option><option value="classic">Classic</option></select></label>
            <label>Services<select value={config.preferences.sectionFonts.services} onChange={(event) => updateSectionFont("services", event.target.value)}><option value="inherit">Global</option><option value="editorial">Editorial</option><option value="modern">Modern</option><option value="classic">Classic</option></select></label>
            <label>Cursus<select value={config.preferences.sectionFonts.cursus} onChange={(event) => updateSectionFont("cursus", event.target.value)}><option value="inherit">Global</option><option value="editorial">Editorial</option><option value="modern">Modern</option><option value="classic">Classic</option></select></label>
            <label>Experiences<select value={config.preferences.sectionFonts.experience} onChange={(event) => updateSectionFont("experience", event.target.value)}><option value="inherit">Global</option><option value="editorial">Editorial</option><option value="modern">Modern</option><option value="classic">Classic</option></select></label>
            <label>Projets<select value={config.preferences.sectionFonts.projects} onChange={(event) => updateSectionFont("projects", event.target.value)}><option value="inherit">Global</option><option value="editorial">Editorial</option><option value="modern">Modern</option><option value="classic">Classic</option></select></label>
            <label>Contact<select value={config.preferences.sectionFonts.contact} onChange={(event) => updateSectionFont("contact", event.target.value)}><option value="inherit">Global</option><option value="editorial">Editorial</option><option value="modern">Modern</option><option value="classic">Classic</option></select></label>
          </div>
        </article>
        ) : null}

        {isPage("hero") ? (
        <article className="adminCard" id="admin-hero">
          <div className="cardHeader">
            <div><p className="sectionLabel">Hero</p><h2>Bloc principal et boutons</h2></div>
          </div>
          <div className="formGrid">
            <label>Badge<input value={config.hero.badge} onChange={(event) => updateConfig((current) => ({ ...current, hero: { ...current.hero, badge: event.target.value } }))} /></label>
            <label>Sous-titre<input value={config.hero.subtitle} onChange={(event) => updateConfig((current) => ({ ...current, hero: { ...current.hero, subtitle: event.target.value } }))} /></label>
            <label className="fullWidth">Titre hero<textarea rows={3} value={config.hero.title} onChange={(event) => updateConfig((current) => ({ ...current, hero: { ...current.hero, title: event.target.value } }))} /></label>
            <label className="fullWidth">Description<textarea rows={4} value={config.hero.description} onChange={(event) => updateConfig((current) => ({ ...current, hero: { ...current.hero, description: event.target.value } }))} /></label>
            <label>Bouton 1 texte<input value={config.hero.primaryButton.label} onChange={(event) => updateConfig((current) => ({ ...current, hero: { ...current.hero, primaryButton: { ...current.hero.primaryButton, label: event.target.value } } }))} /></label>
            <label>Bouton 1 lien<input value={config.hero.primaryButton.href} onChange={(event) => updateConfig((current) => ({ ...current, hero: { ...current.hero, primaryButton: { ...current.hero.primaryButton, href: event.target.value } } }))} /></label>
            <label className="checkboxRow"><input checked={config.hero.primaryButton.enabled} onChange={(event) => updateConfig((current) => ({ ...current, hero: { ...current.hero, primaryButton: { ...current.hero.primaryButton, enabled: event.target.checked } } }))} type="checkbox" />Afficher le bouton principal</label>
            <label>Bouton 2 texte<input value={config.hero.secondaryButton.label} onChange={(event) => updateConfig((current) => ({ ...current, hero: { ...current.hero, secondaryButton: { ...current.hero.secondaryButton, label: event.target.value } } }))} /></label>
            <label>Bouton 2 lien<input value={config.hero.secondaryButton.href} onChange={(event) => updateConfig((current) => ({ ...current, hero: { ...current.hero, secondaryButton: { ...current.hero.secondaryButton, href: event.target.value } } }))} /></label>
            <label className="checkboxRow"><input checked={config.hero.secondaryButton.enabled} onChange={(event) => updateConfig((current) => ({ ...current, hero: { ...current.hero, secondaryButton: { ...current.hero.secondaryButton, enabled: event.target.checked } } }))} type="checkbox" />Afficher le bouton secondaire</label>
            <label className="fullWidth">Statistiques</label>
            <div className="fullWidth stackList">
              {config.hero.stats.map((item, index) => (
                <div className="inlineItemEditor" key={`${item.label}-${index}`}>
                  <input value={item.value} onChange={(event) => updateHeroStat(index, "value", event.target.value)} placeholder="Valeur" />
                  <input value={item.label} onChange={(event) => updateHeroStat(index, "label", event.target.value)} placeholder="Label" />
                  <div className="inlineActionRow fullWidth">
                    <button className="buttonSecondary" disabled={index === 0} onClick={() => moveHeroStat(index, -1)} type="button">Monter</button>
                    <button className="buttonSecondary" disabled={index === config.hero.stats.length - 1} onClick={() => moveHeroStat(index, 1)} type="button">Descendre</button>
                    <button className="buttonDanger" onClick={() => updateConfig((current) => ({ ...current, hero: { ...current.hero, stats: current.hero.stats.filter((_, itemIndex) => itemIndex !== index) } }))} type="button">Supprimer</button>
                  </div>
                </div>
              ))}
              <button className="buttonSecondary" onClick={() => updateConfig((current) => ({ ...current, hero: { ...current.hero, stats: [...current.hero.stats, { value: "0", label: "Nouvelle statistique" }] } }))} type="button">Ajouter une statistique</button>
            </div>
          </div>
        </article>
        ) : null}

        {isPage("sections") ? (
        <article className="adminCard" id="admin-sections">
          <div className="cardHeader"><div><p className="sectionLabel">Sections</p><h2>Afficher ou masquer</h2></div></div>
          <div className="toggleGrid">
            {([
              ["about", "Section A propos"],
              ["services", "Section Services"],
              ["cursus", "Section Cursus"],
              ["experience", "Section Experiences"],
              ["projects", "Section Projets"],
              ["contact", "Section Contact"],
            ] as const).map(([key, label]) => (
              <label className="checkboxRow" key={key}>
                <input checked={config[key].enabled} onChange={(event) => updateConfig((current) => ({ ...current, [key]: { ...current[key], enabled: event.target.checked } }))} type="checkbox" />
                {label}
              </label>
            ))}
          </div>
          <div className="stackList">
            <label className="fullWidth">Ordre des sections</label>
            {(config.preferences.sectionOrder.length
              ? config.preferences.sectionOrder
              : defaultSectionOrder
            ).map((sectionId, index, list) => (
              <div className="inlineItemEditor" key={sectionId}>
                <strong>{getSectionLabel(sectionId, config)}</strong>
                <span>Position {index + 1}</span>
                <div className="inlineActionRow">
                  <button className="buttonSecondary" disabled={index === 0} onClick={() => moveSection(sectionId, -1)} type="button">Monter</button>
                  <button className="buttonSecondary" disabled={index === list.length - 1} onClick={() => moveSection(sectionId, 1)} type="button">Descendre</button>
                </div>
              </div>
            ))}
          </div>
        </article>
        ) : null}

        {isPage("content") ? (
        <article className="adminCard" id="admin-content">
          <div className="cardHeader"><div><p className="sectionLabel">Contenu</p><h2>Textes et listes</h2></div></div>
          <div className="formGrid">
            <label className="fullWidth">Libelles & titres de section</label>
            <label>Label A propos<input value={config.about.heading} onChange={(event) => updateConfig((current) => ({ ...current, about: { ...current.about, heading: event.target.value } }))} /></label>
            <label>Titre A propos<input value={config.about.title} onChange={(event) => updateConfig((current) => ({ ...current, about: { ...current.about, title: event.target.value } }))} /></label>
            <label>Label Services<input value={config.services.heading} onChange={(event) => updateConfig((current) => ({ ...current, services: { ...current.services, heading: event.target.value } }))} /></label>
            <label>Titre Services<input value={config.services.title} onChange={(event) => updateConfig((current) => ({ ...current, services: { ...current.services, title: event.target.value } }))} /></label>
            <label>Label Cursus<input value={config.cursus.label} onChange={(event) => updateConfig((current) => ({ ...current, cursus: { ...current.cursus, label: event.target.value } }))} /></label>
            <label>Titre Cursus<input value={config.cursus.heading} onChange={(event) => updateConfig((current) => ({ ...current, cursus: { ...current.cursus, heading: event.target.value } }))} /></label>
            <label>Label Experiences<input value={config.experience.label} onChange={(event) => updateConfig((current) => ({ ...current, experience: { ...current.experience, label: event.target.value } }))} /></label>
            <label>Titre Experiences<input value={config.experience.heading} onChange={(event) => updateConfig((current) => ({ ...current, experience: { ...current.experience, heading: event.target.value } }))} /></label>
            <label>Label Projets<input value={config.projects.heading} onChange={(event) => updateConfig((current) => ({ ...current, projects: { ...current.projects, heading: event.target.value } }))} /></label>
            <label>Titre Projets<input value={config.projects.title} onChange={(event) => updateConfig((current) => ({ ...current, projects: { ...current.projects, title: event.target.value } }))} /></label>
            <label>Texte bouton projet<input value={config.projects.openLabel} onChange={(event) => updateConfig((current) => ({ ...current, projects: { ...current.projects, openLabel: event.target.value } }))} /></label>
            <label>Label Contact<input value={config.contact.heading} onChange={(event) => updateConfig((current) => ({ ...current, contact: { ...current.contact, heading: event.target.value } }))} /></label>
            <label className="fullWidth">A propos<textarea rows={4} value={config.about.body} onChange={(event) => updateConfig((current) => ({ ...current, about: { ...current.about, body: event.target.value } }))} /></label>
            <label className="fullWidth">Services</label>
            <div className="fullWidth stackList">
              {config.services.items.map((item, index) => (
                <div className="itemEditor" key={`${item.title}-${index}`}>
                  <input value={item.title} onChange={(event) => updateService(index, "title", event.target.value)} placeholder="Titre du service" />
                  <textarea rows={3} value={item.description} onChange={(event) => updateService(index, "description", event.target.value)} placeholder="Description du service" />
                  <div className="inlineActionRow">
                    <button className="buttonSecondary" disabled={index === 0} onClick={() => moveServiceItem(index, -1)} type="button">Monter</button>
                    <button className="buttonSecondary" disabled={index === config.services.items.length - 1} onClick={() => moveServiceItem(index, 1)} type="button">Descendre</button>
                  </div>
                  <button className="buttonDanger" onClick={() => updateConfig((current) => ({ ...current, services: { ...current.services, items: current.services.items.filter((_, itemIndex) => itemIndex !== index) } }))} type="button">Supprimer ce service</button>
                </div>
              ))}
              <button className="buttonSecondary" onClick={() => updateConfig((current) => ({ ...current, services: { ...current.services, items: [...current.services.items, { title: "Nouveau service", description: "" }] } }))} type="button">Ajouter un service</button>
            </div>
            <label className="fullWidth">Projets</label>
            <div className="fullWidth stackList">
              {config.projects.items.map((item, index) => (
                <div className="itemEditor" key={`${item.name}-${index}`}>
                  <input value={item.name} onChange={(event) => updateProject(index, "name", event.target.value)} placeholder="Nom du projet" />
                  <textarea rows={3} value={item.summary} onChange={(event) => updateProject(index, "summary", event.target.value)} placeholder="Resume du projet" />
                  <input value={item.url} onChange={(event) => updateProject(index, "url", event.target.value)} placeholder="https://..." />
                  <div className="inlineActionRow">
                    <button className="buttonSecondary" disabled={index === 0} onClick={() => moveProjectItem(index, -1)} type="button">Monter</button>
                    <button className="buttonSecondary" disabled={index === config.projects.items.length - 1} onClick={() => moveProjectItem(index, 1)} type="button">Descendre</button>
                  </div>
                  <button className="buttonDanger" onClick={() => updateConfig((current) => ({ ...current, projects: { ...current.projects, items: current.projects.items.filter((_, itemIndex) => itemIndex !== index) } }))} type="button">Supprimer ce projet</button>
                </div>
              ))}
              <button className="buttonSecondary" onClick={() => updateConfig((current) => ({ ...current, projects: { ...current.projects, items: [...current.projects.items, { name: "Nouveau projet", summary: "", url: "#" }] } }))} type="button">Ajouter un projet</button>
            </div>
            <label className="fullWidth">Cursus</label>
            <div className="fullWidth stackList">
              {config.cursus.items.map((item, index) => (
                <div className="itemEditor" key={`${item.period}-${item.diploma}-${index}`}>
                  <input value={item.period} onChange={(event) => updateCursus(index, "period", event.target.value)} placeholder="Periode" />
                  <input value={item.diploma} onChange={(event) => updateCursus(index, "diploma", event.target.value)} placeholder="Diplome / parcours" />
                  <input value={item.institution} onChange={(event) => updateCursus(index, "institution", event.target.value)} placeholder="Ecole / institution" />
                  <textarea rows={3} value={item.details} onChange={(event) => updateCursus(index, "details", event.target.value)} placeholder="Details" />
                  <div className="inlineActionRow">
                    <button className="buttonSecondary" disabled={index === 0} onClick={() => moveCursusItem(index, -1)} type="button">Monter</button>
                    <button className="buttonSecondary" disabled={index === config.cursus.items.length - 1} onClick={() => moveCursusItem(index, 1)} type="button">Descendre</button>
                  </div>
                  <button className="buttonDanger" onClick={() => updateConfig((current) => ({ ...current, cursus: { ...current.cursus, items: current.cursus.items.filter((_, itemIndex) => itemIndex !== index) } }))} type="button">Supprimer ce cursus</button>
                </div>
              ))}
              <button className="buttonSecondary" onClick={() => updateConfig((current) => ({ ...current, cursus: { ...current.cursus, items: [...current.cursus.items, { period: "2026", diploma: "Nouveau cursus", institution: "", details: "" }] } }))} type="button">Ajouter un cursus</button>
            </div>
            <label className="fullWidth">Experiences professionnelles</label>
            <div className="fullWidth stackList">
              {config.experience.items.map((item, index) => (
                <div className="itemEditor" key={`${item.period}-${item.role}-${index}`}>
                  <input value={item.period} onChange={(event) => updateExperience(index, "period", event.target.value)} placeholder="Periode" />
                  <input value={item.role} onChange={(event) => updateExperience(index, "role", event.target.value)} placeholder="Poste" />
                  <input value={item.company} onChange={(event) => updateExperience(index, "company", event.target.value)} placeholder="Entreprise" />
                  <textarea rows={3} value={item.details} onChange={(event) => updateExperience(index, "details", event.target.value)} placeholder="Details" />
                  <div className="inlineActionRow">
                    <button className="buttonSecondary" disabled={index === 0} onClick={() => moveExperienceItem(index, -1)} type="button">Monter</button>
                    <button className="buttonSecondary" disabled={index === config.experience.items.length - 1} onClick={() => moveExperienceItem(index, 1)} type="button">Descendre</button>
                  </div>
                  <button className="buttonDanger" onClick={() => updateConfig((current) => ({ ...current, experience: { ...current.experience, items: current.experience.items.filter((_, itemIndex) => itemIndex !== index) } }))} type="button">Supprimer cette experience</button>
                </div>
              ))}
              <button className="buttonSecondary" onClick={() => updateConfig((current) => ({ ...current, experience: { ...current.experience, items: [...current.experience.items, { period: "2026", role: "Nouveau poste", company: "", details: "" }] } }))} type="button">Ajouter une experience</button>
            </div>
            <label className="fullWidth">Reseaux</label>
            <div className="fullWidth stackList">
              {config.socialLinks.map((item, index) => (
                <div className="inlineItemEditor" key={`${item.label}-${index}`}>
                  <input value={item.label} onChange={(event) => updateSocial(index, "label", event.target.value)} placeholder="Nom du reseau" />
                  <input value={item.href} onChange={(event) => updateSocial(index, "href", event.target.value)} placeholder="https://..." />
                  <div className="inlineActionRow fullWidth">
                    <button className="buttonSecondary" disabled={index === 0} onClick={() => moveSocialLink(index, -1)} type="button">Monter</button>
                    <button className="buttonSecondary" disabled={index === config.socialLinks.length - 1} onClick={() => moveSocialLink(index, 1)} type="button">Descendre</button>
                    <button className="buttonDanger" onClick={() => updateConfig((current) => ({ ...current, socialLinks: current.socialLinks.filter((_, itemIndex) => itemIndex !== index) }))} type="button">Supprimer</button>
                  </div>
                </div>
              ))}
              <button className="buttonSecondary" onClick={() => updateConfig((current) => ({ ...current, socialLinks: [...current.socialLinks, { label: "Nouveau reseau", href: "#" }] }))} type="button">Ajouter un reseau</button>
            </div>
            <label>Email<input value={config.contact.email} onChange={(event) => updateConfig((current) => ({ ...current, contact: { ...current.contact, email: event.target.value } }))} /></label>
            <label>Telephone<input value={config.contact.phone} onChange={(event) => updateConfig((current) => ({ ...current, contact: { ...current.contact, phone: event.target.value } }))} /></label>
            <label className="fullWidth">Message de contact<textarea rows={3} value={config.contact.callToAction} onChange={(event) => updateConfig((current) => ({ ...current, contact: { ...current.contact, callToAction: event.target.value } }))} /></label>
          </div>
        </article>
        ) : null}

        {isPage("translations") ? (
        <article className="adminCard" id="admin-translations">
          <div className="cardHeader">
            <div>
              <p className="sectionLabel">Traductions</p>
              <h2>Saisie manuelle des traductions</h2>
              <p className="cardDescription">
                Entre ici toutes les traductions manuelles. Plus de traduction
                automatique.
              </p>
            </div>
          </div>
          <div className="languageToggle translationToggle" role="group" aria-label="Langue de traduction">
            {(["mg", "en"] as const).map((lang) => (
              <button
                className={translationLanguage === lang ? "languageButton active" : "languageButton"}
                key={lang}
                onClick={() => setTranslationLanguage(lang)}
                type="button"
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="stackList">
            {translationFields.map((field) => (
              <div className="itemEditor" key={field.source}>
                <strong>{field.label}</strong>
                <p className="translationSource">
                  Source FR: {field.source}
                </p>
                <textarea
                  onChange={(event) =>
                    updateManualTranslation(field.source, event.target.value)
                  }
                  placeholder={`Traduction ${translationLanguage.toUpperCase()}`}
                  rows={3}
                  value={
                    config.translations[translationLanguage][field.source] ?? ""
                  }
                />
              </div>
            ))}
          </div>
        </article>
        ) : null}

        {isPage("colors") ? (
        <article className="adminCard" id="admin-colors">
          <div className="cardHeader"><div><p className="sectionLabel">Couleurs</p><h2>Palette claire et sombre</h2></div></div>
          <div className="paletteSuggestionGrid">
            {paletteSuggestions.map((palette) => (
              <button className="paletteCard" key={palette.name} onClick={() => updateConfig((current) => ({ ...current, theme: palette.theme }))} type="button">
                <div className="palettePreview">{[palette.theme.primary, palette.theme.secondary, palette.theme.accent, palette.theme.background, palette.theme.darkSurface].map((color) => <span key={color} style={{ background: color }} />)}</div>
                <strong>{palette.name}</strong>
                <small>Appliquer cette suggestion</small>
              </button>
            ))}
          </div>
          <div className="colorGrid">
            {([["primary", "Couleur primaire"], ["secondary", "Couleur secondaire"], ["accent", "Accent"], ["background", "Fond clair"], ["surface", "Surface claire"], ["text", "Texte clair"], ["muted", "Texte secondaire clair"], ["darkBackground", "Fond sombre"], ["darkSurface", "Surface sombre"], ["darkText", "Texte sombre"], ["darkMuted", "Texte secondaire sombre"]] as const).map(([key, label]) => (
              <label key={key}>{label}<input type="color" value={config.theme[key]} onChange={(event) => updateConfig((current) => ({ ...current, theme: { ...current.theme, [key]: event.target.value } }))} /></label>
            ))}
          </div>
        </article>
        ) : null}
      </section>
      <button className="floatingSaveButton" disabled={isPending} onClick={saveConfig} type="button">
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </div>
  );
}
