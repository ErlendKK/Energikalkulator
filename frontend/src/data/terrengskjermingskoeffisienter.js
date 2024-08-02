// NS3031 Tabell B.6

export const terrengskjermingskoeffisienter = {
  // Skjermingsklasse: Ingen Skjerming
  IngenSkjerming: {
    title: "Ingen skjerming",
    beskrivelse: "Bygninger i åpent landskap, høyblokker i bysentre",
    enUtsattFasade: {
      title: "Én utsatt fasade",
      e: 0.1,
      f: 20,
    },
    flereUtsatteFasader: {
      title: "Mer enn én utsatt fasade",
      e: 0.03,
      f: 15,
    },
  },
  // Skjermingsklasse: Moderat Skjerming
  ModeratSkjerming: {
    title: "Moderat skjerming",
    beskrivelse: "Bygninger på landet eller i forsteder med trær eller andre bygninger rundt",
    enUtsattFasade: {
      title: "Én utsatt fasade",
      e: 0.07,
      f: 20,
    },
    flereUtsatteFasader: {
      title: "Mer enn én utsatt fasade",
      e: 0.02,
      f: 15,
    },
  },
  // Skjermingsklasse: Høy Skjerming
  HoySkjerming: {
    title: "Høy skjerming",
    beskrivelse: "Bygninger av middels høyde i bysentre eller i skogområder",
    enUtsattFasade: {
      title: "Én utsatt fasade",
      e: 0.04,
      f: 20,
    },
    flereUtsatteFasader: {
      title: "Mer enn én utsatt fasade",
      e: 0.01,
      f: 15,
    },
  },
};
