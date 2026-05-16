import type { CatalogListeningLink } from "@/lib/music/catalog";

type ListeningPanelProps = {
  links: CatalogListeningLink[];
};

export function ListeningPanel({ links }: ListeningPanelProps) {
  const embeddableLink = links.find((link) => link.supportsEmbed && link.embedUrl);

  return (
    <section>
      <div>
        <p>Ascolta</p>
        <h2>Piattaforme ufficiali</h2>
        <p>
          Scegli il canale che preferisci. Gli embed vengono mostrati solo dove
          sono stabili; i link ufficiali restano sempre disponibili.
        </p>
      </div>

      {embeddableLink?.embedUrl ? (
        <div>
          <iframe
            title={`Player ${embeddableLink.sourceName}`}
            src={embeddableLink.embedUrl}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            style={{
              width: "100%",
              minHeight: "180px",
              border: 0,
              borderRadius: "18px",
            }}
          />
        </div>
      ) : null}

      {links.length > 0 ? (
        <div>
          {links.map((link) => (
            <a
              key={link.key}
              href={link.url}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
              {link.isPrimary ? " · consigliato" : ""}
            </a>
          ))}
        </div>
      ) : (
        <p>
          I link ufficiali di ascolto per questa traccia arriveranno qui appena
          disponibili nel catalogo.
        </p>
      )}
    </section>
  );
}

