/**
 * f_with: andelen av tiden variabel solskjerming er aktiv
 */
const andelTidVariabelSolskjerming = {
  "Automatisk styrt solskjerming": {
    S: {
      januar: 0.04,
      februar: 0.11,
      mars: 0.17,
      april: 0.24,
      mai: 0.27,
      juni: 0.3,
      juli: 0.28,
      august: 0.26,
      september: 0.19,
      oktober: 0.11,
      november: 0.08,
      desember: 0.05,
    },
    "Ø/V": {
      januar: 0.01,
      februar: 0.04,
      mars: 0.08,
      april: 0.19,
      mai: 0.22,
      juni: 0.32,
      juli: 0.29,
      august: 0.18,
      september: 0.1,
      oktober: 0.06,
      november: 0.03,
      desember: 0.01,
    },
    N: {
      januar: 0.0,
      februar: 0.0,
      mars: 0.01,
      april: 0.05,
      mai: 0.11,
      juni: 0.22,
      juli: 0.16,
      august: 0.04,
      september: 0.01,
      oktober: 0.0,
      november: 0.0,
      desember: 0.0,
    },
  },
  "Manuelt styrt solskjerming": {
    S: {
      januar: 0.06,
      februar: 0.15,
      mars: 0.23,
      april: 0.19,
      mai: 0.19,
      juni: 0.23,
      juli: 0.21,
      august: 0.22,
      september: 0.15,
      oktober: 0.15,
      november: 0.1,
      desember: 0.07,
    },
    "Ø/V": {
      januar: 0.02,
      februar: 0.08,
      mars: 0.16,
      april: 0.15,
      mai: 0.16,
      juni: 0.23,
      juli: 0.19,
      august: 0.14,
      september: 0.07,
      oktober: 0.09,
      november: 0.05,
      desember: 0.03,
    },
    N: {
      januar: 0.0,
      februar: 0.03,
      mars: 0.1,
      april: 0.0,
      mai: 0.01,
      juni: 0.05,
      juli: 0.03,
      august: 0.0,
      september: 0.0,
      oktober: 0.02,
      november: 0.0,
      desember: 0.0,
    },
  },
};

/**
 * g-verdi glassfeltet
 * gg er solfaktor (hemisfærisk verdi) for glassfeltet;
 * gt er den totale solfaktoren for kombinasjonen av glassfelt og kunstig solskjerming (f_with).
 */
const solskjermingsfaktorGlass = {
  "Lyse utvendige persienner, 80 mm lameller": {
    "2 lags energi": {
      gg: 0.51,
      gt: 0.06,
    },
    "3 lags energi": {
      gg: 0.4,
      gt: 0.05,
    },
    "2 lags solreflekterende": {
      gg: 0.24,
      gt: 0.04,
    },
  },
  "Lyse persienner mellom glass, 28 mm lameller": {
    "Koblet rute 2 + 1 (2 lags energi + 1 koblet)": {
      gg: 0.47,
      gt: 0.17,
    },
  },
  "Innvendige persienner, 28 mm lameller": {
    "2 lags energi": {
      gg: 0.51,
      gt: 0.38,
    },
    "3 lags energi": {
      gg: 0.4,
      gt: 0.31,
    },
    "2 lags solreflekterende": {
      gg: 0.24,
      gt: 0.18,
    },
  },
  "Utvendige screen": {
    "2 lags energi": {
      gg: 0.51,
      gt: 0.06,
    },
    "3 lags energi": {
      gg: 0.4,
      gt: 0.04,
    },
    "2 lags solreflekterende": {
      gg: 0.24,
      gt: 0.03,
    },
  },
  "Screen mellom glass": {
    "Koblet rute 2 + 1 (2 lags energi + 1 koblet)": {
      gg: 0.47,
      gt: 0.07,
    },
  },
  "Innvendig screen": {
    "2 lags energi": {
      gg: 0.51,
      gt: 0.43,
    },
    "3 lags energi": {
      gg: 0.4,
      gt: 0.35,
    },
    "2 lags solreflekterende": {
      gg: 0.24,
      gt: 0.2,
    },
  },
  Markise: {
    "2 lags energi": {
      gg: 0.51,
      gt: {
        sør: { sommer: 0.19, vinter: 0.2 },
        østVest: { sommer: 0.21, vinter: 0.29 },
        nord: { sommer: 0.28, vinter: 0.26 },
      },
    },
    "3 lags energi": {
      gg: 0.4,
      gt: {
        sør: { sommer: 0.15, vinter: 0.15 },
        østVest: { sommer: 0.16, vinter: 0.22 },
        nord: { sommer: 0.22, vinter: 0.2 },
      },
    },
    "2 lags solreflekterende": {
      gg: 0.24,
      gt: {
        sør: { sommer: 0.09, vinter: 0.09 },
        østVest: { sommer: 0.1, vinter: 0.14 },
        nord: { sommer: 0.13, vinter: 0.12 },
      },
    },
  },
};

