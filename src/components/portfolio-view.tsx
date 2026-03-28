"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { getThemeStyles } from "@/lib/portfolio-theme";
import type { PortfolioConfig } from "@/lib/portfolio-types";

import { ThemeToggle } from "./theme-toggle";

type PortfolioViewProps = {
  config: PortfolioConfig;
};

type PortfolioLanguage = "fr" | "mg" | "en";

const translateCacheKey = (language: PortfolioLanguage) =>
  `portfolio-auto-translate-${language}`;

function shouldTranslate(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return false;
  }
  if (/^\S+@\S+\.\S+$/i.test(trimmed)) {
    return false;
  }
  if (/^[\d\s+().-]+$/.test(trimmed)) {
    return false;
  }
  if (/^[A-Z]{2,3}$/.test(trimmed)) {
    return false;
  }
  return true;
}

function useAutoTranslate(language: PortfolioLanguage) {
  const [cache, setCache] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const pendingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (language === "fr") {
      setCache({});
      return;
    }

    const stored = window.localStorage.getItem(translateCacheKey(language));
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, string>;
        setCache(parsed ?? {});
      } catch {
        setCache({});
      }
    } else {
      setCache({});
    }
  }, [language]);

  const t = useCallback(
    (text: string) => {
      if (language === "fr") {
        return text;
      }
      if (!shouldTranslate(text)) {
        return text;
      }
      const cached = cache[text];
      if (cached) {
        return cached;
      }
      pendingRef.current.add(text);
      return text;
    },
    [cache, language],
  );

  useEffect(() => {
    if (language === "fr") {
      return;
    }
    if (isTranslating) {
      return;
    }
    if (pendingRef.current.size === 0) {
      return;
    }

    const texts = Array.from(pendingRef.current);
    pendingRef.current.clear();
    let isActive = true;
    setIsTranslating(true);

    (async () => {
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target: language, texts }),
        });

        if (!response.ok) {
          throw new Error("Erreur de traduction");
        }

        const data = (await response.json()) as { translations?: string[] };
        const translations = Array.isArray(data.translations)
          ? data.translations
          : [];

        if (!isActive) {
          return;
        }

        setCache((current) => {
          const next = { ...current };
          texts.forEach((text, index) => {
            const translated = translations[index];
            next[text] =
              typeof translated === "string" && translated.trim().length > 0
                ? translated
                : text;
          });
          window.localStorage.setItem(
            translateCacheKey(language),
            JSON.stringify(next),
          );
          return next;
        });
      } catch {
        if (!isActive) {
          return;
        }
        setCache((current) => {
          const next = { ...current };
          texts.forEach((text) => {
            next[text] = text;
          });
          window.localStorage.setItem(
            translateCacheKey(language),
            JSON.stringify(next),
          );
          return next;
        });
      } finally {
        if (isActive) {
          setIsTranslating(false);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  });

  return t;
}

