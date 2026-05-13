import Image from "next/image";
import Link from "next/link";
import styles from "./MediaKit.module.css";

const facts = [
  ["Nome artista", "JeeC"],
  ["Nome reale", "Giosuè Rasi"],
  ["Origine", "Sicilia / Patti / Messina"],
  ["Area", "Pop · Hip-Hop · Rap"],
  ["Lingue", "Italiano · Inglese"],
  ["Progetto attuale", "NEW (Tutto Quello Che Non Ti Ho Detto)"],
];

const pressAngles = [
  "scrittura personale tra vissuto, immaginazione e memoria",
  "immaginario narrativo collegato al Diario di Jay",
  "riferimenti pop, generazionali e cinematografici",
  "progetto artistico espanso tra musica, lore e interazione digitale",
];

const links = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/artist/3m21RYc8hGmj86j7758WEI",
  },
  {
    label: "SoundCloud",
    href: "https://soundcloud.com/sonojeec",
  },
  {
    label: "Musica",
    href: "/musica",
  },
  {
    label: "Eventi",
    href: "/eventi",
  },
];

export const metadata = {
  title: "Media Kit",
  description:
    "Bio, materiali stampa, link ufficiali e contatti professionali per JeeC.",
};

export default function MediaKitPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Press transmission</p>
            <h1 className={styles.title}>Media Kit</h1>
            <p className={styles.description}>
              Materiali stampa, bio, link ufficiali e riferimenti rapidi per
              raccontare JeeC, il progetto NEW e l’universo narrativo collegato
              alla sua musica.
            </p>

            <div className={styles.heroActions}>
              <Link href="/contatti" className={styles.primaryCta}>
                Richiedi materiali
              </Link>
              <Link href="/musica" className={styles.secondaryCta}>
                Esplora catalogo
              </Link>
            </div>
          </div>

          <div className={styles.coverCard}>
            <div className={styles.coverFrame}>
              <Image
                src="/images/covers/Copertina_NEW_TQCNTHD.jpg"
                alt="Cover di NEW (Tutto Quello Che Non Ti Ho Detto)"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 28rem"
                className={styles.coverImage}
              />
            </div>

            <div className={styles.coverMeta}>
              <p>Current release</p>
              <h2>NEW</h2>
              <span>Tutto Quello Che Non Ti Ho Detto</span>
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="quick-facts">
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Artist data</p>
            <h2 id="quick-facts">Informazioni rapide</h2>
          </div>

          <dl className={styles.factGrid}>
            {facts.map(([label, value]) => (
              <div key={label} className={styles.factCard}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={styles.twoColumns}>
          <article className={styles.panel}>
            <p className={styles.kicker}>Short bio</p>
            <h2>Bio breve</h2>
            <p>
              JeeC è il progetto musicale di Giosuè Rasi, artista siciliano
              classe 2000. Tra Pop, Hip-Hop e immaginario narrativo, la sua
              musica intreccia vissuto personale, mondi interiori e frammenti
              emotivi.
            </p>
          </article>

          <article className={styles.panel}>
            <p className={styles.kicker}>Extended bio</p>
            <h2>Bio estesa</h2>
            <p>
              Nato a Messina e cresciuto a Patti, JeeC costruisce un linguaggio
              sospeso tra racconto autobiografico e fantasia. La scrittura
              diventa una forma di memoria, sfogo e costruzione narrativa:
              canzoni, personaggi, riferimenti pop e visioni emotive convivono
              dentro un universo musicale in continua espansione.
            </p>
          </article>
        </section>

        <section className={styles.section} aria-labelledby="current-project">
          <div className={styles.releasePanel}>
            <div>
              <p className={styles.kicker}>Current project</p>
              <h2 id="current-project">
                NEW (Tutto Quello Che Non Ti Ho Detto)
              </h2>
              <p>
                La deluxe edition di NEW riapre il progetto a cinque anni dalla
                sua prima uscita: brani originali remastered, bonus track e un
                immaginario visivo/narrativo che oggi diventa anche esperienza
                interattiva nella home di jeec.it.
              </p>
            </div>

            <Link
              href="/musica/new-tutto-quello-che-non-ti-ho-detto"
              className={styles.primaryCta}
            >
              Apri release
            </Link>
          </div>
        </section>

        <section className={styles.twoColumns}>
          <article className={styles.panel}>
            <p className={styles.kicker}>Press angles</p>
            <h2>Spunti editoriali</h2>
            <ul className={styles.angleList}>
              {pressAngles.map((angle) => (
                <li key={angle}>{angle}</li>
              ))}
            </ul>
          </article>

          <article className={styles.panel}>
            <p className={styles.kicker}>Downloads</p>
            <h2>Materiali</h2>
            <p>
              Foto stampa, logo, cover e materiali ufficiali verranno raccolti
              qui in formato scaricabile. Per richieste immediate, usa la pagina
              contatti.
            </p>

            <div className={styles.downloadList}>
              <span>Press photos · coming soon</span>
              <span>Logo pack · coming soon</span>
              <span>Cover artwork · coming soon</span>
            </div>
          </article>
        </section>

        <section className={styles.section} aria-labelledby="official-links">
          <div className={styles.sectionHeader}>
            <p className={styles.kicker}>Official signals</p>
            <h2 id="official-links">Link ufficiali</h2>
          </div>

          <div className={styles.linkGrid}>
            {links.map((link) => {
              const isExternal = link.href.startsWith("http");

              if (isExternal) {
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.linkCard}
                  >
                    {link.label}
                  </a>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={styles.linkCard}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </section>

        <section className={styles.contactStrip}>
          <div>
            <p className={styles.kicker}>Contact</p>
            <h2>Press, booking e collaborazioni</h2>
            <p>
              Per interviste, live, materiali stampa, sincronizzazioni o
              collaborazioni, passa dalla pagina contatti.
            </p>
          </div>

          <Link href="/contatti" className={styles.primaryCta}>
            Contatta JeeC
          </Link>
        </section>
      </div>
    </main>
  );
}
