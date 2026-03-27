import Image from "next/image";
import type { CSSProperties } from "react";

import { getThemeStyles, type PortfolioConfig } from "@/lib/portfolio";

import { ThemeToggle } from "./theme-toggle";

type PortfolioViewProps = {
  config: PortfolioConfig;
};

export function PortfolioView({ config }: PortfolioViewProps) {
  const themeStyles = getThemeStyles(config) as CSSProperties;
  const sectionLinks = [
    config.about.enabled ? { id: "about", label: config.about.heading } : null,
    config.services.enabled
      ? { id: "services", label: config.services.heading }
      : null,
    config.projects.enabled
      ? { id: "projects", label: config.projects.heading }
      : null,
    config.gallery.enabled ? { id: "gallery", label: config.gallery.heading } : null,
    config.contact.enabled ? { id: "contact", label: config.contact.heading } : null,
  ].filter(Boolean) as Array<{ id: string; label: string }>;

  return (
    <div className="portfolioShell" style={themeStyles}>
      <header className="topbar">
        <a className="brand" href="#home">
          <span className="brandMark">{config.site.ownerName.slice(0, 2)}</span>
          <span>
            <strong>{config.site.navTitle}</strong>
            <small>{config.site.location}</small>
          </span>
        </a>
        <nav className="nav">
          {sectionLinks.map((link) => (
            <a href={`#${link.id}`} key={link.id}>
              {link.label}
            </a>
          ))}
        </nav>
        <ThemeToggle
          defaultMode={config.preferences.defaultMode}
          enabled={config.preferences.showDarkModeToggle}
        />
      </header>

      <main id="home">
        <section className="heroPanel">
          <div className="heroCopy">
            {config.hero.showProfileImage && config.hero.profileImage ? (
              <div className="profileBadge">
                <Image
                  alt={`Portrait ${config.site.ownerName}`}
                  className="profileImage"
                  height={144}
                  src={config.hero.profileImage}
                  unoptimized
                  width={144}
                />
                <span>Photo de profil</span>
              </div>
            ) : null}
            <span className="eyebrow">{config.hero.badge}</span>
            <p className="subtitle">{config.hero.subtitle}</p>
            <h1>{config.hero.title}</h1>
            <p className="lead">{config.hero.description}</p>
            <div className="heroActions">
              {config.hero.primaryButton.enabled ? (
                <a className="buttonPrimary" href={config.hero.primaryButton.href}>
                  {config.hero.primaryButton.label}
                </a>
              ) : null}
              {config.hero.secondaryButton.enabled ? (
                <a className="buttonGhost" href={config.hero.secondaryButton.href}>
                  {config.hero.secondaryButton.label}
                </a>
              ) : null}
            </div>
            <div className="statsGrid">
              {config.hero.stats.map((stat) => (
                <article className="statCard" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </div>
          <div className="heroVisual">
            <div className="halo" />
            {config.hero.heroImage ? (
              <Image
                alt={config.hero.title}
                className="heroImage"
                height={900}
                src={config.hero.heroImage}
                unoptimized
                width={1200}
              />
            ) : (
              <div className="heroImage heroFallback">Aucune image principale</div>
            )}
          </div>
        </section>

        {config.about.enabled ? (
          <section className="contentSection aboutCard" id="about">
            <p className="sectionTag">{config.about.heading}</p>
            <div className="splitHeading">
              <h2>Une presence digitale qui reste simple a faire evoluer.</h2>
              <p>{config.about.body}</p>
            </div>
          </section>
        ) : null}

        {config.services.enabled ? (
          <section className="contentSection" id="services">
            <div className="sectionHeader">
              <p className="sectionTag">{config.services.heading}</p>
              <h2>Un portfolio qui peut changer au meme rythme que tes ambitions.</h2>
            </div>
            <div className="cardGrid">
              {config.services.items.map((item) => (
                <article className="infoCard" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {config.projects.enabled ? (
          <section className="contentSection" id="projects">
            <div className="sectionHeader">
              <p className="sectionTag">{config.projects.heading}</p>
              <h2>Selection recente</h2>
            </div>
            <div className="projectList">
              {config.projects.items.map((project) => (
                <article className="projectCard" key={project.name}>
                  {project.image ? (
                    <Image
                      alt={project.name}
                      className="projectImage"
                      height={720}
                      src={project.image}
                      unoptimized
                      width={1280}
                    />
                  ) : null}
                  <div>
                    <h3>{project.name}</h3>
                    <p>{project.summary}</p>
                  </div>
                  <a href={project.url} rel="noreferrer" target="_blank">
                    Ouvrir
                  </a>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {config.gallery.enabled ? (
          <section className="contentSection" id="gallery">
            <div className="sectionHeader">
              <p className="sectionTag">{config.gallery.heading}</p>
              <h2>Galerie visuelle</h2>
            </div>
            <div className="galleryGrid">
              {config.gallery.images
                .filter((image) => image.src)
                .map((image, index) => (
                <figure className="galleryCard" key={`${image.src}-${index}`}>
                  <Image
                    alt={image.alt}
                    height={675}
                    src={image.src}
                    unoptimized
                    width={900}
                  />
                  <figcaption>{image.alt}</figcaption>
                </figure>
                ))}
            </div>
          </section>
        ) : null}

        {config.contact.enabled ? (
          <section className="contentSection contactCard" id="contact">
            <div>
              <p className="sectionTag">{config.contact.heading}</p>
              <h2>{config.contact.callToAction}</h2>
            </div>
            <div className="contactDetails">
              <a href={`mailto:${config.contact.email}`}>{config.contact.email}</a>
              <a href={`tel:${config.contact.phone.replace(/\s+/g, "")}`}>
                {config.contact.phone}
              </a>
              <div className="socialRow">
                {config.socialLinks.map((link) => (
                  <a href={link.href} key={link.label} rel="noreferrer" target="_blank">
                    {link.label}
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
