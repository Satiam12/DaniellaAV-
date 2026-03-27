"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import type { PortfolioConfig, ThemeMode } from "@/lib/portfolio";

type AdminEditorProps = {
  initialConfig: PortfolioConfig;
};

const paletteSuggestions = [
  {
    name: "Terre chaude",
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
  },
  {
    name: "Ocean atelier",
    theme: {
      primary: "#0f6c7a",
      secondary: "#b6e3ea",
      accent: "#f08a5d",
      background: "#edf8fa",
      surface: "#ffffff",
      text: "#14343a",
      muted: "#5c7c82",
      darkBackground: "#09181d",
      darkSurface: "#10242b",
      darkText: "#ecf7f8",
      darkMuted: "#91afb4",
    },
  },
  {
    name: "Studio sable",
    theme: {
      primary: "#a44f2f",
      secondary: "#f1d3a3",
      accent: "#5f7c45",
      background: "#fbf3e6",
      surface: "#fffaf2",
      text: "#2e2017",
      muted: "#7b6659",
      darkBackground: "#161310",
      darkSurface: "#211b16",
      darkText: "#fff5e7",
      darkMuted: "#c4b5a1",
    },
  },
];

export function AdminEditor({ initialConfig }: AdminEditorProps) {
  const [config, setConfig] = useState(initialConfig);
  const [status, setStatus] = useState("Pret a enregistrer");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<
    "hero" | "profile" | "gallery" | "project"
  >("gallery");
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  function updateConfig(updater: (current: PortfolioConfig) => PortfolioConfig) {
    setConfig((current) => updater(current));
  }

  function applyPalette(theme: PortfolioConfig["theme"]) {
    updateConfig((current) => ({
      ...current,
      theme,
    }));
    setStatus("Palette appliquee. Pense a enregistrer.");
  }

  function updateArrayItem<
    K extends keyof PortfolioConfig,
    T extends PortfolioConfig[K] extends Array<infer Item> ? Item : never,
  >(key: K, index: number, updater: (item: T) => T) {
    updateConfig((current) => ({
      ...current,
      [key]: (current[key] as T[]).map((item, itemIndex) =>
        itemIndex === index ? updater(item) : item,
      ),
    }));
  }

  function removeArrayItem<
    K extends keyof PortfolioConfig,
    T extends PortfolioConfig[K] extends Array<infer Item> ? Item : never,
  >(key: K, index: number) {
    updateConfig((current) => ({
      ...current,
      [key]: (current[key] as T[]).filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function addArrayItem<
    K extends keyof PortfolioConfig,
    T extends PortfolioConfig[K] extends Array<infer Item> ? Item : never,
  >(key: K, newItem: T) {
    updateConfig((current) => ({
      ...current,
      [key]: [...(current[key] as T[]), newItem],
    }));
  }

  function updateHeroStat(
    index: number,
    updater: (item: PortfolioConfig["hero"]["stats"][number]) => PortfolioConfig["hero"]["stats"][number],
  ) {
    updateConfig((current) => ({
      ...current,
      hero: {
        ...current.hero,
        stats: current.hero.stats.map((item, itemIndex) =>
          itemIndex === index ? updater(item) : item,
        ),
      },
    }));
  }

  function removeHeroStat(index: number) {
    updateConfig((current) => ({
      ...current,
      hero: {
        ...current.hero,
        stats: current.hero.stats.filter((_item, itemIndex) => itemIndex !== index),
      },
    }));
  }

  function addHeroStat(newItem: PortfolioConfig["hero"]["stats"][number]) {
    updateConfig((current) => ({
      ...current,
      hero: {
        ...current.hero,
        stats: [...current.hero.stats, newItem],
      },
    }));
  }

  function updateServiceItem(
    index: number,
    updater: (
      item: PortfolioConfig["services"]["items"][number],
    ) => PortfolioConfig["services"]["items"][number],
  ) {
    updateConfig((current) => ({
      ...current,
      services: {
        ...current.services,
        items: current.services.items.map((item, itemIndex) =>
          itemIndex === index ? updater(item) : item,
        ),
      },
    }));
  }

  function removeServiceItem(index: number) {
    updateConfig((current) => ({
      ...current,
      services: {
        ...current.services,
        items: current.services.items.filter((_item, itemIndex) => itemIndex !== index),
      },
    }));
  }

  function addServiceItem(newItem: PortfolioConfig["services"]["items"][number]) {
    updateConfig((current) => ({
      ...current,
      services: {
        ...current.services,
        items: [...current.services.items, newItem],
      },
    }));
  }

  function updateProjectItem(
    index: number,
    updater: (
      item: PortfolioConfig["projects"]["items"][number],
    ) => PortfolioConfig["projects"]["items"][number],
  ) {
    updateConfig((current) => ({
      ...current,
      projects: {
        ...current.projects,
        items: current.projects.items.map((item, itemIndex) =>
          itemIndex === index ? updater(item) : item,
        ),
      },
    }));
  }

  function removeProjectItem(index: number) {
    updateConfig((current) => ({
      ...current,
      projects: {
        ...current.projects,
        items: current.projects.items.filter((_item, itemIndex) => itemIndex !== index),
      },
    }));
  }

  function addProjectItem(newItem: PortfolioConfig["projects"]["items"][number]) {
    updateConfig((current) => ({
      ...current,
      projects: {
        ...current.projects,
        items: [...current.projects.items, newItem],
      },
    }));
  }

  function updateGalleryImage(
    index: number,
    updater: (
      item: PortfolioConfig["gallery"]["images"][number],
    ) => PortfolioConfig["gallery"]["images"][number],
  ) {
    updateConfig((current) => ({
      ...current,
      gallery: {
        ...current.gallery,
        images: current.gallery.images.map((item, itemIndex) =>
          itemIndex === index ? updater(item) : item,
        ),
      },
    }));
  }

  function removeGalleryImage(index: number) {
    updateConfig((current) => ({
      ...current,
      gallery: {
        ...current.gallery,
        images: current.gallery.images.filter((_item, itemIndex) => itemIndex !== index),
      },
    }));
  }

  function addGalleryImage(newItem: PortfolioConfig["gallery"]["images"][number]) {
    updateConfig((current) => ({
      ...current,
      gallery: {
        ...current.gallery,
        images: [...current.gallery.images, newItem],
      },
    }));
  }

  async function uploadFile(file: File) {
    setIsUploading(true);
    setStatus("Upload de l'image...");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    setIsUploading(false);

    if (!response.ok) {
      setStatus("Erreur pendant l'upload");
      return null;
    }

    const data = (await response.json()) as { url: string };
    return data.url;
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
        setStatus("Erreur pendant l'enregistrement");
        return;
      }

      const data = (await response.json()) as { config: PortfolioConfig };
      setConfig(data.config);
      setStatus("Configuration enregistree");
    });
  }

  async function uploadImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const url = await uploadFile(file);

    if (!url) {
      return;
    }

    updateConfig((current) => {
      if (uploadTarget === "hero") {
        return {
          ...current,
          hero: {
            ...current.hero,
            heroImage: url,
          },
        };
      }

      if (uploadTarget === "profile") {
        return {
          ...current,
          hero: {
            ...current.hero,
            showProfileImage: true,
            profileImage: url,
          },
        };
      }

      if (uploadTarget === "project") {
        return {
          ...current,
          projects: {
            ...current.projects,
            items: current.projects.items.map((item, index) =>
              index === selectedProjectIndex ? { ...item, image: url } : item,
            ),
          },
        };
      }

      return {
        ...current,
        gallery: {
          ...current.gallery,
          images: [
            { src: url, alt: `Visuel ${file.name}` },
            ...current.gallery.images,
          ].slice(0, 8),
        },
      };
    });

    setStatus("Image ajoutee. Pense a enregistrer.");
    event.target.value = "";
  }

  async function uploadProfileImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const url = await uploadFile(file);

    if (!url) {
      return;
    }

    updateConfig((current) => ({
      ...current,
      hero: {
        ...current.hero,
        showProfileImage: true,
        profileImage: url,
      },
    }));

    setStatus("Photo de profil ajoutee. Pense a enregistrer.");
    event.target.value = "";
  }

  async function uploadProjectImage(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const url = await uploadFile(file);

    if (!url) {
      return;
    }

    updateProjectItem(index, (currentItem) => ({
      ...currentItem,
      image: url,
    }));

    setStatus("Image du projet ajoutee. Pense a enregistrer.");
    event.target.value = "";
  }

  return (
    <div className="adminShell">
      <aside className="adminSidebar">
        <p className="sidebarKicker">Console de pilotage</p>
        <h1>Studio satiam</h1>
        <p>
          Un espace simple pour gerer le portfolio, les images, les sections et
          les couleurs depuis mobile ou desktop.
        </p>
        <button className="buttonPrimaryAction" disabled={isPending} onClick={saveConfig} type="button">
          {isPending ? "Enregistrement..." : "Enregistrer"}
        </button>
        <span className="statusPill">{status}</span>
        <div className="adminMiniGrid">
          <div className="miniStat">
            <strong>{config.projects.items.length}</strong>
            <span>Projets</span>
          </div>
          <div className="miniStat">
            <strong>{config.gallery.images.filter((image) => image.src).length}</strong>
            <span>Images</span>
          </div>
          <div className="miniStat">
            <strong>
              {
                [
                  config.about.enabled,
                  config.services.enabled,
                  config.projects.enabled,
                  config.gallery.enabled,
                  config.contact.enabled,
                ].filter(Boolean).length
              }
            </strong>
            <span>Sections</span>
          </div>
        </div>
        <Link href="/">Voir le portfolio public</Link>
      </aside>

      <section className="adminPanels">
        <article className="adminHeroCard">
          <div>
            <p className="sectionLabel">Tableau de bord</p>
            <h2>Interface moderne, rapide et facile a prendre en main</h2>
            <p className="adminHeroText">
              Modifie le contenu, applique une palette, ajoute des photos et
              ajuste l&apos;affichage sans toucher au code.
            </p>
          </div>
          <div className="adminQuickGrid">
            <div className="quickCard">
              <span>Photo de profil</span>
              <strong>{config.hero.showProfileImage && config.hero.profileImage ? "Active" : "Masquee"}</strong>
            </div>
            <div className="quickCard">
              <span>Mode sombre</span>
              <strong>{config.preferences.showDarkModeToggle ? "Disponible" : "Masque"}</strong>
            </div>
            <div className="quickCard">
              <span>Couleur active</span>
              <strong>{config.theme.primary}</strong>
            </div>
          </div>
        </article>

        <article className="adminCard">
          <div className="cardHeader">
            <div>
              <p className="sectionLabel">Site</p>
              <h2>Identite generale</h2>
              <p className="cardDescription">
                Renseigne les infos de base affichees en haut du portfolio.
              </p>
            </div>
          </div>
          <div className="formGrid">
            <label>
              Nom du proprietaire
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    site: { ...current.site, ownerName: event.target.value },
                  }))
                }
                value={config.site.ownerName}
              />
            </label>
            <label>
              Titre de navigation
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    site: { ...current.site, navTitle: event.target.value },
                  }))
                }
                value={config.site.navTitle}
              />
            </label>
            <label>
              Localisation
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    site: { ...current.site, location: event.target.value },
                  }))
                }
                value={config.site.location}
              />
            </label>
            <label>
              Mode par defaut
              <select
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    preferences: {
                      ...current.preferences,
                      defaultMode: event.target.value as ThemeMode,
                    },
                  }))
                }
                value={config.preferences.defaultMode}
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
              </select>
            </label>
            <label className="checkboxRow">
              <input
                checked={config.preferences.showDarkModeToggle}
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    preferences: {
                      ...current.preferences,
                      showDarkModeToggle: event.target.checked,
                    },
                  }))
                }
                type="checkbox"
              />
              Afficher le bouton mode sombre
            </label>
          </div>
        </article>

        <article className="adminCard">
          <div className="cardHeader">
            <div>
              <p className="sectionLabel">Hero</p>
              <h2>Bloc principal et boutons</h2>
              <p className="cardDescription">
                Controle la premiere impression: photo, message, boutons et visuel.
              </p>
            </div>
          </div>
          <div className="formGrid">
            <label>
              Badge
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: { ...current.hero, badge: event.target.value },
                  }))
                }
                value={config.hero.badge}
              />
            </label>
            <label>
              Sous-titre
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: { ...current.hero, subtitle: event.target.value },
                  }))
                }
                value={config.hero.subtitle}
              />
            </label>
            <label className="fullWidth">
              Titre hero
              <textarea
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: { ...current.hero, title: event.target.value },
                  }))
                }
                rows={3}
                value={config.hero.title}
              />
            </label>
            <label className="fullWidth">
              Description
              <textarea
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: { ...current.hero, description: event.target.value },
                  }))
                }
                rows={4}
                value={config.hero.description}
              />
            </label>
            <label className="checkboxRow">
              <input
                checked={config.hero.showProfileImage}
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      showProfileImage: event.target.checked,
                    },
                  }))
                }
                type="checkbox"
              />
              Afficher la photo de profil
            </label>
            <label>
              URL photo de profil
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      profileImage: event.target.value,
                    },
                  }))
                }
                placeholder="/uploads/photo-profil.jpg"
                value={config.hero.profileImage}
              />
            </label>
            <label className="uploadField">
              Telecharger la photo de profil
              <input disabled={isUploading} onChange={uploadProfileImage} type="file" />
            </label>
            <label>
              Visuel principal
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      heroImage: event.target.value,
                    },
                  }))
                }
                placeholder="/uploads/hero.jpg"
                value={config.hero.heroImage}
              />
            </label>
            <label>
              Bouton 1 texte
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      primaryButton: {
                        ...current.hero.primaryButton,
                        label: event.target.value,
                      },
                    },
                  }))
                }
                value={config.hero.primaryButton.label}
              />
            </label>
            <label>
              Bouton 1 lien
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      primaryButton: {
                        ...current.hero.primaryButton,
                        href: event.target.value,
                      },
                    },
                  }))
                }
                value={config.hero.primaryButton.href}
              />
            </label>
            <label className="checkboxRow">
              <input
                checked={config.hero.primaryButton.enabled}
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      primaryButton: {
                        ...current.hero.primaryButton,
                        enabled: event.target.checked,
                      },
                    },
                  }))
                }
                type="checkbox"
              />
              Afficher le bouton principal
            </label>
            <label>
              Bouton 2 texte
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      secondaryButton: {
                        ...current.hero.secondaryButton,
                        label: event.target.value,
                      },
                    },
                  }))
                }
                value={config.hero.secondaryButton.label}
              />
            </label>
            <label>
              Bouton 2 lien
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      secondaryButton: {
                        ...current.hero.secondaryButton,
                        href: event.target.value,
                      },
                    },
                  }))
                }
                value={config.hero.secondaryButton.href}
              />
            </label>
            <label className="checkboxRow">
              <input
                checked={config.hero.secondaryButton.enabled}
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      secondaryButton: {
                        ...current.hero.secondaryButton,
                        enabled: event.target.checked,
                      },
                    },
                  }))
                }
                type="checkbox"
              />
              Afficher le bouton secondaire
            </label>
            <label className="fullWidth">
              Statistiques
            </label>
            <div className="fullWidth stackList">
              {config.hero.stats.map((item, index) => (
                <div className="inlineItemEditor" key={`${item.label}-${index}`}>
                  <input
                    onChange={(event) =>
                      updateHeroStat(index, (currentItem) => ({
                        ...currentItem,
                        value: event.target.value,
                      }))
                    }
                    placeholder="Valeur"
                    value={item.value}
                  />
                  <input
                    onChange={(event) =>
                      updateHeroStat(index, (currentItem) => ({
                        ...currentItem,
                        label: event.target.value,
                      }))
                    }
                    placeholder="Label"
                    value={item.label}
                  />
                  <button
                    className="buttonDanger"
                    onClick={() => removeHeroStat(index)}
                    type="button"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
              <button
                className="buttonSecondary"
                onClick={() => addHeroStat({ value: "0", label: "Nouvelle statistique" })}
                type="button"
              >
                Ajouter une statistique
              </button>
            </div>
            <label className="fullWidth uploadField">
              Importer une image depuis le poste local
              <select
                onChange={(event) =>
                  setUploadTarget(
                    event.target.value as "hero" | "profile" | "gallery" | "project",
                  )
                }
                value={uploadTarget}
              >
                <option value="gallery">Ajouter a la galerie</option>
                <option value="hero">Remplacer le visuel principal</option>
                <option value="profile">Remplacer la photo de profil</option>
                <option value="project">Affecter a un projet</option>
              </select>
              {uploadTarget === "project" ? (
                <select
                  onChange={(event) => setSelectedProjectIndex(Number(event.target.value))}
                  value={selectedProjectIndex}
                >
                  {config.projects.items.map((item, index) => (
                    <option key={`${item.name}-${index}`} value={index}>
                      {item.name || `Projet ${index + 1}`}
                    </option>
                  ))}
                </select>
              ) : null}
              <input disabled={isUploading} onChange={uploadImage} type="file" />
            </label>
            <div className="fullWidth inlineActionRow">
              <button
                className="buttonDanger"
                onClick={() =>
                  updateConfig((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      profileImage: "",
                      showProfileImage: false,
                    },
                  }))
                }
                type="button"
              >
                Supprimer la photo de profil
              </button>
              <button
                className="buttonDanger"
                onClick={() =>
                  updateConfig((current) => ({
                    ...current,
                    hero: {
                      ...current.hero,
                      heroImage: "",
                    },
                  }))
                }
                type="button"
              >
                Supprimer le visuel principal
              </button>
            </div>
          </div>
        </article>

        <article className="adminCard">
          <div className="cardHeader">
            <div>
              <p className="sectionLabel">Sections</p>
              <h2>Afficher ou supprimer des onglets</h2>
              <p className="cardDescription">
                Active seulement les blocs utiles pour garder un portfolio net.
              </p>
            </div>
          </div>
          <div className="toggleGrid">
            {[
              ["about", "Section A propos"],
              ["services", "Section Services"],
              ["projects", "Section Projets"],
              ["gallery", "Section Galerie"],
              ["contact", "Section Contact"],
            ].map(([key, label]) => {
              const sectionKey = key as
                | "about"
                | "services"
                | "projects"
                | "gallery"
                | "contact";

              return (
                <label className="checkboxRow" key={sectionKey}>
                  <input
                    checked={config[sectionKey].enabled}
                    onChange={(event) =>
                      updateConfig((current) => ({
                        ...current,
                        [sectionKey]: {
                          ...current[sectionKey],
                          enabled: event.target.checked,
                        },
                      }))
                    }
                    type="checkbox"
                  />
                  {label}
                </label>
              );
            })}
          </div>
        </article>

        <article className="adminCard">
          <div className="cardHeader">
            <div>
              <p className="sectionLabel">Contenu</p>
              <h2>Textes et listes</h2>
              <p className="cardDescription">
                Ajoute, edite ou retire des cartes sans passer par des fichiers.
              </p>
            </div>
          </div>
          <div className="formGrid">
            <label className="fullWidth">
              A propos
              <textarea
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    about: { ...current.about, body: event.target.value },
                  }))
                }
                rows={4}
                value={config.about.body}
              />
            </label>
            <label className="fullWidth">
              Services
            </label>
            <div className="fullWidth stackList">
              {config.services.items.map((item, index) => (
                <div className="itemEditor" key={`${item.title}-${index}`}>
                  <input
                    onChange={(event) =>
                      updateServiceItem(index, (currentItem) => ({
                        ...currentItem,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Titre du service"
                    value={item.title}
                  />
                  <textarea
                    onChange={(event) =>
                      updateServiceItem(index, (currentItem) => ({
                        ...currentItem,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Description du service"
                    rows={3}
                    value={item.description}
                  />
                  <button
                    className="buttonDanger"
                    onClick={() => removeServiceItem(index)}
                    type="button"
                  >
                    Supprimer ce service
                  </button>
                </div>
              ))}
              <button
                className="buttonSecondary"
                onClick={() => addServiceItem({ title: "Nouveau service", description: "" })}
                type="button"
              >
                Ajouter un service
              </button>
            </div>
            <label className="fullWidth">
              Projets
            </label>
            <div className="fullWidth stackList">
              {config.projects.items.map((item, index) => (
                <div className="itemEditor" key={`${item.name}-${index}`}>
                  <input
                    onChange={(event) =>
                      updateProjectItem(index, (currentItem) => ({
                        ...currentItem,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Nom du projet"
                    value={item.name}
                  />
                  <textarea
                    onChange={(event) =>
                      updateProjectItem(index, (currentItem) => ({
                        ...currentItem,
                        summary: event.target.value,
                      }))
                    }
                    placeholder="Resume du projet"
                    rows={3}
                    value={item.summary}
                  />
                  <input
                    onChange={(event) =>
                      updateProjectItem(index, (currentItem) => ({
                        ...currentItem,
                        url: event.target.value,
                      }))
                    }
                    placeholder="https://..."
                    value={item.url}
                  />
                  <input
                    onChange={(event) =>
                      updateProjectItem(index, (currentItem) => ({
                        ...currentItem,
                        image: event.target.value,
                      }))
                    }
                    placeholder="/uploads/image-projet.jpg"
                    value={item.image ?? ""}
                  />
                  <label className="uploadField">
                    Telecharger une image pour ce projet
                    <input
                      disabled={isUploading}
                      onChange={(event) => uploadProjectImage(index, event)}
                      type="file"
                    />
                  </label>
                  <div className="inlineActionRow">
                    <button
                      className="buttonDanger"
                      onClick={() =>
                        updateProjectItem(index, (currentItem) => ({
                          ...currentItem,
                          image: "",
                        }))
                      }
                      type="button"
                    >
                      Supprimer l&apos;image du projet
                    </button>
                  </div>
                  <button
                    className="buttonDanger"
                    onClick={() => removeProjectItem(index)}
                    type="button"
                  >
                    Supprimer ce projet
                  </button>
                </div>
              ))}
              <button
                className="buttonSecondary"
                onClick={() =>
                  addProjectItem({
                    name: "Nouveau projet",
                    summary: "",
                    url: "#",
                    image: "",
                  })
                }
                type="button"
              >
                Ajouter un projet
              </button>
            </div>
            <label className="fullWidth">
              Reseaux
            </label>
            <div className="fullWidth stackList">
              {config.socialLinks.map((item, index) => (
                <div className="inlineItemEditor" key={`${item.label}-${index}`}>
                  <input
                    onChange={(event) =>
                      updateArrayItem("socialLinks", index, (currentItem) => ({
                        ...currentItem,
                        label: event.target.value,
                      }))
                    }
                    placeholder="Nom du reseau"
                    value={item.label}
                  />
                  <input
                    onChange={(event) =>
                      updateArrayItem("socialLinks", index, (currentItem) => ({
                        ...currentItem,
                        href: event.target.value,
                      }))
                    }
                    placeholder="https://..."
                    value={item.href}
                  />
                  <button
                    className="buttonDanger"
                    onClick={() => removeArrayItem("socialLinks", index)}
                    type="button"
                  >
                    Supprimer
                  </button>
                </div>
              ))}
              <button
                className="buttonSecondary"
                onClick={() =>
                  addArrayItem("socialLinks", {
                    label: "Nouveau reseau",
                    href: "#",
                  })
                }
                type="button"
              >
                Ajouter un reseau
              </button>
            </div>
            <label>
              Email
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    contact: { ...current.contact, email: event.target.value },
                  }))
                }
                value={config.contact.email}
              />
            </label>
            <label>
              Telephone
              <input
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    contact: { ...current.contact, phone: event.target.value },
                  }))
                }
                value={config.contact.phone}
              />
            </label>
            <label className="fullWidth">
              Message de contact
              <textarea
                onChange={(event) =>
                  updateConfig((current) => ({
                    ...current,
                    contact: {
                      ...current.contact,
                      callToAction: event.target.value,
                    },
                  }))
                }
                rows={3}
                value={config.contact.callToAction}
              />
            </label>
            <label className="fullWidth">
              Galerie d&apos;images
            </label>
            <div className="fullWidth stackList">
              {config.gallery.images.map((image, index) => (
                <div className="itemEditor" key={`${image.src}-${index}`}>
                  <input
                    onChange={(event) =>
                      updateGalleryImage(index, (currentItem) => ({
                        ...currentItem,
                        src: event.target.value,
                      }))
                    }
                    placeholder="/uploads/mon-image.jpg"
                    value={image.src}
                  />
                  <input
                    onChange={(event) =>
                      updateGalleryImage(index, (currentItem) => ({
                        ...currentItem,
                        alt: event.target.value,
                      }))
                    }
                    placeholder="Description image"
                    value={image.alt}
                  />
                  <button
                    className="buttonDanger"
                    onClick={() => removeGalleryImage(index)}
                    type="button"
                  >
                    Supprimer cette image
                  </button>
                </div>
              ))}
              <button
                className="buttonSecondary"
                onClick={() => addGalleryImage({ src: "", alt: "Nouvelle image" })}
                type="button"
              >
                Ajouter une image
              </button>
            </div>
          </div>
        </article>

        <article className="adminCard">
          <div className="cardHeader">
            <div>
              <p className="sectionLabel">Couleurs</p>
              <h2>Palette claire et sombre</h2>
              <p className="cardDescription">
                Choisis une base visuelle puis ajuste chaque couleur si besoin.
              </p>
            </div>
          </div>
          <div className="paletteSuggestionGrid">
            {paletteSuggestions.map((palette) => (
              <button
                className="paletteCard"
                key={palette.name}
                onClick={() => applyPalette(palette.theme)}
                type="button"
              >
                <div className="palettePreview">
                  {[
                    palette.theme.primary,
                    palette.theme.secondary,
                    palette.theme.accent,
                    palette.theme.background,
                    palette.theme.darkSurface,
                  ].map((color) => (
                    <span key={color} style={{ background: color }} />
                  ))}
                </div>
                <strong>{palette.name}</strong>
                <small>Appliquer cette suggestion</small>
              </button>
            ))}
          </div>
          <div className="colorGrid">
            {[
              ["primary", "Couleur primaire"],
              ["secondary", "Couleur secondaire"],
              ["accent", "Accent"],
              ["background", "Fond clair"],
              ["surface", "Surface claire"],
              ["text", "Texte clair"],
              ["muted", "Texte secondaire clair"],
              ["darkBackground", "Fond sombre"],
              ["darkSurface", "Surface sombre"],
              ["darkText", "Texte sombre"],
              ["darkMuted", "Texte secondaire sombre"],
            ].map(([key, label]) => (
              <label key={key}>
                {label}
                <input
                  onChange={(event) =>
                    updateConfig((current) => ({
                      ...current,
                      theme: {
                        ...current.theme,
                        [key]: event.target.value,
                      },
                    }))
                  }
                  type="color"
                  value={config.theme[key as keyof typeof config.theme]}
                />
              </label>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
