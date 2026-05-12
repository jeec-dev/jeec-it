import Link from "next/link";
import styles from "./Legal.module.css";

export const metadata = {
  title: "Termini di servizio | JeeC",
  description:
    "Termini di utilizzo del sito jeec.it: contenuti, link esterni, download, proprietà intellettuale e limitazioni.",
};

const updatedAt = "12 maggio 2026";

const sections = [
  {
    title: "1. Oggetto",
    body: [
      "I presenti termini regolano l’accesso e l’utilizzo del sito jeec.it, sito ufficiale del progetto artistico JeeC.",
      "Navigando il sito, l’utente accetta di utilizzare i contenuti in modo lecito, corretto e rispettoso dei diritti di terzi.",
    ],
  },
  {
    title: "2. Contenuti del sito",
    body: [
      "Il sito contiene informazioni artistiche, musicali, narrative, materiali stampa, link a piattaforme esterne, pagine evento, contenuti multimediali e sezioni interattive.",
      "I contenuti possono essere modificati, aggiornati, rimossi o riorganizzati in qualsiasi momento senza preavviso.",
    ],
  },
  {
    title: "3. Proprietà intellettuale",
    body: [
      "Testi, grafiche, loghi, immagini, concept, elementi narrativi, layout, contenuti musicali e materiali presenti sul sito appartengono ai rispettivi titolari.",
      "È vietata la riproduzione, distribuzione, modifica o uso commerciale non autorizzato dei contenuti, salvo diversa indicazione o accordo scritto.",
    ],
  },
  {
    title: "4. Musica, player e piattaforme esterne",
    body: [
      "Il sito può includere player, embed o link verso piattaforme esterne come Spotify, YouTube, SoundCloud, Bandsintown o servizi simili.",
      "L’uso di tali servizi è regolato dai rispettivi termini e informative privacy. JeeC non controlla il funzionamento, le disponibilità, le regole o le politiche di tali piattaforme.",
    ],
  },
  {
    title: "5. Esperienza interattiva arcade",
    body: [
      "La home può includere un’esperienza interattiva legata alla release NEW, con hotspot, badge, punteggio, progressione e ricompense digitali.",
      "La progressione può essere salvata localmente nel browser dell’utente. Il reset del browser, la cancellazione dei dati locali o il cambio dispositivo possono comportare la perdita della progressione.",
      "Le ricompense digitali eventualmente offerte sono soggette a disponibilità, aggiornamenti tecnici e condizioni indicate nella relativa interfaccia.",
    ],
  },
  {
    title: "6. Download digitali",
    body: [
      "Eventuali download gratuiti offerti dal sito sono destinati all’uso personale dell’utente, salvo diversa indicazione.",
      "Il download non trasferisce diritti di proprietà intellettuale sui contenuti musicali o grafici. È vietata la redistribuzione non autorizzata.",
      "JeeC può modificare, sospendere o rimuovere un download se necessario per motivi tecnici, artistici, legali o organizzativi.",
    ],
  },
  {
    title: "7. Eventi e biglietti",
    body: [
      "Le informazioni sugli eventi possono provenire da fonti esterne come Bandsintown o piattaforme di ticketing.",
      "Date, orari, venue, disponibilità biglietti e condizioni di accesso possono cambiare. L’utente deve verificare sempre le informazioni finali presso la venue o la piattaforma di vendita ufficiale.",
    ],
  },
  {
    title: "8. Link esterni",
    body: [
      "Il sito può contenere link verso siti, social network, store, servizi di streaming, piattaforme video o ticketing.",
      "JeeC non è responsabile dei contenuti, disponibilità, sicurezza, termini o politiche di privacy dei siti esterni.",
    ],
  },
  {
    title: "9. Limitazione di responsabilità",
    body: [
      "Il sito viene fornito per finalità informative, artistiche e promozionali.",
      "Pur cercando di mantenere le informazioni aggiornate, non si garantisce che tutti i contenuti siano sempre completi, aggiornati, privi di errori o disponibili senza interruzioni.",
    ],
  },
  {
    title: "10. Uso non consentito",
    body: [
      "È vietato usare il sito per attività illecite, tentativi di accesso non autorizzato, scraping aggressivo, interferenze tecniche, distribuzione di malware o violazione dei diritti di terzi.",
      "È vietato aggirare eventuali meccanismi tecnici collegati a download, ricompense, progressione o contenuti riservati.",
    ],
  },
  {
    title: "11. Modifiche ai termini",
    body: [
      "I presenti termini possono essere aggiornati in qualsiasi momento.",
      "La versione pubblicata sul sito è quella applicabile al momento della consultazione.",
    ],
  },
  {
    title: "12. Contatti",
    body: [
      "Per domande sui presenti termini, richieste di autorizzazione, uso dei materiali o segnalazioni, è possibile utilizzare la pagina Contatti.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className={styles.page}>
      <article className={styles.inner}>
        <header className={styles.hero}>
          <p className={styles.kicker}>Legal transmission</p>
          <h1>Termini di servizio</h1>
          <p>
            Regole di utilizzo del sito jeec.it, dei contenuti artistici, delle
            integrazioni esterne e delle sezioni interattive.
          </p>
          <span>Ultimo aggiornamento: {updatedAt}</span>
        </header>

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
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/contatti">Contatti</Link>
        </footer>
      </article>
    </main>
  );
}
