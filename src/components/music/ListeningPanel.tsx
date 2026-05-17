import type { CatalogListeningLink } from "@/lib/music/catalog";
import styles from "./ListeningPanel.module.css";

type ListeningPanelProps = {
  links: CatalogListeningLink[];
};

export function ListeningPanel({ links }: ListeningPanelProps) {
  const embeddableLink = links.find(
    (link) => link.supportsEmbed && link.embedUrl,
  );

  return (
    <section className={styles.panel} aria-labelledby="listening-title">
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Ascolta</p>
          <h2 id="listening-title" className={styles.title}>
            Piattaforme ufficiali
          </h2>
        </div>

        <p className={styles.description}>
          Embed solo dove stabile. Link ufficiali sempre disponibili.
        </p>
      </div>

      {embeddableLink?.embedUrl ? (
        <div className={styles.embedShell}>
          <div className={styles.embedMeta}>
            <span>{embeddableLink.sourceName}</span>
            {embeddableLink.isPrimary ? <strong>Consigliato</strong> : null}
          </div>

          <iframe
            title={`Player ${embeddableLink.sourceName}`}
            src={embeddableLink.embedUrl}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className={styles.embed}
          />
        </div>
      ) : null}

      {links.length > 0 ? (
        <div className={styles.linkGrid}>
          {links.map((link) => (
            <a
              key={link.key}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className={styles.platformLink}
            >
              <span>
                <small>{link.sourceName}</small>
                {link.label}
              </span>

              {link.isPrimary ? (
                <strong className={styles.badge}>Consigliato</strong>
              ) : (
                <span className={styles.arrow}>↗</span>
              )}
            </a>
          ))}
        </div>
      ) : (
        <p className={styles.empty}>
          I link ufficiali di ascolto per questa traccia arriveranno qui appena
          disponibili nel catalogo.
        </p>
      )}
    </section>
  );
}
