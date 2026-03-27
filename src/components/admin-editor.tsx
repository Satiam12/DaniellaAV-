"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import type {
  FontPreset,
  PortfolioConfig,
  ThemeMode,
} from "@/lib/portfolio-types";

type AdminEditorProps = { initialConfig: PortfolioConfig };

const paletteSuggestions = [
  { name: "Terre chaude", theme: { primary: "#d05f32", secondary: "#f3b57d", accent: "#1d6c63", background: "#f7efe3", surface: "#fff8ef", text: "#24150f", muted: "#6b564c", darkBackground: "#101213", darkSurface: "#171d1f", darkText: "#f7efe3", darkMuted: "#bcab9e" } },
  { name: "Ocean atelier", theme: { primary: "#0f6c7a", secondary: "#b6e3ea", accent: "#f08a5d", background: "#edf8fa", surface: "#ffffff", text: "#14343a", muted: "#5c7c82", darkBackground: "#09181d", darkSurface: "#10242b", darkText: "#ecf7f8", darkMuted: "#91afb4" } },
  { name: "Studio sable", theme: { primary: "#a44f2f", secondary: "#f1d3a3", accent: "#5f7c45", background: "#fbf3e6", surface: "#fffaf2", text: "#2e2017", muted: "#7b6659", darkBackground: "#161310", darkSurface: "#211b16", darkText: "#fff5e7", darkMuted: "#c4b5a1" } },
];

