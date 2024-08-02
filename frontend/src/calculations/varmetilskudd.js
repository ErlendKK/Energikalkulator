import bygningskategorier from "../data/bygningskategorier";
import {
  solskjermingsfaktorGlass,
  andelTidVariabelSolskjerming,
  solskjermingsfaktorOverheng,
} from "../data/solskjerming";
import { strålingsflukser, månedsdata } from "../data/månedsdata";
import { getÅrligeTimerIOgUtenforDrift } from "./varmetap";
import { getEmptyReturnArray } from "../utils/misc";

/**
 * Beregner varmetilskudd [kWh] fra sol (NS 3031 6.1.1.2.1) per måned for en gitt sone
 *
 * @param {Object} projectHierarchy - Prosjektets node-hierarki.
 * @param {Object} sortedNodes - Et objekt som inneholder sorterte node-objects som representerer prosjektet.
 * @param {string} key - sone.key for sonen varmetilskuddet skal beregnes for.
 * @returns {Array} - En array med objekter som inneholder måned og totalt varmetilskudd via vinduer for den måneden, i kWh.
 */
function getVarmetilskuddSol(projectHierarchy, sortedNodes, key) {
  const vindusArray = sortedNodes.vinduOgDør.filter((vindu) => vindu.sone === key);
  if (!vindusArray.length) return getEmptyReturnArray();

  const bygningskategori = projectHierarchy.data.bygningskategori.value;
  const breddegrad = projectHierarchy.data.breddegrad.value;

  return månedsdata.map((month) => {
    const normalisertDriftstid = month.timer / 1000; // for omregning til kWh
    let totalVarmetilskudd = 0; // [kWh]

    vindusArray.forEach((vindu) => {
      const vindusareal = Number(vindu.data.areal.value);
      const andelKarm = Number(vindu.data.andelKarm.value);
      const orientering = getOrientering(vindu.data);
      const helning = Number(vindu.data.helning.value);

      const solskjermingHorisont = getSolskjermingHorisont(vindu.data);
      const solskjermingUtspring = getSolskjermingUtspring(breddegrad, vindu.data, month.navn);
      const solskjermingsfaktor_Fs = solskjermingHorisont + solskjermingUtspring;

      // Månedsgjennomsnittlig strålingsfluks mot utsiden av vinduene, i W/m2;
      const strålingsfluks = strålingsflukser.find((item) => {
        return item.orientering === orientering && item.helning === helning;
      });

      const solfaktor = getSolfaktorVindu(vindu.data, bygningskategori, month.navn);
      const effektivtVindusareal = vindusareal * solfaktor * (1 - andelKarm);

      // Varmeilskudd fra solinnstråling en gitt måned og et gitt vindu [kWh]
      const varmetilskudd =
        normalisertDriftstid *
        strålingsfluks[month.navn] *
        effektivtVindusareal *
        solskjermingsfaktor_Fs;
      totalVarmetilskudd += varmetilskudd;
    });

    return {
      måned: month.navn,
      varmetilskudd: totalVarmetilskudd,
    };
  });
}

/**
 * Bestemmer orientering basert på himmelretning-verdi.
 *
 * @param {Object} node - Objektet som inneholder himmelretning og vinkel egenskaper.
 * @returns {string} - Orienteringen (orientering) basert på himmelretning-verdi ('N', 'Ø', 'S', 'V' eller 'Ukjent').
 */
function getOrientering(node) {
  const himmelretning = Number(node.himmelretning.value);
  let orientering;

  if (himmelretning < 45 || himmelretning >= 315) {
    orientering = "N";
  } else if (himmelretning >= 45 && himmelretning < 135) {
    orientering = "Ø/V";
  } else if (himmelretning >= 135 && himmelretning < 225) {
    orientering = "S";
  } else if (himmelretning >= 225 && himmelretning < 315) {
    orientering = "Ø/V";
  } else {
    orientering = "Ukjent";
  }

  return orientering;
}

/**
 * Beregner solfaktor basert på vindusdata, bygningskategori og måned.
 *
 * @param {Object} vindusData - Brukerdata for vinduet.
 * @param {string} bygningskategori - Bygningskategorien.
 * @param {string} month - Måneden solfaktoren beregnes for.
 * @returns {number} - Den beregnede solfaktoren.
 */
