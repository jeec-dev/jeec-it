import type { Album } from "@/types/music";

const newTrackCredits = ["JeeC", "Giosuè Rasi"];

export const albums: Album[] = [
  {
    slug: "new-tutto-quello-che-non-ti-ho-detto",
    title: "NEW (Tutto Quello Che Non Ti Ho Detto)",
    type: "album",
    cover: "/images/covers/Copertina_NEW_TQCNTHD.PNG",
    year: "2026",
    label: "Urban Film Music",
    releaseDate: "2026-02-06",
    displayDate: "6 febbraio 2026",
    spotifyUrl: "",
    description:
      "La deluxe edition che riapre l’universo di NEW a cinque anni dalla sua prima uscita. Il progetto raccoglie i 14 brani originali in versione remastered e 4 bonus track, trasformando l’album in un viaggio più completo tra ricordi, pensieri sospesi, relazioni, notti irrisolte e parole rimaste fuori campo.",
    tracks: [
      {
        slug: "intro-raap",
        title: "Intro (Raap)",
        trackNumber: 1,
        credits: newTrackCredits,
      },
      {
        slug: "riflessioni-pt-1-tempo",
        title: "Riflessioni, Pt. 1 (Tempo)",
        trackNumber: 2,
        credits: newTrackCredits,
      },
      {
        slug: "nicotina-bojack-horseman",
        title: "Nicotina (Bojack Horseman)",
        trackNumber: 3,
        credits: newTrackCredits,
      },
      {
        slug: "vada-come-vada",
        title: "Vada Come Vada",
        trackNumber: 4,
        featuredArtists: ["Cargo", "Margot"],
        credits: [...newTrackCredits, "Cargo", "Margot"],
      },
      {
        slug: "gimmie-another",
        title: "Gimmie Another",
        trackNumber: 5,
        credits: newTrackCredits,
      },
      {
        slug: "riflessioni-pt-2-morte",
        title: "Riflessioni, Pt. 2 (Morte)",
        trackNumber: 6,
        credits: newTrackCredits,
      },
      {
        slug: "inverno-e-soldi-rick-e-morty",
        title: "Inverno & Soldi (Rick & Morty)",
        trackNumber: 7,
        credits: newTrackCredits,
      },
      {
        slug: "if-i-die-tonight",
        title: "If I Die Tonight",
        trackNumber: 8,
        credits: newTrackCredits,
      },
      {
        slug: "ma-tanto-sto-bene",
        title: "Ma Tanto Sto Bene",
        trackNumber: 9,
        credits: newTrackCredits,
      },
      {
        slug: "riflessioni-pt-3-amore",
        title: "Riflessioni, Pt. 3 (Amore)",
        trackNumber: 10,
        credits: newTrackCredits,
      },
      {
        slug: "stammi-vicino-dai",
        title: "Stammi Vicino Dai",
        trackNumber: 11,
        featuredArtists: ["SEMUA"],
        credits: [...newTrackCredits, "SEMUA"],
      },
      {
        slug: "in-12-giorni",
        title: "In 12 Giorni",
        trackNumber: 12,
        credits: [...newTrackCredits, "H3 Music"],
      },
      {
        slug: "lo-sai",
        title: "Lo Sai",
        trackNumber: 13,
        credits: newTrackCredits,
      },
      {
        slug: "outro-ehi",
        title: "Outro (Ehi!)",
        trackNumber: 14,
        credits: newTrackCredits,
      },
      {
        slug: "una-formica-sulla-34esima-strada",
        title: "Una Formica Sulla 34esima Strada",
        trackNumber: 15,
        credits: newTrackCredits,
      },
      {
        slug: "if-i-die-tonight-acoustic-version",
        title: "If I Die Tonight (Acoustic Version)",
        trackNumber: 16,
        credits: newTrackCredits,
      },
      {
        slug: "pedine-come-voi",
        title: "Pedine (Come Voi)",
        trackNumber: 17,
        featuredArtists: ["Jack Langellotti"],
        credits: [...newTrackCredits, "Jack Langellotti"],
      },
      {
        slug: "muovi",
        title: "MUOVI",
        trackNumber: 18,
        credits: newTrackCredits,
      },
    ],
  },
];