function SocialIcon({ label }: { label: string }) {
  const lower = label.toLowerCase();

  if (lower.includes("facebook")) {
    return (
      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.6 1.7-1.6H16.7V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H8v3h2.5v8h3Z" />
      </svg>
    );
  }

  if (lower.includes("instagram")) {
    return (
      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
        <path d="M7.8 3h8.4A4.8 4.8 0 0 1 21 7.8v8.4a4.8 4.8 0 0 1-4.8 4.8H7.8A4.8 4.8 0 0 1 3 16.2V7.8A4.8 4.8 0 0 1 7.8 3Zm0 1.8A3 3 0 0 0 4.8 7.8v8.4a3 3 0 0 0 3 3h8.4a3 3 0 0 0 3-3V7.8a3 3 0 0 0-3-3H7.8Zm8.85 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1ZM12 7.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5Zm0 1.8A2.7 2.7 0 1 0 14.7 12 2.7 2.7 0 0 0 12 9.3Z" />
      </svg>
    );
  }

  if (lower.includes("linkedin")) {
    return (
      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.2 8.3A1.8 1.8 0 1 1 6.2 4.7a1.8 1.8 0 0 1 0 3.6ZM4.7 9.8h3v9.5h-3V9.8Zm4.8 0h2.9v1.3h.1c.4-.8 1.4-1.6 2.8-1.6 3 0 3.6 2 3.6 4.6v5.2h-3v-4.6c0-1.1 0-2.5-1.5-2.5s-1.8 1.2-1.8 2.4v4.7h-3V9.8Z" />
      </svg>
    );
  }

  if (lower.includes("github")) {
    return (
      <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.5A9.5 9.5 0 0 0 9 21.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-5A3.9 3.9 0 0 1 7.6 8c-.1-.2-.4-1.2.1-2.6 0 0 .8-.2 2.6 1a8.9 8.9 0 0 1 4.8 0c1.8-1.2 2.6-1 2.6-1 .5 1.4.2 2.4.1 2.6a3.9 3.9 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2 2 7v5c0 5.5 3.8 10.6 10 12 6.2-1.4 10-6.5 10-12V7L12 2Zm0 2.2 7.5 3.7v4.1c0 4.4-2.9 8.6-7.5 9.9-4.6-1.3-7.5-5.5-7.5-9.9V7.9L12 4.2Z" />
    </svg>
  );
}

export function PortfolioView({ config }: PortfolioViewProps) {
  const [language, setLanguage] = useState<PortfolioLanguage>(() => {
    if (typeof window === "undefined") {
      return "fr";
    }

    const stored = window.localStorage.getItem("portfolio-language");
    return stored === "fr" || stored === "mg" || stored === "en" ? stored : "fr";
  });
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const themeStyles = getThemeStyles(config) as CSSProperties;
  const t = useAutoTranslate(language);
  const sizes = config.preferences.fontSizes;
  const sectionFonts = config.preferences.sectionFonts;
  const sectionLinks = [
    config.about.enabled
      ? { id: "about", label: t(config.about.heading) }
      : null,
    config.services.enabled
      ? { id: "services", label: t(config.services.heading) }
      : null,
    config.cursus.enabled
      ? { id: "cursus", label: t(config.cursus.label) }
      : null,
    config.experience.enabled
      ? { id: "experience", label: t(config.experience.label) }
      : null,
    config.projects.enabled
      ? { id: "projects", label: t(config.projects.heading) }
      : null,
    config.contact.enabled
      ? { id: "contact", label: t(config.contact.heading) }
      : null,
  ].filter(Boolean) as Array<{ id: string; label: string }>;
  const sectionIdsKey = sectionLinks.map((item) => item.id).join("|");

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (nodes.length === 0) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sectionIds = sectionIdsKey ? sectionIdsKey.split("|") : [];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection((visibleEntries[0].target as HTMLElement).id);
        }
      },
      {
        threshold: [0.2, 0.4, 0.65],
        rootMargin: "-20% 0px -45% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [sectionIdsKey]);

  function changeLanguage(nextLanguage: PortfolioLanguage) {
    setLanguage(nextLanguage);
    window.localStorage.setItem("portfolio-language", nextLanguage);
  }

  return (
    <div
      className="portfolioShell"
      data-font-preset={config.preferences.fontPreset}
      style={themeStyles}
    >
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brandMark">{config.site.ownerName.slice(0, 2)}</span>
          <span>
            <strong>{t(config.site.navTitle)}</strong>
            <small>{t(config.site.location)}</small>
          </span>
        </a>
        <nav className="nav">
          {sectionLinks.map((link) => (
            <a
              className={activeSection === link.id ? "active" : undefined}
              href={`#${link.id}`}
              key={link.id}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="toolbarGroup">
          <div className="languageToggle" role="group" aria-label="Language">
            {(["mg", "fr", "en"] as const).map((lang) => (
              <button
                className={language === lang ? "languageButton active" : "languageButton"}
                key={lang}
                onClick={() => changeLanguage(lang)}
                type="button"
              >
                {config.ui.languageLabels[lang]}
              </button>
            ))}
          </div>
          <ThemeToggle
            defaultMode={config.preferences.defaultMode}
            darkLabel={t(config.ui.themeToggle.darkLabel)}
            enabled={config.preferences.showDarkModeToggle}
            lightLabel={t(config.ui.themeToggle.lightLabel)}
          />
        </div>
      </header>

      <main id="home">
        <section
          className="heroPanel heroPanelSingle revealOnScroll"
          data-font-preset={
            sectionFonts.hero === "inherit" ? undefined : sectionFonts.hero
          }
          data-reveal
        >
          <div className="heroCopy">
            <span className="eyebrow">{t(config.hero.badge)}</span>
            <p className="subtitle" style={{ fontSize: `${Math.max(12, sizes.heroBody)}px` }}>
              {t(config.hero.subtitle)}
            </p>
            <h1 style={{ fontSize: `${Math.max(24, sizes.heroTitle)}px` }}>
              {t(config.hero.title)}
            </h1>
            <p className="lead" style={{ fontSize: `${Math.max(12, sizes.heroBody)}px` }}>
              {t(config.hero.description)}
            </p>
            <div className="heroActions">
              {config.hero.primaryButton.enabled ? (
                <a className="buttonPrimary" href={config.hero.primaryButton.href}>
                  {t(config.hero.primaryButton.label)}
                </a>
              ) : null}
              {config.hero.secondaryButton.enabled ? (
                <a className="buttonGhost" href={config.hero.secondaryButton.href}>
                  {t(config.hero.secondaryButton.label)}
                </a>
              ) : null}
            </div>
            <div className="statsGrid">
              {config.hero.stats.map((stat) => (
                <article className="statCard" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{t(stat.label)}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {config.about.enabled ? (
          <section
            className="contentSection focusSection aboutCard revealOnScroll"
            data-font-preset={
              sectionFonts.about === "inherit" ? undefined : sectionFonts.about
            }
            data-reveal
            id="about"
            style={{ fontSize: `${Math.max(12, sizes.about)}px` }}
          >
            <p className="sectionTag">{t(config.about.heading)}</p>
            <div className="splitHeading">
              <h2 style={{ fontSize: `${Math.max(18, sizes.about + 16)}px` }}>
                {t(config.about.title)}
              </h2>
              <p>{t(config.about.body)}</p>
            </div>
          </section>
        ) : null}

        {config.services.enabled ? (
          <section
            className="contentSection focusSection revealOnScroll"
            data-font-preset={
              sectionFonts.services === "inherit"
                ? undefined
                : sectionFonts.services
            }
            data-reveal
            id="services"
            style={{ fontSize: `${Math.max(12, sizes.services)}px` }}
          >
            <div className="sectionHeader">
              <p className="sectionTag">{t(config.services.heading)}</p>
              <h2 style={{ fontSize: `${Math.max(18, sizes.services + 14)}px` }}>
                {t(config.services.title)}
              </h2>
            </div>
            <div className="cardGrid">
              {config.services.items.map((item) => (
                <article className="infoCard revealOnScroll" data-reveal key={item.title}>
                  <h3 style={{ fontSize: `${Math.max(16, sizes.services + 3)}px` }}>
                    {t(item.title)}
                  </h3>
                  <p>{t(item.description)}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {config.cursus.enabled ? (
          <section
            className="contentSection focusSection revealOnScroll"
            data-font-preset={
              sectionFonts.cursus === "inherit" ? undefined : sectionFonts.cursus
            }
            data-reveal
            id="cursus"
            style={{ fontSize: `${Math.max(12, sizes.cursus)}px` }}
          >
            <div className="sectionHeader">
              <p className="sectionTag">{t(config.cursus.label)}</p>
              <h2 style={{ fontSize: `${Math.max(18, sizes.cursus + 14)}px` }}>
                {t(config.cursus.heading)}
              </h2>
            </div>
            <div className="cardGrid">
              {config.cursus.items.map((item) => (
                <article
                  className="infoCard revealOnScroll"
                  data-reveal
                  key={`${item.period}-${item.diploma}-${item.institution}`}
                >
                  <p className="sectionTag">{t(item.period)}</p>
                  <h3 style={{ fontSize: `${Math.max(16, sizes.cursus + 3)}px` }}>
                    {t(item.diploma)}
                  </h3>
                  <p>{t(item.institution)}</p>
                  <p>{t(item.details)}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {config.experience.enabled ? (
          <section
            className="contentSection focusSection revealOnScroll"
            data-font-preset={
              sectionFonts.experience === "inherit"
                ? undefined
                : sectionFonts.experience
            }
            data-reveal
            id="experience"
            style={{ fontSize: `${Math.max(12, sizes.experience)}px` }}
          >
            <div className="sectionHeader">
              <p className="sectionTag">{t(config.experience.label)}</p>
              <h2 style={{ fontSize: `${Math.max(18, sizes.experience + 14)}px` }}>
                {t(config.experience.heading)}
              </h2>
            </div>
            <div className="cardGrid">
              {config.experience.items.map((item) => (
                <article
                  className="infoCard revealOnScroll"
                  data-reveal
                  key={`${item.period}-${item.role}-${item.company}`}
                >
                  <p className="sectionTag">{t(item.period)}</p>
                  <h3 style={{ fontSize: `${Math.max(16, sizes.experience + 3)}px` }}>
                    {t(item.role)}
                  </h3>
                  <p>{t(item.company)}</p>
                  <p>{t(item.details)}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {config.projects.enabled ? (
          <section
            className="contentSection focusSection revealOnScroll"
            data-font-preset={
              sectionFonts.projects === "inherit"
                ? undefined
                : sectionFonts.projects
            }
            data-reveal
            id="projects"
            style={{ fontSize: `${Math.max(12, sizes.projects)}px` }}
          >
            <div className="sectionHeader">
              <p className="sectionTag">{t(config.projects.heading)}</p>
              <h2 style={{ fontSize: `${Math.max(18, sizes.projects + 14)}px` }}>
                {t(config.projects.title)}
              </h2>
            </div>
            <div className="projectList">
              {config.projects.items.map((project) => (
                <article className="projectCard projectCardSimple revealOnScroll" data-reveal key={project.name}>
                  <div>
                    <h3 style={{ fontSize: `${Math.max(16, sizes.projects + 3)}px` }}>
                      {t(project.name)}
                    </h3>
                    <p>{t(project.summary)}</p>
                  </div>
                  <a href={project.url} rel="noreferrer" target="_blank">
                    {t(config.projects.openLabel)}
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {config.contact.enabled ? (
          <section
            className="contentSection focusSection contactCard revealOnScroll"
            data-font-preset={
              sectionFonts.contact === "inherit" ? undefined : sectionFonts.contact
            }
            data-reveal
            id="contact"
            style={{ fontSize: `${Math.max(12, sizes.contact)}px` }}
          >
            <div>
              <p className="sectionTag">{t(config.contact.heading)}</p>
              <h2 style={{ fontSize: `${Math.max(18, sizes.contact + 14)}px` }}>
                {t(config.contact.callToAction)}
              </h2>
            </div>
            <div className="contactDetails">
              <a href={`mailto:${config.contact.email}`}>{config.contact.email}</a>
              <a href={`tel:${config.contact.phone.replace(/\s+/g, "")}`}>
                {config.contact.phone}
              </a>
              <div className="socialRow">
                {config.socialLinks.map((link) => (
                  <a
                    aria-label={t(link.label)}
                    className="socialIconLink"
                    href={link.href}
                    key={link.label}
                    rel="noreferrer"
                    target="_blank"
                    title={t(link.label)}
                  >
                    <SocialIcon label={link.label} />
                  </a>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