function getSolfaktorVindu(vindusData, bygningskategori, month) {
  const isAutomatiskSkjerming = vindusData.isAutomatiskSkjerming.value;
  const skjermingsType = vindusData.skjermingsType.value;
  const glassType = vindusData.glassType.value;
  const orientering = Number(vindusData.orientering.value);

  // gg = solfaktoren for glassfeltet;
  // gt = total solfaktore for glassfelt + solskjerming
  const { gg, gt } = solskjermingsfaktorGlass[skjermingsType][glassType];

  // hvis f_with === 0; returner 0.9 * solfaktoren for glassfeltet
  if (
    !isAutomatiskSkjerming ||
    bygningskategori === "småhus" ||
    bygningskategori === "boligblokk" // TODO: Vurder oppvarmingsbehov
  ) {
    return 0.9 * gg;
  }

  // f_with: andelen av tiden solskjermingen er aktiv;
  f_with = andelTidVariabelSolskjerming[skjermingsType][orientering][month.navn];
  return (1 - f_with) * gg + f_with * gt;
}

/**
 * Henter solskjermingsfaktoren horisont basert på vindusdata.
 *
 * @param {Object} vindusData - Objektet som inneholder vindusinformasjon.
 * @param {Object} vindusData.horisontvinkel - Objekt som inneholder horisontvinkelen.
 * @returns {number} - Den beregnede solskjermingsfaktoren horisont.
 */
function getSolskjermingHorisont(vindusData) {
  const horisontvinkel = Number(vindusData.horisontvinkel.value);
  if (horisontvinkel < 20) {
    return 0.9;
  }

  // TODO: beregn denne iht. NS-EN ISO 13790.
  return 0.8;
}

/**
 * Henter solskjermingsfaktoren utspring basert på breddegrad, vindusdata og måned.
 *
 * @param {string} breddegrad - Breddegraden (f.eks. "58", "64").
 * @param {Object} vindusData - Objektet som inneholder vindusinformasjon.
 * @param {string} month - Måneden solskjermingsfaktoren beregnes for.
 * @returns {number} - Den beregnede solskjermingsfaktoren utspring.
 */
function getSolskjermingUtspring(breddegrad, vindusData, month) {
  // TODO: få med Solskjermingsfaktoren pga. finner på siden iht NS-EN ISO 13790.
  const sommerMåneder = ["april", "mai", "juni", "juli", "august", "september"];
  const årstid = sommerMåneder.includes(month.navn.toLowerCase()) ? "sommer" : "vinter";
  const orientering = Number(vindusData.orientering.value);
  const overhengsvinkel = Number(vindusData.overhengsvinkel.value);

  // TODO: interpoler mellom breddegrader, orienteringer og overhengsvinkler
  return solskjermingsfaktorOverheng[breddegrad][orientering][overhengsvinkel][årstid];
}

/**
 * Beregner varmetilskudd [kWh] fra internlaster (NS 3031 6.1.1.2.2, formel 33) per måned for en gitt sone
 * NB! Varmetilskudd fra ventilasjon håndteres av en egen funksjon.
 *
 * @param {string} bygningskategori - Bygningskategorien for prosjektet.
 * @param {Object} sortedNodes - Et objekt som inneholder sorterte node-objects som representerer prosjektet.
 * @param {string} key - sone.key for sonen varmetilskuddet skal beregnes for.
 * @param {boolean} normert - Spesifiser om normerte (kontra prosjektspesifikke) verdier skal brukes.
 * @returns {Array} - En array med objekter som inneholder måned og totalt varmetilskudd via vinduer for den måneden, i kWh.
 */