/**
 * Tabell E.6 Solskjermingsfaktoren pga. overheng, som funksjon av overhengsvinkel ,
 * breddegrad, orientering og årstid. Sommerverdiene gjelder for perioden april til og med
 * september, og vinterverdiene gjelder for perioden oktober til og med mars.
 */
const solskjermingsfaktorOverheng = {
  58: {
    S: {
      60: { sommer: 0.82, vinter: 0.48 },
      45: { sommer: 0.98, vinter: 0.84 },
      30: { sommer: 0.99, vinter: 0.98 },
    },
    "Ø/V": {
      60: { sommer: 0.81, vinter: 0.66 },
      45: { sommer: 0.94, vinter: 0.91 },
      30: { sommer: 0.98, vinter: 0.98 },
    },
    N: {
      60: { sommer: 0.91, vinter: 0.77 },
      45: { sommer: 0.95, vinter: 0.98 },
      30: { sommer: 0.98, vinter: 0.98 },
    },
  },
  64: {
    S: {
      60: { sommer: 0.87, vinter: 0.49 },
      45: { sommer: 0.99, vinter: 0.86 },
      30: { sommer: 1.0, vinter: 0.99 },
    },
    "Ø/V": {
      60: { sommer: 0.82, vinter: 0.66 },
      45: { sommer: 0.95, vinter: 0.91 },
      30: { sommer: 0.98, vinter: 0.98 },
    },
    N: {
      60: { sommer: 0.79, vinter: 0.77 },
      45: { sommer: 0.98, vinter: 0.92 },
      30: { sommer: 0.98, vinter: 0.98 },
    },
  },
  70: {
    S: {
      60: { sommer: 0.93, vinter: 0.55 },
      45: { sommer: 0.99, vinter: 0.92 },
      30: { sommer: 1.0, vinter: 0.99 },
    },
    "Ø/V": {
      60: { sommer: 0.92, vinter: 0.7 },
      45: { sommer: 0.98, vinter: 0.93 },
      30: { sommer: 0.98, vinter: 0.99 },
    },
    N: {
      60: { sommer: 0.95, vinter: 0.77 },
      45: { sommer: 0.98, vinter: 0.92 },
      30: { sommer: 1.0, vinter: 0.99 },
    },
  },
};

/**
 * Array of text describing the assumptions behind the numbers for markise
 * To be joined
 */
const merknaderAutomatiskSolskjerming = [
  "Verdiene for automatisk solskjerming er regnet ut fra at solkjermingen går på når solstrålingen på vinduet/fasaden overstiger 175 W/m2.",
  "For manuell solskjerming er det antatt at solskjermingen går på når solstrålingen overstiger 100 W/m2 i vinterhalvåret (oktober - mars),",
  "og 250 W/m2 i sommerhalvåret (april - september).",
];

const merknadUtvendigScreen =
  "Regnet med en screen med 4 % soltransmisjon (for både direkte og diffus stråling).";

/**
 * Array of bulletpoints describing the assumptions behind the numbers for markise
 * To be joined
 */
const merknaderMarkise = [
  "Utregningene i tabellen er basert på følgende antakelser:",
  "markisen er montert 10 cm over vinduet;",
  "vinduet er totalt 1,4 meter høyt;",
  "markisens rotasjonsarm er 100 cm lang;",
  "markisen dekker halve høyden av vinduet i aktivert tilstand (nede);",
  "vinduet er 1,2 meter bredt, og markisen stikker 10 cm ut på hver side av vinduet;",
  "markisen har en diffus soltransmisjon på 8 %.",
  "Andre beregningsantakelser enn disse vil kunne gi betydelig andre totale solfaktorer enn angitt i tabell E.3.",
];

export {
  solskjermingsfaktorGlass,
  andelTidVariabelSolskjerming,
  solskjermingsfaktorOverheng,
  merknaderMarkise,
  merknadUtvendigScreen,
  merknaderAutomatiskSolskjerming,
};
