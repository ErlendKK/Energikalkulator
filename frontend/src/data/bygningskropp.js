//Tabell A.4 - Standardverdier for normaliserte kuldebroverdier
const kuldebroverdier = {
  "Bygning med bæresystem i tre": {
    description: "Bygning med bæresystem i tre",
    value: "0.05",
  },
  "Bygning med bæresystem i betong, mur eller stål og 10 cm kuldebrobryter i fasadene": {
    description:
      "Bygning med bæresystem i betong, mur eller stål og 10 cm kuldebrobryter i fasadene",
    value: "0.09",
  },
  "Bygning med bæresystem i betong, mur eller stål og 5 cm kuldebrobryter i fasadene": {
    description:
      "Bygning med bæresystem i betong, mur eller stål og 5 cm kuldebrobryter i fasadene",
    value: "0.12",
  },
};

// Tabell B.3 - Veiledende verdier for bygningers lekkasjetall ved 50 Pa, n50
const lekkasjetall = {
  "Lekkasje for småhus i TEK 2007": {
    description:
      "Lekkasje for småhus som ligger til grunn for energirammer i revidert byggeforskrift (TEK) av 2007",
    value: "2.5",
  },
  "Lekkasje for andre kategorier i TEK 2007": {
    description:
      "Lekkasje for andre bygningskategorier som ligger til grunn for energirammer i revidert byggeforskrift (TEK) av 2007",
    value: "1.5",
  },
  "Minstekrav til lekkasjetall i TEK 2007": {
    description:
      "Minstekrav til lekkasjetall for alle bygningskategorier i revidert byggeforskrift (TEK) av 2007",
    value: "3.0",
  },
  "Anbefalt nivå for småhus i TEK 1997": {
    description: "Anbefalt nivå for småhus i byggeforskriften (TEK) av 1997",
    value: "4.0",
  },
  "Anbefalt nivå for andre kategorier <=2 etasjer TEK 1987-1997": {
    description:
      "Anbefalt nivå for andre bygningskategorier inntil 2 etasjer i byggeforskrift av 1987 og 1997",
    value: "3.0",
  },
  "Anbefalt nivå for andre kategorier >2 etasjer TEK 1987-1997": {
    description:
      "Anbefalt nivå for andre bygningskategorier over 2 etasjer i byggeforskrift av 1987 og 1997",
    value: "1.5",
  },
  "Anbefalt nivå for kategorier <=2 etasjer TEK 1969-1985": {
    description:
      "Anbefalt nivå for bygningskategorier inntil 2 etasjer i byggeforskrifter av 1969 og 1985",
    value: "3.0",
  },
  "Anbefalt nivå for kategorier >2 etasjer TEK 1969-1985": {
    description:
      "Anbefalt nivå for bygningskategorier over 2 etasjer i byggeforskrifter av 1969 og 1985",
    value: "1.5",
  },
  "Passivhus-standard": {
    description: "Passivhus-standard med prosjekterte detaljer og krav til lekkasjeprøving",
    value: "0.6",
  },
};

export { kuldebroverdier, lekkasjetall };