function getVarmetilskuddInternlast(bygningskategori, sortedNodes, key, normert = true) {
  const internlastArray = sortedNodes.internlast.filter((internlast) => internlast.parent === key);
  if (!internlastArray.length) return getEmptyReturnArray();

  const sone = sortedNodes.sone.find((sone) => sone.key === key);
  const oppvarmetBRA = Number(sone.data.oppvarmetBRA.value);
  const bygningsdata = bygningskategorier.find(
    (item) => item.kategori.toLowerCase() === bygningskategori
  );
  const normerteTilskudd = bygningsdata.internlaster.varmetilskudd;

  // NB! Jeg bruker normerte tall for energi, ikke effekt => enhet blir [kWh], ikke [W].
  return månedsdata.map((month) => {
    let totalVarmetilskudd = 0; // [kWh]

    if (normert) {
      internlastArray.forEach((item) => {
        const belysningsFaktor = item.belysning.behovsstyrt.value ? 0.8 : 1;

        const spesVarmetilskudd = {}; // [kWh/m2]
        spesVarmetilskudd.belysning = (normerteTilskudd.belysning.energi / 12) * belysningsFaktor;
        spesVarmetilskudd.utstyr = normerteTilskudd.utstyr.energi / 12;
        spesVarmetilskudd.personer = normerteTilskudd.personer.energi / 12;

        for (let key in spesVarmetilskudd) {
          totalVarmetilskudd += spesVarmetilskudd[key] * oppvarmetBRA; // [kWh]
        }
      });
    } else {
      // TODO: Implementer prosjekt-spesifikkt varmetilskudd fra internlastArray
      console.error("Ikke-normerte varmetilskudd er ikke implementert ennå.");
    }
    return {
      måned: month.navn,
      varmetilskudd: totalVarmetilskudd,
    };
  });
}

/**
 * Beregner varmetilskudd [kWh] fra ventilasjonsvifter (NS 3031 6.1.1.2.2, formel 33) per måned for en gitt sone.
 *
 * @param {string} bygningskategori - Bygningskategorien for prosjektet.
 * @param {Object} sortedNodes - Sorterte noder fra prosjektet.
 * @param {string} key - Nøkkelen for sonen.
 * @returns {Array} - En array med objekter som inneholder måned og totalt varmetilskudd via ventilasjon for den måneden.
 */
function getVarmetilskuddVifter(bygningskategori, sortedNodes, key) {
  const ventilasjonsArray = sortedNodes.ventilasjon.filter((item) => item.parent === key);
  if (!ventilasjonsArray.length) return getEmptyReturnArray();

  const bygningsdata = bygningskategorier.find(
    (item) => item.kategori.toLowerCase() === bygningskategori
  );
  console.log("bygningskategorier", bygningskategorier);
  console.log("bygningsdata: ", bygningsdata);

  // Beregn varmetilskudd fra ventilasjonsvifter fordelt på måned
  return månedsdata.map((month) => {
    let totalVarmetilskudd = 0; // [kWh]

    // Inkluder varmetilskudd fra alle ventilasjonsanlegg i sonen
    ventilasjonsArray.forEach((ventilasjonsanlegg) => {
      // Hent data for ventilasjonsanlegget
      const ventData = ventilasjonsanlegg.data;
      const virkningsgrad = Number(ventData.varmevirkningsgrad_on.value);
      const plasseringTV = ventData.plasseringTV.value;
      const luftmengde = Number(ventData.tilluftsMengde_on.value);

      // Beregninger for ventilasjonsanlegget
      const driftstid = getMånedligeDriftstimerVent(ventData, bygningskategori, month);
      const temperaturØkningOverVifte = getTemperaturØkningOverVifte(month, bygningsdata);
      const { spesVarmetapTV, spesVarmetapAV } = getSpesVarmeproduksjonVifter(
        temperaturØkningOverVifte,
        virkningsgrad,
        plasseringTV
      ); // [W/(m3/h)]

      // Modifisert versjon av formel 33 som returnerer toal varmetilførsel [kWh] for sonen per måned
      // Deler på 1000 for å konvertere til kW. Dropper å dele på oppvBRA og henter heller ut totalverdien
      totalVarmetilskudd +=
        (0.33 * luftmengde * (spesVarmetapTV + spesVarmetapAV) * driftstid) / 1000;
    });

    return {
      måned: month.navn,
      varmetilskudd: totalVarmetilskudd,
    };
  });
}

/**
 * Beregner månedlige driftstimer [timer] for ventilasjonsanlegg utifra bygningskategori og måned.
 *
 * @param {Object} ventilasjonsData - Dataobjektet som inneholder informasjon om ventilasjonsanlegget.
 * @param {string} bygningskategori - Bygningskategorien for prosjektet.
 * @param {Object} month - Månedsobjektet som inneholder informasjon om måneden.
 * @returns {number} - Antall driftstimer for ventilasjonsanlegget i løpet av måneden.
 */
