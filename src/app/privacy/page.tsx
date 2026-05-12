import Link from "next/link";
import styles from "./Legal.module.css";

export const metadata = {
  title: "Privacy Policy | JeeC",
  description:
    "Informativa privacy del sito jeec.it: dati trattati, finalità, basi giuridiche, cookie, servizi terzi e diritti degli utenti.",
};

const updatedAt = "12 maggio 2026";

const sections = [
  {
    title: "1. Titolare del trattamento",
    body: [
      "Il titolare del trattamento è JeeC / Giosuè Rasi, progetto artistico-musicale collegato al sito jeec.it.",
      "Per richieste relative alla privacy puoi scrivere tramite la pagina Contatti o all’indirizzo email indicato nei canali ufficiali del sito.",
    ],
  },
  {
    title: "2. Dati trattati",
    body: [
      "Il sito può trattare dati tecnici di navigazione, come indirizzo IP, informazioni sul browser, sistema operativo, log tecnici e dati necessari al corretto funzionamento del sito.",
      "Se l’utente invia una richiesta tramite email o link di contatto, possono essere trattati nome, indirizzo email, contenuto del messaggio e ulteriori dati comunicati volontariamente.",
      "Se l’utente interagisce con contenuti incorporati, come player musicali, video o widget di terze parti, tali servizi possono trattare dati secondo le rispettive informative.",
    ],
  },
  {
    title: "3. Finalità del trattamento",
    body: [
      "I dati sono trattati per permettere il funzionamento tecnico del sito, rispondere a richieste di contatto, gestire comunicazioni professionali, mostrare contenuti musicali, video, eventi e materiali informativi.",
      "Eventuali dati tecnici possono essere usati per sicurezza, prevenzione abusi, manutenzione, diagnostica e miglioramento dell’esperienza di navigazione.",
    ],
  },
  {
    title: "4. Basi giuridiche",
    body: [
      "Il trattamento può basarsi sull’esecuzione di misure precontrattuali o contrattuali quando l’utente invia richieste professionali o di contatto.",
      "Il trattamento tecnico necessario al funzionamento del sito può basarsi sul legittimo interesse alla sicurezza, manutenzione e corretta erogazione del servizio.",
      "Dove richiesto, per strumenti non tecnici, analytics non anonimizzati, marketing, profilazione o servizi equivalenti, il trattamento avverrà sulla base del consenso dell’utente.",
    ],
  },
  {
    title: "5. Servizi di terze parti",
    body: [
      "Il sito può includere collegamenti o incorporamenti di servizi esterni, come YouTube, Spotify, Bandsintown, SoundCloud, social network, piattaforme musicali o servizi di hosting.",
      "Questi soggetti possono raccogliere dati in qualità di autonomi titolari o responsabili del trattamento secondo le rispettive informative privacy.",
      "L’utente è invitato a consultare le informative dei servizi terzi prima di interagire con player, iframe, video, ticketing, mappe o link esterni.",
    ],
  },
  {
    title: "6. Cookie e tecnologie simili",
    body: [
      "Il sito può usare cookie tecnici o strumenti equivalenti necessari al funzionamento delle pagine e alla memorizzazione di preferenze locali, per esempio lo stato dell’esperienza interattiva arcade.",
      "Eventuali cookie o strumenti non tecnici, di analytics, profilazione, marketing o tracciamento di terze parti dovranno essere gestiti tramite consenso, quando richiesto dalla normativa applicabile.",
      "La configurazione effettiva dei cookie dipende dai servizi attivati sul sito in produzione.",
    ],
  },
  {
    title: "7. Esperienza interattiva e salvataggi locali",
    body: [
      "L’esperienza arcade della home può salvare nel browser dell’utente alcune informazioni locali, come elementi scoperti, badge sbloccati e stato della ricompensa finale.",
      "Questi dati sono memorizzati localmente nel dispositivo dell’utente e servono a mantenere la progressione dell’esperienza. L’utente può cancellarli usando il pulsante di reset dell’esperienza o svuotando i dati del browser.",
    ],
  },
  {
    title: "8. Conservazione dei dati",
    body: [
      "I dati comunicati volontariamente tramite contatto vengono conservati per il tempo necessario a gestire la richiesta e gli eventuali rapporti professionali conseguenti.",
      "I dati tecnici e di sicurezza vengono conservati per il tempo strettamente necessario alle finalità tecniche, di diagnostica, sicurezza o obblighi di legge.",
    ],
  },
  {
    title: "9. Diritti dell’utente",
    body: [
      "Nei limiti previsti dalla normativa applicabile, l’utente può chiedere accesso, rettifica, cancellazione, limitazione del trattamento, portabilità dei dati, opposizione al trattamento e revoca del consenso quando il trattamento si basa sul consenso.",
      "L’utente può inoltre proporre reclamo all’autorità di controllo competente, in Italia il Garante per la protezione dei dati personali.",
    ],
  },
  {
    title: "10. Modifiche a questa informativa",
    body: [
      "Questa informativa può essere aggiornata nel tempo per riflettere modifiche tecniche, funzionali, normative o organizzative del sito.",
      "La data di ultimo aggiornamento indica la versione più recente disponibile.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <article className={styles.inner}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Legal transmission</p>
          <h1>Privacy Policy</h1>
          <p>
            Informativa sul trattamento dei dati personali degli utenti che
            visitano e utilizzano jeec.it.
          </p>
          <span>Ultimo aggiornamento: {updatedAt}</span>
        </header>

        <div className={styles.notice}>
          <strong>Nota operativa</strong>
          <p>
            Questa pagina è una base testuale da verificare rispetto ai servizi
            effettivamente attivi in produzione: analytics, form, newsletter,
            cookie banner, download, player e integrazioni esterne.
          </p>
        </div>

        <div className={styles.sections}>
          {sections.map((section) => (
            <section key={section.title} className={styles.section}>
              <h2>{section.title}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <footer className={styles.footer}>
          <Link href="/contatti">Contatti</Link>
          <Link href="/termini">Termini di servizio</Link>
        </footer>
      </article>
    </main>
  );
}