export function AdminEditor({ initialConfig }: AdminEditorProps) {
  const [config, setConfig] = useState(initialConfig);
  const [status, setStatus] = useState("Pret a enregistrer");
  const [isPending, startTransition] = useTransition();

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

  const adminSectionLinks = [
    { id: "admin-overview", label: "Tableau de bord" },
    { id: "admin-site", label: "Site" },
    { id: "admin-font-sizes", label: "Polices" },
    { id: "admin-hero", label: "Hero" },
    { id: "admin-sections", label: "Sections" },
    { id: "admin-content", label: "Contenu" },
    { id: "admin-colors", label: "Couleurs" },
  ];

  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <p className="sidebarKicker">Console de pilotage</p>
        <h1>Studio satiam</h1>
        <p>Espace simple pour gerer les textes, la palette, le mode sombre et les polices.</p>
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
          {adminSectionLinks.map((item) => (
            <a href={`#${item.id}`} key={item.id}>
              {item.label}
            </a>
          ))}
        </nav>

        <article className="adminHeroCard" id="admin-overview">
          <div>
            <p className="sectionLabel">Tableau de bord</p>
            <h2>Edition legere, sans photos et plus facile a maintenir</h2>
            <p className="adminHeroText">Le portfolio reste concentre sur le texte, le style, les couleurs et la typographie.</p>
          </div>
          <div className="adminQuickGrid">
            <div className="quickCard"><span>Police active</span><strong>{config.preferences.fontPreset}</strong></div>
            <div className="quickCard"><span>Mode sombre</span><strong>{config.preferences.showDarkModeToggle ? "Disponible" : "Masque"}</strong></div>
            <div className="quickCard"><span>Couleur active</span><strong>{config.theme.primary}</strong></div>
          </div>
        </article>

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
          </div>
        </article>

        <article className="adminCard" id="admin-font-sizes">
          <div className="cardHeader">
            <div>
              <p className="sectionLabel">Polices</p>
              <h2>Taille de texte par section</h2>
              <p className="cardDescription">Exemple: 12, 16, 20... Tu peux ajuster chaque section independamment.</p>
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
        </article>

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
                  <button className="buttonDanger" onClick={() => updateConfig((current) => ({ ...current, hero: { ...current.hero, stats: current.hero.stats.filter((_, itemIndex) => itemIndex !== index) } }))} type="button">Supprimer</button>
                </div>
              ))}
              <button className="buttonSecondary" onClick={() => updateConfig((current) => ({ ...current, hero: { ...current.hero, stats: [...current.hero.stats, { value: "0", label: "Nouvelle statistique" }] } }))} type="button">Ajouter une statistique</button>
            </div>
          </div>
        </article>

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
        </article>

        <article className="adminCard" id="admin-content">
          <div className="cardHeader"><div><p className="sectionLabel">Contenu</p><h2>Textes et listes</h2></div></div>
          <div className="formGrid">
            <label className="fullWidth">A propos<textarea rows={4} value={config.about.body} onChange={(event) => updateConfig((current) => ({ ...current, about: { ...current.about, body: event.target.value } }))} /></label>
            <label className="fullWidth">Services</label>
            <div className="fullWidth stackList">
              {config.services.items.map((item, index) => (
                <div className="itemEditor" key={`${item.title}-${index}`}>
                  <input value={item.title} onChange={(event) => updateService(index, "title", event.target.value)} placeholder="Titre du service" />
                  <textarea rows={3} value={item.description} onChange={(event) => updateService(index, "description", event.target.value)} placeholder="Description du service" />
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
                  <button className="buttonDanger" onClick={() => updateConfig((current) => ({ ...current, projects: { ...current.projects, items: current.projects.items.filter((_, itemIndex) => itemIndex !== index) } }))} type="button">Supprimer ce projet</button>
                </div>
              ))}
              <button className="buttonSecondary" onClick={() => updateConfig((current) => ({ ...current, projects: { ...current.projects, items: [...current.projects.items, { name: "Nouveau projet", summary: "", url: "#" }] } }))} type="button">Ajouter un projet</button>
            </div>
            <label className="fullWidth">Cursus</label>
            <label>Titre section cursus<input value={config.cursus.heading} onChange={(event) => updateConfig((current) => ({ ...current, cursus: { ...current.cursus, heading: event.target.value } }))} /></label>
            <div className="fullWidth stackList">
              {config.cursus.items.map((item, index) => (
                <div className="itemEditor" key={`${item.period}-${item.diploma}-${index}`}>
                  <input value={item.period} onChange={(event) => updateCursus(index, "period", event.target.value)} placeholder="Periode" />
                  <input value={item.diploma} onChange={(event) => updateCursus(index, "diploma", event.target.value)} placeholder="Diplome / parcours" />
                  <input value={item.institution} onChange={(event) => updateCursus(index, "institution", event.target.value)} placeholder="Ecole / institution" />
                  <textarea rows={3} value={item.details} onChange={(event) => updateCursus(index, "details", event.target.value)} placeholder="Details" />
                  <button className="buttonDanger" onClick={() => updateConfig((current) => ({ ...current, cursus: { ...current.cursus, items: current.cursus.items.filter((_, itemIndex) => itemIndex !== index) } }))} type="button">Supprimer ce cursus</button>
                </div>
              ))}
              <button className="buttonSecondary" onClick={() => updateConfig((current) => ({ ...current, cursus: { ...current.cursus, items: [...current.cursus.items, { period: "2026", diploma: "Nouveau cursus", institution: "", details: "" }] } }))} type="button">Ajouter un cursus</button>
            </div>
            <label className="fullWidth">Experiences professionnelles</label>
            <label>Titre section experiences<input value={config.experience.heading} onChange={(event) => updateConfig((current) => ({ ...current, experience: { ...current.experience, heading: event.target.value } }))} /></label>
            <div className="fullWidth stackList">
              {config.experience.items.map((item, index) => (
                <div className="itemEditor" key={`${item.period}-${item.role}-${index}`}>
                  <input value={item.period} onChange={(event) => updateExperience(index, "period", event.target.value)} placeholder="Periode" />
                  <input value={item.role} onChange={(event) => updateExperience(index, "role", event.target.value)} placeholder="Poste" />
                  <input value={item.company} onChange={(event) => updateExperience(index, "company", event.target.value)} placeholder="Entreprise" />
                  <textarea rows={3} value={item.details} onChange={(event) => updateExperience(index, "details", event.target.value)} placeholder="Details" />
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
                  <button className="buttonDanger" onClick={() => updateConfig((current) => ({ ...current, socialLinks: current.socialLinks.filter((_, itemIndex) => itemIndex !== index) }))} type="button">Supprimer</button>
                </div>
              ))}
              <button className="buttonSecondary" onClick={() => updateConfig((current) => ({ ...current, socialLinks: [...current.socialLinks, { label: "Nouveau reseau", href: "#" }] }))} type="button">Ajouter un reseau</button>
            </div>
            <label>Email<input value={config.contact.email} onChange={(event) => updateConfig((current) => ({ ...current, contact: { ...current.contact, email: event.target.value } }))} /></label>
            <label>Telephone<input value={config.contact.phone} onChange={(event) => updateConfig((current) => ({ ...current, contact: { ...current.contact, phone: event.target.value } }))} /></label>
            <label className="fullWidth">Message de contact<textarea rows={3} value={config.contact.callToAction} onChange={(event) => updateConfig((current) => ({ ...current, contact: { ...current.contact, callToAction: event.target.value } }))} /></label>
          </div>
        </article>

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
      </section>
      <button className="floatingSaveButton" disabled={isPending} onClick={saveConfig} type="button">
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </div>
  );
}