function getMånedligeDriftstimerVent(ventilasjonsData, bygningskategori, month) {
  const månedsnavn = month.navn.toLowerCase();
  const timerPerDag = Number(ventilasjonsData.driftstid.value);
  const dagerPerUke = Number(ventilasjonsData.dagerPerUke.value);

  let ukerPerMåned = 0;
  // For skole- og idrettsbygning evalueres varmetilskudd ulikt for feriemåneder
  if (bygningskategori === "skolebygning" || bygningskategori === "idrettsbygning") {
    if (månedsnavn === "juli") {
      ukerPerMåned = 0;
    } else if (månedsnavn === "august" || månedsnavn === "desember") {
      ukerPerMåned = (month.dager - 7) / 7;
    } else {
      ukerPerMåned = month.dager / 7;
    }
    // For andre bygningskategorier er varmetilskudd likt for alle måneder
  } else {
    ukerPerMåned = month.dager / 7;
  }

  return timerPerDag * dagerPerUke * ukerPerMåned;
}

/**
 * Beregner temperaturøkningen over viften [K] for en gitt måned og bygningskategori.
 *
 * @param {Object} month - Månedsdata.
 * @param {Object} bygningsdata - Bygningsdata for den gitte bygningskategorien.
 * @returns {number} - Temperaturøkningen over viften, i K.
 */
function getTemperaturØkningOverVifte(month, bygningsdata) {
  const månedsnavn = month.navn.toLowerCase();

  if (bygningsdata.kategori === "skolebygning" || bygningsdata.kategori === "idrettsbygning") {
    // For skole- og idrettsbygning evalueres varmetilskudd ulikt for feriemåneder
    const feriemåneder = ["juni", "juli", "august", "desember"];
    const lookupKey = feriemåneder.includes(månedsnavn) ? månedsnavn : "default";
    return bygningsdata.veiledendeVerdier.temperaturØkningOverVifte[lookupKey];
  } else {
    // For andre bygningskategorier er varmetilskudd likt for alle måneder
    return bygningsdata.veiledendeVerdier.temperaturØkningOverVifte;
  }
}

/**
 * Beregner spesifikt energitap/varmeproduksjon [W/(m3/h)] for tillufts- og avtrekksvifte.
 *
 * @param {number} temperaturØkningOverVifte - Temperaturøkning over viften.
 * @param {number} virkningsgrad - Virkningsgraden til varmegjenvinneren.
 * @param {string} plasseringTV - Plasseringen av tilluftsviften ift gjenvinneren.
 * @returns {Object} - Spesifikt varmetap for tilluftsvifte (spesVarmetapTV) og avtrekksvifte (spesVarmetapAV).
 */
function getSpesVarmeproduksjonVifter(temperaturØkningOverVifte, virkningsgrad, plasseringTV) {
  const plasseringsFaktorTV = plasseringTV === "før varmegjenvinner" ? 1 - virkningsgrad : 1;
  const spesVarmetapTV = plasseringsFaktorTV * temperaturØkningOverVifte;
  const spesVarmetapAV = temperaturØkningOverVifte * virkningsgrad;

  return { spesVarmetapTV, spesVarmetapAV }; // [W/(m3/h)]
}

/**
 * Beregner Utnyttingsfaktor (andel av varmetilskudd som utnyttes) for en gitt sone.
 *
 * @param {number} varmetilskudd - [kWh] (Q_gn,i).
 * @param {number} varmetap - [kWh] (Q_H,ls,i).
 * @param {number} varmetreghetsFaktor - Dimensjonsløs (a_H).
 * @returns {number} - Dimensjonsløs utnyttelsesfaktor (η_H,i).
 */
function getUtnyttingsfaktor(soneData, varmetilskudd, varmetap) {
  const normalisertVarmekapasitet = Number(soneData.varmekapasitet.value);
  const oppvarmetBRA = Number(soneData.oppvarmetBRA.value);

  const tidskonstant = (normalisertVarmekapasitet * oppvarmetBRA) / varmetap;
  const varmetreghetsFaktor = 1 + tidskonstant / 16;
  const gamma_H_i = varmetilskudd / varmetap;

  if (gamma_H_i < 0) {
    return 1 / gamma_H_i;
  } else if (gamma_H_i === 1) {
    return varmetreghetsFaktor / (varmetreghetsFaktor + 1);
  } else {
    const numerator = 1 - gamma_H_i ** varmetreghetsFaktor;
    const denominator = 1 - gamma_H_i ** (varmetreghetsFaktor + 1);
    return numerator / denominator;
  }
}

export {
  getVarmetilskuddSol,
  getVarmetilskuddInternlast,
  getVarmetilskuddVifter,
  getUtnyttingsfaktor,
};
