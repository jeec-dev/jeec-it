import type { Hotspot } from "@/types/hotspot";

const albumSlug = "new-tutto-quello-che-non-ti-ho-detto";

function trackHref(trackSlug: string) {
  return `/musica/${albumSlug}/${trackSlug}`;
}

function relatedTrack(title: string, trackSlug: string) {
  return {
    title,
    href: trackHref(trackSlug),
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
      relatedTrack("Pedine (Come Voi)", "pedine-come-voi"),
      relatedTrack("Lo Sai", "lo-sai"),
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
      relatedTrack("Gimmie Another", "gimmie-another"),
      relatedTrack("Nicotina (Bojack Horseman)", "nicotina-bojack-horseman"),
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
    relatedTracks: [relatedTrack("Stammi Vicino Dai", "stammi-vicino-dai")],
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
    relatedTracks: [relatedTrack("Ma Tanto Sto Bene", "ma-tanto-sto-bene")],
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
      relatedTrack("MUOVI", "muovi"),
      relatedTrack("Riflessioni, Pt. 3 (Amore)", "riflessioni-pt-3-amore"),
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
    relatedTracks: [relatedTrack("Intro (Raap)", "intro-raap")],
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
      relatedTrack("Riflessioni, Pt. 1 (Tempo)", "riflessioni-pt-1-tempo"),
      relatedTrack("In 12 Giorni", "in-12-giorni"),
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
      relatedTrack("Riflessioni, Pt. 2 (Morte)", "riflessioni-pt-2-morte"),
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
    relatedTracks: [relatedTrack("Outro (Ehi!)", "outro-ehi")],
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
      relatedTrack("Vada Come Vada", "vada-come-vada"),
      relatedTrack("If I Die Tonight", "if-i-die-tonight"),
    ],
  },
];
