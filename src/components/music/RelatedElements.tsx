import type { CatalogRelatedElement } from "@/lib/music/catalog";
import styles from "./RelatedElements.module.css";

type RelatedElementsProps = {
  elements: CatalogRelatedElement[];
};

function isExternalHref(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export function RelatedElements({ elements }: RelatedElementsProps) {
  return (
    <section className={styles.panel} aria-labelledby="related-elements-title">
      <div className={styles.header}>
        <p className={styles.eyebrow}>Elementi correlati</p>
        <h2 id="related-elements-title" className={styles.title}>
          Intorno alla traccia
        </h2>
        <p className={styles.description}>
          Contenuti collegati senza togliere centralità al brano.
        </p>
      </div>

      {elements.length > 0 ? (
        <div className={styles.grid}>
          {elements.map((element) => {
            const external = isExternalHref(element.href);

            return (
              <a
                key={element.id}
                href={element.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                className={styles.card}
              >
                {element.eyebrow ? (
                  <span className={styles.cardEyebrow}>{element.eyebrow}</span>
                ) : null}

                <strong>{element.title}</strong>

                {element.description ? <p>{element.description}</p> : null}

                <span className={styles.cardCta}>
                  {external ? "Apri link" : "Esplora"}
                </span>
              </a>
            );
          })}
        </div>
      ) : (
        <p className={styles.empty}>
          Non ci sono ancora elementi correlati pubblici per questa traccia.
        </p>
      )}
    </section>
  );
}
