import Link from "next/link";
import styles from "./Bio.module.css";

const timeline = [
  {
    year: "2000",
    title: "Origini",
    description:
      "Giosuè Rasi nasce il 19 aprile 2000. La Sicilia, Messina, Patti e il paesaggio davanti alle Isole Eolie diventano parte del suo immaginario emotivo.",
  },
  {
    year: "12 anni",
    title: "La scrittura come valvola",
    description:
      "Inizia a scrivere giovanissimo, trasformando parole, riferimenti e pensieri personali in un linguaggio intimo e diretto.",
  },
  {
    year: "2019",
    title: "19 Aprile",
    description:
      "Pubblica il primo album, un progetto che mette al centro identità, crescita e urgenza espressiva.",
  },
  {
    year: "2021",
    title: "NEW",
    description:
      "NEW segna una fase centrale del percorso: un album fatto di memoria, relazioni, notti irrisolte e pensieri rimasti fuori campo.",
  },
  {
    year: "2026",
    title: "NEW Deluxe",
    description:
      "NEW (Tutto Quello Che Non Ti Ho Detto) riapre l’universo dell’album con brani remastered, bonus track e una nuova esperienza interattiva.",
  },
];

const creativePillars = [
  "vissuto personale",
  "immaginazione narrativa",
  "Pop / Hip-Hop",
  "riferimenti generazionali",
  "memoria emotiva",
  "mondi interiori",
];

const stats = [
  ["Origine", "Sicilia"],
  ["Sound", "Pop / Hip-Hop"],
  ["Scrittura", "Personale · narrativa"],
  ["Universo attuale", "NEW"],
];

export const metadata = {
  title: "Bio | JeeC",
  description:
    "Biografia artistica di JeeC: origini, percorso musicale, immaginario narrativo e progetto NEW.",
};

export default function BioPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Identity transmission</p>
            <h1 className={styles.title}>Bio</h1>
            <p className={styles.lead}>
              JeeC è il progetto musicale di Giosuè Rasi, artista siciliano
              classe 2000. La sua musica si muove tra Pop, Hip-Hop, vissuto
              personale e immaginazione narrativa.
            </p>

            <div className={styles.heroActions}>
              <Link href="/musica" className={styles.primaryCta}>
                Ascolta la musica
              </Link>
              <Link href="/media-kit" className={styles.secondaryCta}>
                Apri media kit
              </Link>
            </div>
          </div>

          <aside
            className={styles.portraitCard}
            aria-label="Placeholder foto artista"
          >
            <div className={styles.portraitPlaceholder}>
              <span>J</span>
            </div>

            <div className={styles.portraitMeta}>
              <p>Artist file</p>
              <h2>JeeC</h2>
              <span>Giosuè Rasi · Sicilia · Pop/Hip-Hop</span>
            </div>
          </aside>
        </section>

        <section className={styles.section} aria-labelledby="short-bio">
          <div className={styles.bioPanel}>
            <p className={styles.kicker}>Short biography</p>
            <h2 id="short-bio">Chi è JeeC</h2>
            <p>
              Nato a Messina e cresciuto a Patti, JeeC costruisce un immaginario
              musicale sospeso tra esperienza personale e fantasia. Le sue
              canzoni attraversano relazioni, paure, nostalgia, riferimenti pop
              e frammenti di vita trasformati in racconto.
            </p>
            <p>
              La scrittura è il centro del progetto: non solo testo musicale, ma
              anche diario, universo narrativo, personaggi e simboli. Da qui
              nasce una visione che unisce catalogo musicale, Diario di Jay,
              esperienza interattiva e release come NEW.
            </p>
          </div>
        </section>

        <section className={styles.statsGrid} aria-label="Informazioni rapide">
          {stats.map(([label, value]) => (
            <div key={label} className={styles.statCard}>
              <p>{label}</p>
              <strong>{value}</strong>
            </div>
          ))}
        </section>

        <section className={styles.splitSection}>
          <article className={styles.panel}>
            <p className={styles.kicker}>Sound</p>
            <h2>Tra Pop, Hip-Hop e racconto</h2>
            <p>
              Il suono di JeeC nasce dall’incontro tra scrittura rap,
              sensibilità melodica e un approccio pop all’immaginario. Le tracce
              alternano confessione, ironia, riferimenti culturali e momenti più
              scuri, cercando sempre un equilibrio tra immediatezza e
              profondità.
            </p>
          </article>

          <article className={styles.panel}>
            <p className={styles.kicker}>Worldbuilding</p>
            <h2>Oltre la canzone</h2>
            <p>
              JeeC non costruisce solo brani, ma coordinate. Ogni release può
              aprire stanze, simboli, frammenti narrativi e connessioni. Il
              Diario di Jay espande questa direzione: una sezione narrativa
              autonoma che dialoga con la musica senza sostituirla.
            </p>
          </article>
        </section>

        <section className={styles.section} aria-labelledby="creative-pillars">
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Creative coordinates</p>
            <h2 id="creative-pillars">Coordinate creative</h2>
          </div>

          <div className={styles.pillGrid}>
            {creativePillars.map((pillar) => (
              <span key={pillar}>{pillar}</span>
            ))}
          </div>
        </section>

        <section className={styles.section} aria-labelledby="timeline">
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Timeline</p>
            <h2 id="timeline">Percorso</h2>
          </div>

          <div className={styles.timeline}>
            {timeline.map((item) => (
              <article
                key={`${item.year}-${item.title}`}
                className={styles.timelineItem}
              >
                <div className={styles.timelineYear}>{item.year}</div>
                <div className={styles.timelineContent}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.releaseSpotlight}>
          <div>
            <p className={styles.kicker}>Current universe</p>
            <h2>NEW (Tutto Quello Che Non Ti Ho Detto)</h2>
            <p>
              Il progetto attuale riporta al centro NEW: una deluxe edition che
              riapre l’album a distanza di anni e lo trasforma in un universo
              più ampio, tra musica, memoria, copertina esplorabile e contenuti
              nascosti.
            </p>
          </div>

          <Link
            href="/musica/new-tutto-quello-che-non-ti-ho-detto"
            className={styles.primaryCta}
          >
            Apri NEW
          </Link>
        </section>

        <section className={styles.finalGrid}>
          <Link href="/diario-di-jay" className={styles.linkPanel}>
            <p>Story layer</p>
            <h2>Diario di Jay</h2>
            <span>Leggi i frammenti narrativi</span>
          </Link>

          <Link href="/eventi" className={styles.linkPanel}>
            <p>Live signal</p>
            <h2>Eventi</h2>
            <span>Scopri date e archivio live</span>
          </Link>

          <Link href="/contatti" className={styles.linkPanel}>
            <p>Open channel</p>
            <h2>Contatti</h2>
            <span>Booking, press e collaborazioni</span>
          </Link>
        </section>
      </div>
    </main>
  );
}
