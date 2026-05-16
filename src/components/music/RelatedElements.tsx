import type { CatalogRelatedElement } from "@/lib/music/catalog";

type RelatedElementsProps = {
  elements: CatalogRelatedElement[];
};

export function RelatedElements({ elements }: RelatedElementsProps) {
  return (
    <section>
      <div>
        <p>Elementi correlati</p>
        <h2>Altri segnali intorno alla traccia</h2>
        <p>
          Video, diario, merch, broadcast e altri contenuti collegati vivranno
          qui senza togliere centralità alla traccia.
        </p>
      </div>

      {elements.length > 0 ? (
        <div>
          {elements.map((element) => (
            <a key={element.id} href={element.href}>
              {element.eyebrow ? <span>{element.eyebrow}</span> : null}
              <strong>{element.title}</strong>
              {element.description ? <p>{element.description}</p> : null}
            </a>
          ))}
        </div>
      ) : (
        <p>Non ci sono ancora elementi correlati pubblici per questa traccia.</p>
      )}
    </section>
  );
}
