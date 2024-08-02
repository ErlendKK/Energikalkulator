const bygningskategorier = [
  {
    kategori: "Småhus",
    internlaster: {
      forbruk: {
        belysning: { effekt: 1.95, energi: 11.4 },
        utstyr: { effekt: 3, energi: 17.5 },
        varmtvann: { effekt: 5.1, energi: 29.8 },
      },
      varmetilskudd: {
        belysning: { effekt: 1.95, energi: 11.4 },
        utstyr: { effekt: 1.8, energi: 10.5 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 1.5, energi: 13.1 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 16, døgn: 7, uker: 52 },
      ventilasjon: { timer: 24, døgn: 7, uker: 52 },
      personer: { timer: 24, døgn: 7, uker: 52 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
    },
    luftmengderKontroll: {
      driftstiden: 1.2,
      utenforDriftstiden: 1.2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: 1.2,
      spesifikkVifteEffekt: 2.5,
      temperaturØkningOverVifte: 0.93,
      temperaturOppvarming: 20.3,
    },
    årligeDriftstimerPumper: {
      oppvarming: 5300,
      kjøling: 0,
    },
  },
  {
    kategori: "Boligblokk",
    internlaster: {
      forbruk: {
        belysning: { effekt: 1.95, energi: 11.4 },
        utstyr: { effekt: 3, energi: 17.5 },
        varmtvann: { effekt: 5.1, energi: 29.8 },
      },
      varmetilskudd: {
        belysning: { effekt: 1.95, energi: 11.4 },
        utstyr: { effekt: 1.8, energi: 10.5 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 1.5, energi: 13.1 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 16, døgn: 7, uker: 52 },
      ventilasjon: { timer: 24, døgn: 7, uker: 52 },
      personer: { timer: 24, døgn: 7, uker: 52 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
    },
    luftmengderKontroll: {
      driftstiden: 1.2,
      utenforDriftstiden: 1.2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: 1.7,
      spesifikkVifteEffekt: 2.5,
      temperaturØkningOverVifte: 0.93,
      temperaturOppvarming: 20.3,
    },
    årligeDriftstimerPumper: {
      oppvarming: 5300,
      kjøling: 0,
    },
  },
  {
    kategori: "Barnehage",
    internlaster: {
      forbruk: {
        belysning: { effekt: 8, energi: 21 },
        utstyr: { effekt: 5, energi: 12 },
        varmtvann: { effekt: 2, energi: 5 },
      },
      varmetilskudd: {
        belysning: { effekt: 8, energi: 21 },
        utstyr: { effekt: 5, energi: 12 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 6, energi: 16 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 10, døgn: 5, uker: 52 },
      ventilasjon: { timer: 10, døgn: 5, uker: 52 },
      personer: { timer: 10, døgn: 5, uker: 52 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
    },
    luftmengderKontroll: {
      driftstiden: 8,
      utenforDriftstiden: 2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: 5.7,
      spesifikkVifteEffekt: 1.3,
      temperaturØkningOverVifte: 0.48,
      temperaturOppvarming: 19.6,
    },
    årligeDriftstimerPumper: {
      oppvarming: 5300,
      kjøling: 0,
    },
  },
  {
    kategori: "Kontorbygning",
    internlaster: {
      forbruk: {
        belysning: { effekt: 8, energi: 25 },
        utstyr: { effekt: 11, energi: 34 },
        varmtvann: { effekt: 1.6, energi: 5 },
      },
      varmetilskudd: {
        belysning: { effekt: 8, energi: 25 },
        utstyr: { effekt: 11, energi: 34 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 3, energi: 13 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 12, døgn: 5, uker: 52 },
      ventilasjon: { timer: 12, døgn: 5, uker: 52 },
      personer: { timer: 12, døgn: 5, uker: 52 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
      kjøling: 22,
    },
    luftmengderKontroll: {
      driftstiden: 7,
      utenforDriftstiden: 2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: 5.5,
      spesifikkVifteEffekt: 1.4,
      temperaturØkningOverVifte: 0.5,
      temperaturOppvarming: 19.7,
    },
    årligeDriftstimerPumper: {
      oppvarming: 4000,
      kjøling: 2920,
    },
  },
  {
    kategori: "Skolebygning",
    internlaster: {
      forbruk: {
        belysning: { effekt: 10, energi: 22 },
        utstyr: { effekt: 6, energi: 13 },
        varmtvann: { effekt: 4, energi: 10 },
      },
      varmetilskudd: {
        belysning: { effekt: 10, energi: 22 },
        utstyr: { effekt: 6, energi: 13 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 4, energi: 12 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 10, døgn: 5, uker: 44 },
      ventilasjon: { timer: 10, døgn: 5, uker: 44 },
      personer: { timer: 10, døgn: 5, uker: 44 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
      kjøling: 22,
    },
    luftmengderKontroll: {
      driftstiden: 10,
      utenforDriftstiden: 2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: {
        juni: 6.0,
        juli: 6.0,
        august: 6.0,
        desember: 6.0,
        default: 6.9,
      },
      spesifikkVifteEffekt: {
        juni: 1.2,
        juli: 1.2,
        august: 1.2,
        desember: 1.2,
        default: 1.4,
      },
      temperaturØkningOverVifte: {
        juni: 0.46,
        juli: 0.37,
        august: 0.46,
        desember: 0.47,
        default: 0.48,
      },
      temperaturOppvarming: 19.5,
    },
    årligeDriftstimerPumper: {
      oppvarming: 4500,
      kjøling: 0,
    },
  },
  {
    kategori: "Universitets- og høgskolebygning",
    internlaster: {
      forbruk: {
        belysning: { effekt: 8, energi: 25 },
        utstyr: { effekt: 11, energi: 34 },
        varmtvann: { effekt: 3, energi: 8 },
      },
      varmetilskudd: {
        belysning: { effekt: 8, energi: 25 },
        utstyr: { effekt: 11, energi: 34 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 3, energi: 10 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 12, døgn: 5, uker: 52 },
      ventilasjon: { timer: 12, døgn: 5, uker: 52 },
      personer: { timer: 12, døgn: 5, uker: 52 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
      kjøling: 22,
    },
    luftmengderKontroll: {
      driftstiden: 8,
      utenforDriftstiden: 2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: 6.6,
      spesifikkVifteEffekt: 1.4,
      temperaturØkningOverVifte: 0.5,
      temperaturOppvarming: 19.7,
    },
    årligeDriftstimerPumper: {
      oppvarming: 4500,
      kjøling: 2920,
    },
  },
  {
    kategori: "Sykehus",
    internlaster: {
      forbruk: {
        belysning: { effekt: 8, energi: 47 },
        utstyr: { effekt: 45, energi: 157 },
        varmtvann: { effekt: 14, energi: 50 },
      },
      varmetilskudd: {
        belysning: { effekt: 8, energi: 47 },
        utstyr: { effekt: 45, energi: 157 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 8, energi: 35 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 16, døgn: 7, uker: 52 },
      ventilasjon: { timer: 16, døgn: 7, uker: 52 },
      personer: { timer: 24, døgn: 7, uker: 52 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
      kjøling: 22,
    },
    luftmengderKontroll: {
      driftstiden: 10,
      utenforDriftstiden: 2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: 11.7,
      spesifikkVifteEffekt: 1.7,
      temperaturØkningOverVifte: 0.62,
      temperaturOppvarming: 20.7,
    },
    årligeDriftstimerPumper: {
      oppvarming: 5300,
      kjøling: 2920,
    },
  },
  {
    kategori: "Sykehjem",
    internlaster: {
      forbruk: {
        belysning: { effekt: 8, energi: 47 },
        utstyr: { effekt: 6, energi: 47 },
        varmtvann: { effekt: 13.2, energi: 47 },
      },
      varmetilskudd: {
        belysning: { effekt: 8, energi: 47 },
        utstyr: { effekt: 6, energi: 47 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 8, energi: 35 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 16, døgn: 7, uker: 52 },
      ventilasjon: { timer: 16, døgn: 7, uker: 52 },
      personer: { timer: 24, døgn: 7, uker: 52 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
      kjøling: 22,
    },
    luftmengderKontroll: {
      driftstiden: 9,
      utenforDriftstiden: 2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: 10.3,
      spesifikkVifteEffekt: 1.7,
      temperaturØkningOverVifte: 0.52,
      temperaturOppvarming: 19.9,
    },
    årligeDriftstimerPumper: {
      oppvarming: 5300,
      kjøling: 0,
    },
  },
  {
    kategori: "Hotellbygning",
    internlaster: {
      forbruk: {
        belysning: { effekt: 8, energi: 47 },
        utstyr: { effekt: 4, energi: 33 },
        varmtvann: { effekt: 18.9, energi: 50 },
      },
      varmetilskudd: {
        belysning: { effekt: 8, energi: 47 },
        utstyr: { effekt: 4, energi: 33 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 10, energi: 50 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 16, døgn: 7, uker: 52 },
      ventilasjon: { timer: 24, døgn: 7, uker: 52 },
      personer: { timer: 24, døgn: 7, uker: 52 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
      kjøling: 22,
    },
    luftmengderKontroll: {
      driftstiden: 9,
      utenforDriftstiden: 2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: {
        default: 7.7,
        juni: 6.0,
        juli: 1.2,
        august: 1.2,
        desember: 1.3,
      },
      spesifikkVifteEffekt: {
        default: 1.4,
        juni: 1.2,
        juli: 1.2,
        august: 1.2,
        desember: 1.3,
      },
      temperaturØkningOverVifte: {
        default: 0.5,
        juni: 0.46,
        juli: 0.37,
        august: 0.46,
        desember: 0.47,
      },
      temperaturOppvarming: 19.5,
    },
    årligeDriftstimerPumper: {
      oppvarming: 4500,
      kjøling: 0,
    },
  },
  {
    kategori: "Idrettsbygning",
    internlaster: {
      forbruk: {
        belysning: { effekt: 8, energi: 21 },
        utstyr: { effekt: 1, energi: 4 },
        varmtvann: { effekt: 25, energi: 90 },
      },
      varmetilskudd: {
        belysning: { effekt: 8, energi: 21 },
        utstyr: { effekt: 1, energi: 4 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 4, energi: 15 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 9, døgn: 5, uker: 52 },
      ventilasjon: { timer: 9, døgn: 5, uker: 52 },
      personer: { timer: 9, døgn: 5, uker: 52 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
      kjøling: 22,
    },
    luftmengderKontroll: {
      driftstiden: 8,
      utenforDriftstiden: 2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: {
        juni: 5.5,
        juli: 3.0,
        august: 5.0,
        desember: 5.5,
        default: 6.2,
      },
      spesifikkVifteEffekt: {
        juni: 1.2,
        juli: 1.2,
        august: 1.2,
        desember: 1.3,
        default: 1.4,
      },
      temperaturØkningOverVifte: {
        juni: 0.37,
        juli: 0.37,
        august: 0.46,
        desember: 0.47,
        default: 0.5,
      },
      temperaturOppvarming: 17.6,
    },
    årligeDriftstimerPumper: {
      oppvarming: 4500,
      kjøling: 0,
    },
  },
  {
    kategori: "Forretningsbygning",
    internlaster: {
      forbruk: {
        belysning: { effekt: 15, energi: 56 },
        utstyr: { effekt: 4, energi: 27 },
        varmtvann: { effekt: 2.7, energi: 10 },
      },
      varmetilskudd: {
        belysning: { effekt: 15, energi: 56 },
        utstyr: { effekt: 4, energi: 27 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 3.2, energi: 9 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 12, døgn: 6, uker: 52 },
      ventilasjon: { timer: 12, døgn: 6, uker: 52 },
      personer: { timer: 12, døgn: 6, uker: 52 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
      kjøling: 22,
    },
    luftmengderKontroll: {
      driftstiden: 13,
      utenforDriftstiden: 2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: 11.4,
      spesifikkVifteEffekt: 1.4,
      temperaturØkningOverVifte: 0.53,
      temperaturOppvarming: 19.9,
    },
    årligeDriftstimerPumper: {
      oppvarming: 4500,
      kjøling: 2920,
    },
  },
  {
    kategori: "Kulturbygning",
    internlaster: {
      forbruk: {
        belysning: { effekt: 8, energi: 23 },
        utstyr: { effekt: 3, energi: 20 },
        varmtvann: { effekt: 2, energi: 5 },
      },
      varmetilskudd: {
        belysning: { effekt: 8, energi: 23 },
        utstyr: { effekt: 3, energi: 20 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 3.2, energi: 9 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 11, døgn: 5, uker: 52 },
      ventilasjon: { timer: 11, døgn: 5, uker: 52 },
      personer: { timer: 11, døgn: 5, uker: 52 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
      kjøling: 22,
    },
    luftmengderKontroll: {
      driftstiden: 8,
      utenforDriftstiden: 2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: 5.9,
      spesifikkVifteEffekt: 1.3,
      temperaturØkningOverVifte: 0.47,
      temperaturOppvarming: 19.5,
    },
    årligeDriftstimerPumper: {
      oppvarming: 5300,
      kjøling: 0,
    },
  },
  {
    kategori: "Lett industribygning, verksted",
    internlaster: {
      forbruk: {
        belysning: { effekt: 8, energi: 19 },
        utstyr: { effekt: 10, energi: 23 },
        varmtvann: { effekt: 4.3, energi: 10 },
      },
      varmetilskudd: {
        belysning: { effekt: 8, energi: 19 },
        utstyr: { effekt: 10, energi: 23 },
        varmtvann: { effekt: 0, energi: 0 },
        personer: { effekt: 2, energi: 5 },
      },
    },
    driftstider: {
      lysVarmeUtstyr: { timer: 9, døgn: 5, uker: 52 },
      ventilasjon: { timer: 9, døgn: 5, uker: 52 },
      personer: { timer: 9, døgn: 5, uker: 52 },
    },
    setpunktTemp: {
      varmeDriftstiden: 21,
      varmeUtenforDriftstiden: 19,
      kjøling: 22,
    },
    luftmengderKontroll: {
      driftstiden: 8,
      utenforDriftstiden: 2,
    },
    veiledendeVerdier: {
      spesifikkLuftmengde: 5.4,
      spesifikkVifteEffekt: 1.3,
      temperaturØkningOverVifte: 0.47,
      temperaturOppvarming: 19.5,
    },
    årligeDriftstimerPumper: {
      oppvarming: 4500,
      kjøling: 2920,
    },
  },
];

export default bygningskategorier;
