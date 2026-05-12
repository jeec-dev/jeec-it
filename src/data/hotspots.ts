import type { Hotspot } from "@/types/hotspot";

const albumSlug = "new-tutto-quello-che-non-ti-ho-detto";

function trackHref(trackSlug: string) {
  return `/musica/${albumSlug}/${trackSlug}`;
}

function relatedTrack(title: string, trackSlug: string, note?: string) {
  return {
    title,
    trackSlug,
    href: trackHref(trackSlug),
    note,
  };
}

export const hotspots: Hotspot[] = [
  {
    id: "chessboard",
    x: 29,
    y: 89,
    radius: 5,
    title: "Scacchiera",
    shortLabel: "CHESS",
    content:
      "La scacchiera è il punto dove il disco parla di mosse, ruoli e cose già decise: pedine da spostare, parole che sembrano chiare solo quando ormai la partita è iniziata.",
    badgeIcon: "/icons/badges/chessboard.svg",
    score: 100,
    trackTitle: "Pedine (Come Voi) / Lo Sai",
    playerUrl: "",
    href: trackHref("pedine-come-voi"),
    relatedTracks: [
      relatedTrack(
        "Pedine (Come Voi)",
        "pedine-come-voi",
        "La scacchiera diventa una partita sociale: ruoli, strategie e persone trattate come pezzi da spostare. Qui il gioco non è solo vincere: è capire chi sta muovendo davvero chi.",
      ),
      relatedTrack(
        "Lo Sai",
        "lo-sai",
        "La partita si fa più intima: cose già capite, ma mai dette fino in fondo. Il taccuino mentale resta aperto, come se la risposta fosse sempre stata lì.",
      ),
    ],
  },
  {
    id: "grinder-kit",
    x: 7,
    y: 51,
    radius: 4,
    title: "Grinder con cartine e filtrini",
    shortLabel: "GRIND",
    content:
      "Il rituale prima del fumo diventa loop mentale: un altro giro, un'altra scusa, un altro pensiero che si accende tra abitudine, dipendenza e fuga.",
    badgeIcon: "/icons/badges/grinder-kit.svg",
    score: 120,
    trackTitle: "Gimmie Another / Nicotina (Bojack Horseman)",
    playerUrl: "",
    href: trackHref("gimmie-another"),
    relatedTracks: [
      relatedTrack(
        "Gimmie Another",
        "gimmie-another",
        "Un altro giro, un'altra scusa, un altro modo per rimandare il silenzio. Il grinder diventa rituale: ripetizione, desiderio e fame di evasione.",
      ),
      relatedTrack(
        "Nicotina (Bojack Horseman)",
        "nicotina-bojack-horseman",
        "Qui l'abitudine ha il sapore della dipendenza. La nicotina non è solo fumo: è il gesto automatico con cui provi a tenere insieme pensieri che cadono.",
      ),
    ],
  },
  {
    id: "jack-daniels",
    x: 9,
    y: 70,
    radius: 4,
    title: "Bottiglia di Jack Daniel's",
    shortLabel: "JACK",
    content:
      "La bottiglia resta lì come compagnia sbagliata: una notte lunga, una richiesta di vicinanza e il tentativo di non crollare da soli.",
    badgeIcon: "/icons/badges/jack-daniels.svg",
    score: 130,
    trackTitle: "Stammi Vicino Dai",
    playerUrl: "",
    href: trackHref("stammi-vicino-dai"),
    relatedTracks: [
      relatedTrack(
        "Stammi Vicino Dai",
        "stammi-vicino-dai",
        "La bottiglia resta come una presenza sbagliata in una notte lunga. Non è festa: è richiesta di vicinanza, paura di restare soli e bisogno di qualcuno che rimanga.",
      ),
    ],
  },
  {
    id: "signed-contract",
    x: 24,
    y: 60,
    radius: 5,
    title: "Contratto con la firma segnata in rosso",
    shortLabel: "DEAL",
    content:
      "Una firma rossa, quasi una condanna: quando dici che va tutto bene, ma sotto c'è il peso di accordi, aspettative e parti di te che non hai davvero scelto.",
    badgeIcon: "/icons/badges/signed-contract.svg",
    score: 180,
    trackTitle: "Ma Tanto Sto Bene",
    playerUrl: "",
    href: trackHref("ma-tanto-sto-bene"),
    relatedTracks: [
      relatedTrack(
        "Ma Tanto Sto Bene",
        "ma-tanto-sto-bene",
        "La firma rossa sembra dire che ormai è deciso. Fuori c'è la frase più comoda — sto bene — ma sotto resta il peso di accordi, aspettative e parti di sé lasciate in pegno.",
      ),
    ],
  },
  {
    id: "disco-ball",
    x: 3,
    y: 86,
    radius: 6,
    title: "Disco ball",
    shortLabel: "DISCO",
    content:
      "La disco ball divide la stanza in frammenti: movimento, corpo, luce e amore riflesso male, come una festa che prova a coprire quello che resta acceso dentro.",
    badgeIcon: "/icons/badges/disco-ball.svg",
    score: 140,
    trackTitle: "MUOVI / Riflessioni, Pt. 3 (Amore)",
    playerUrl: "",
    href: trackHref("muovi"),
    relatedTracks: [
      relatedTrack(
        "MUOVI",
        "muovi",
        "La disco ball trasforma la stanza in movimento puro: corpo, luce, riflessi e istinto. Qui l'uscita non è pensare meglio, è muoversi prima di crollare.",
      ),
      relatedTrack(
        "Riflessioni, Pt. 3 (Amore)",
        "riflessioni-pt-3-amore",
        "I riflessi della disco ball diventano frammenti d'amore: belli, storti, sparsi ovunque. La luce non illumina tutto, ma mostra abbastanza per capire che qualcosa resta.",
      ),
    ],
  },
  {
    id: "marijuana-leaf",
    x: 69,
    y: 60,
    radius: 4,
    title: "Foglia di marijuana",
    shortLabel: "LEAF",
    content:
      "La foglia diventa un dettaglio minuscolo in una città gigantesca: una formica emotiva che attraversa strade, ricordi e stati alterati senza sapere davvero dove andare.",
    badgeIcon: "/icons/badges/marijuana-leaf.svg",
    score: 110,
    trackTitle: "Una Formica Sulla 34esima Strada",
    playerUrl: "",
    href: trackHref("una-formica-sulla-34esima-strada"),
    relatedTracks: [
      relatedTrack(
        "Una Formica Sulla 34esima Strada",
        "una-formica-sulla-34esima-strada",
        "La foglia è un dettaglio piccolo dentro una città troppo grande. Come una formica su una strada infinita, la traccia attraversa sproporzione, memoria e smarrimento.",
      ),
    ],
  },
  {
    id: "rick-gun-morty-shirt",
    x: 84,
    y: 40,
    radius: 10,
    title: "Pistola di Rick e maglietta di Morty",
    shortLabel: "RICK",
    content:
      "Qui la connessione è diretta: multiverso, inverno, soldi, ironia e caos. Il riferimento pop non è decorazione, è una porta aperta dentro la traccia.",
    badgeIcon: "/icons/badges/rick-gun-morty-shirt.svg",
    score: 190,
    trackTitle: "Inverno & Soldi (Rick & Morty)",
    playerUrl: "",
    href: trackHref("inverno-e-soldi-rick-e-morty"),
    relatedTracks: [
      relatedTrack(
        "Inverno & Soldi (Rick & Morty)",
        "inverno-e-soldi-rick-e-morty",
        "Il riferimento pop è una porta dimensionale: ironia, caos, freddo emotivo e soldi come coordinate di sopravvivenza. Rick e Morty diventano il simbolo di un multiverso mentale instabile.",
      ),
    ],
  },
  {
    id: "acoustic-guitar",
    x: 94,
    y: 88,
    radius: 8,
    title: "Chitarra acustica",
    shortLabel: "GTR",
    content:
      "La chitarra tiene il lato più nudo del disco: quando resta solo la canzone, senza corazza, e il pensiero di sparire diventa voce acustica.",
    badgeIcon: "/icons/badges/acoustic-guitar.svg",
    score: 150,
    trackTitle: "If I Die Tonight (Acoustic Version)",
    playerUrl: "",
    href: trackHref("if-i-die-tonight-acoustic-version"),
    relatedTracks: [
      relatedTrack(
        "If I Die Tonight (Acoustic Version)",
        "if-i-die-tonight-acoustic-version",
        "La chitarra toglie armatura alla traccia. Rimane la domanda nuda, senza rumore intorno: cosa resta di una canzone quando la voce non può più nascondersi?",
      ),
    ],
  },
  {
    id: "notebook",
    x: 69,
    y: 79,
    radius: 4,
    title: "Taccuino",
    shortLabel: "NOTE",
    content:
      "Il taccuino è l'origine: prima del viaggio, prima dei bonus, prima della deluxe. È il punto in cui tutto torna alla scrittura e al primo impulso di fare raap.",
    badgeIcon: "/icons/badges/notebook.svg",
    score: 120,
    trackTitle: "Intro (Raap)",
    playerUrl: "",
    href: trackHref("intro-raap"),
    relatedTracks: [
      relatedTrack(
        "Intro (Raap)",
        "intro-raap",
        "Il taccuino è l'origine del sistema: prima del disco, prima della stanza, prima della deluxe. È il punto in cui tutto torna alla scrittura, al primo bisogno di fare raap.",
      ),
    ],
  },
  {
    id: "toy-train",
    x: 81,
    y: 68,
    radius: 4,
    title: "Trenino giocattolo",
    shortLabel: "TRAIN",
    content:
      "Il trenino gira come il tempo: infanzia, attesa, giorni contati e pensieri che tornano allo stesso punto, finché il percorso non diventa memoria.",
    badgeIcon: "/icons/badges/toy-train.svg",
    score: 125,
    trackTitle: "Riflessioni, Pt. 1 (Tempo) / In 12 Giorni",
    playerUrl: "",
    href: trackHref("riflessioni-pt-1-tempo"),
    relatedTracks: [
      relatedTrack(
        "Riflessioni, Pt. 1 (Tempo)",
        "riflessioni-pt-1-tempo",
        "Il trenino gira come il tempo: sembra andare avanti, ma torna sempre allo stesso punto. La riflessione è sul movimento, sull'attesa e su ciò che cambia senza fare rumore.",
      ),
      relatedTrack(
        "In 12 Giorni",
        "in-12-giorni",
        "Dodici giorni diventano una misura emotiva: abbastanza pochi da sembrare niente, abbastanza lunghi da cambiare tutto. Il trenino tiene insieme distanza, infanzia e conto alla rovescia.",
      ),
    ],
  },
  {
    id: "astronaut",
    x: 50,
    y: 48,
    radius: 8,
    title: "Astronauta",
    shortLabel: "ASTRO",
    content:
      "L'astronauta è il corpo sospeso al centro della cover: non cade e non atterra. Rimane lì, dentro una riflessione sulla morte, sul vuoto e su quello che resta quando tutto si spegne.",
    badgeIcon: "/icons/badges/astronaut.svg",
    score: 250,
    trackTitle: "Riflessioni, Pt. 2 (Morte)",
    playerUrl: "",
    href: trackHref("riflessioni-pt-2-morte"),
    relatedTracks: [
      relatedTrack(
        "Riflessioni, Pt. 2 (Morte)",
        "riflessioni-pt-2-morte",
        "L'astronauta è sospeso nel vuoto: non cade, non atterra, non sa se sta tornando. È il corpo perfetto per una riflessione sulla morte, sul silenzio e su quello che rimane quando si spegne tutto.",
      ),
    ],
  },
  {
    id: "pill-bottle",
    x: 17,
    y: 31,
    radius: 4,
    title: "Bottiglietta di pillole",
    shortLabel: "PILLS",
    content:
      "La bottiglietta è il dettaglio più instabile: cura, eccesso, paura, controllo. Dentro ci stanno sia il fatalismo di Vada Come Vada sia la domanda più buia di If I Die Tonight.",
    badgeIcon: "/icons/badges/pill-bottle.svg",
    score: 135,
    trackTitle: "Vada Come Vada / If I Die Tonight",
    playerUrl: "",
    href: trackHref("vada-come-vada"),
    relatedTracks: [
      relatedTrack(
        "Vada Come Vada",
        "vada-come-vada",
        "La bottiglietta è controllo e resa insieme. Vada come vada: una frase che sembra fatalismo, ma nasconde la tensione di chi prova comunque a restare in piedi.",
      ),
      relatedTrack(
        "If I Die Tonight",
        "if-i-die-tonight",
        "Qui il dettaglio diventa più buio: pillole, paura, limite, possibilità. La domanda non è teatrale, è diretta — se finisse stanotte, cosa resterebbe davvero?",
      ),
    ],
  },
  {
    id: "planet",
    x: 72,
    y: 44,
    radius: 9,
    title: "Pianeta",
    shortLabel: "MOON",
    content:
      "Il pianeta è l'hub simbolico dell'album: l'orbita che tiene insieme le tracce non agganciate a un singolo oggetto. Qui il disco smette di essere stanza e diventa sistema.",
    badgeIcon: "/icons/badges/planet.svg",
    score: 220,
    trackTitle: "Hub album",
    playerUrl: "",
    href: `/musica/${albumSlug}`,
    relatedTracks: [
      relatedTrack(
        "Riflessioni, Pt. 1 (Tempo)",
        "riflessioni-pt-1-tempo",
        "Il tempo è una delle forze gravitazionali dell'album: muove tutto, anche quando sembra fermo.",
      ),
      relatedTrack(
        "Riflessioni, Pt. 2 (Morte)",
        "riflessioni-pt-2-morte",
        "La morte è il bordo nero dell'orbita: non sempre visibile, ma presente come limite attorno al viaggio.",
      ),
      relatedTrack(
        "Riflessioni, Pt. 3 (Amore)",
        "riflessioni-pt-3-amore",
        "L'amore è la terza traiettoria: non risolve il sistema, ma lo illumina a intermittenza.",
      ),
      relatedTrack(
        "Outro (Ehi!)",
        "outro-ehi",
        "Il pianeta chiude l'orbita: dopo oggetti, stanze, ricordi e riflessi, resta una voce che saluta e lascia il sistema sospeso.",
      ),
    ],
  },
];
