import Link from "next/link";
import styles from "./Contacts.module.css";
import { ContactForm } from "./ContactForm";

const contactChannels = [
  {
    label: "Booking / Live",
    description:
      "Per proposte live, venue, festival, showcase e richieste legate agli eventi.",
    href: "mailto:booking@jeec.it?subject=Booking%20JeeC",
    cta: "Scrivi per booking",
  },
  {
    label: "Press / Media",
    description:
      "Per interviste, articoli, materiali stampa, bio, foto e richieste editoriali.",
    href: "mailto:press@jeec.it?subject=Press%20JeeC",
    cta: "Contatto press",
  },
  {
    label: "Collaborazioni",
    description:
      "Per featuring, produzioni, progetti creativi, visual, contenuti e partnership.",
    href: "mailto:info@jeec.it?subject=Collaborazione%20con%20JeeC",
    cta: "Proponi progetto",
  },
];

const socialLinks = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/artist/3m21RYc8hGmj86j7758WEI",
  },
  {
    label: "SoundCloud",
    href: "https://soundcloud.com/sonojeec",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
  },
];

export const metadata = {
  title: "Contatti",
  description:
    "Contatti professionali per booking, media, collaborazioni e richieste legate a JeeC.",
};

export default function ContactsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <section className={styles.hero}>
          <p className={styles.kicker}>Open channel</p>
          <h1 className={styles.title}>Contatti</h1>
          <p className={styles.description}>
            Booking, press, collaborazioni e richieste professionali. Scegli il
            canale giusto e invia un messaggio con tutte le informazioni utili:
            tipo di richiesta, data, città, budget indicativo e riferimenti.
          </p>

          <div className={styles.heroActions}>
            <a
              href="mailto:info@jeec.it?subject=Contatto%20dal%20sito%20jeec.it"
              className={styles.primaryCta}
            >
              Scrivi a JeeC
            </a>
            <Link href="/media-kit" className={styles.secondaryCta}>
              Apri Media Kit
            </Link>
          </div>
        </section>

        <ContactForm />

        <section className={styles.channels} aria-label="Canali di contatto">
          {contactChannels.map((channel) => (
            <article key={channel.label} className={styles.channelCard}>
              <p className={styles.cardKicker}>Transmission line</p>
              <h2>{channel.label}</h2>
              <p>{channel.description}</p>
              <a href={channel.href} className={styles.cardCta}>
                {channel.cta}
              </a>
            </article>
          ))}
        </section>

        <section className={styles.splitSection}>
          <article className={styles.panel}>
            <p className={styles.kicker}>Professional request</p>
            <h2>Come inviare una richiesta efficace</h2>

            <ul className={styles.checkList}>
              <li>
                specifica il tipo di richiesta: live, press, collaborazione;
              </li>
              <li>indica città, data, venue o contesto del progetto;</li>
              <li>
                aggiungi link, riferimenti, budget o tempistiche se presenti;
              </li>
              <li>
                per la stampa, includi testata, format e data di pubblicazione.
              </li>
            </ul>
          </article>

          <article className={styles.panel}>
            <p className={styles.kicker}>Quick access</p>
            <h2>Link utili</h2>

            <div className={styles.quickLinks}>
              <Link href="/musica">Catalogo musica</Link>
              <Link href="/eventi">Eventi</Link>
              <Link href="/media-kit">Media Kit</Link>
              <Link href="/diario-di-jay">Diario di Jay</Link>
            </div>
          </article>
        </section>

        <section className={styles.socialSection}>
          <div>
            <p className={styles.kicker}>Official signals</p>
            <h2>Segui JeeC</h2>
            <p>
              Canali ufficiali, piattaforme musicali e segnali pubblici del
              progetto.
            </p>
          </div>

          <div className={styles.socialGrid}>
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <section className={styles.finalCta}>
          <p className={styles.kicker}>Main inbox</p>
          <h2>Hai una richiesta diversa?</h2>
          <p>
            Per tutto ciò che non rientra nei canali sopra, usa il contatto
            generale.
          </p>

          <a
            href="mailto:info@jeec.it?subject=Richiesta%20generale%20JeeC"
            className={styles.primaryCta}
          >
            info@jeec.it
          </a>
        </section>
      </div>
    </main>
  );
}
