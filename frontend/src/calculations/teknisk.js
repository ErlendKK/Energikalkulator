import bygningskategorier from "../data/bygningskategorier";
import { getUtnyttingsfaktor } from "./varmetilskudd";
import { round } from "../utils/misc";
import { månedsdata } from "../data/månedsdata";

// TODO: Ferdigstill denne!
export function getEnergibehovKjøling(soneData, varmetap) {
  console.log("soneData: ", soneData);
  const oppvarmetBRA = Number(soneData.oppvarmetBRA.value);
  const normalisertVarmekapasitet = Number(soneData.varmekapasitet.value);

  månedsdata.forEach((month) => {
    const tidskonstant = (normalisertVarmekapasitet * oppvarmetBRA) / varmetap;
  });

  return 0;
}

/**
 *
 * @param {array} varmetap : array av {måned: string, varmetap: number [kWh/mnd]} for en gitt sone
 * @param {array} varmetilskudd : array av {måned: string, varmetap: number [kWh/mnd]} for en gitt sone
 * @returns {number} - årlig energibehov for romoppvarming [kWh] rundet av til nærmeste heltall
 */
export function getEnergibehovRomoppvarming(soneData, varmetap, varmetilskudd) {
  let energibehov = 0;

  for (let i = 0; i < 12; i++) {
    const varmetilskuddMåned = varmetilskudd[i].varmetilskudd;
    const varmetapMåned = varmetap[i].varmetap;
    const utnyttingsfaktor = getUtnyttingsfaktor(soneData, varmetilskuddMåned, varmetapMåned);
    energibehov += varmetapMåned - utnyttingsfaktor * varmetilskuddMåned;
  }

  return round(energibehov, 0);
}

export function getEnergibehovInternlaster(sone) {
  const internlastArray = sone.children.filter((child) => child.type === "internlaster");
  const oppvarmetBRA = Number(sone.data.oppvarmetBRA.value);

  const energibehov = {
    belysning: 0,
    utstyr: 0,
    varmtvann: 0,
  };

  if (!internlastArray.lenght) return energibehov;

  internlastArray.forEach((internlaster) => {
    const behovstyingsFaktorBelysning = internlaster.data.isBehovstyrtBelysing.value ? 0.8 : 1;
    energibehov.belysning +=
      Number(internlaster.data.belysning.energi) * oppvarmetBRA * behovstyingsFaktorBelysning;

    energibehov.utstyr += Number(internlaster.data.utstyr.energi) * oppvarmetBRA;
    energibehov.varmtvann += Number(internlaster.data.varmtvann.energi) * oppvarmetBRA;
  });

  return energibehov;
}

export function getEnergibehovPumper(sone, varmebehov, kjølebehov) {
  const energiData = sone.children.find((child) => child.type === "energi");
  if (!energiData) return 0;

  const spesifikkVarmekapasitetVann = 4180; // [J/kgK]
  const densitetVann = 988; // [kg/m3]

  const SPP_varme = Number(energiData.SPP_varme.value); // Spesifikk vifteeffekt oppvarming [kW/(m3/s)]
  const deltaTempTurReturVarme = Number(energiData.deltaTempTurReturVarme.value); // [K]
  const driftstimerPumpeVarme = Number(energiData.driftstimerPumpeVarme.value); // [h]

  const SPP_kjøling = Number(energiData.SPP_kjøling.value); // Spesifikk vifteeffekt kjøling [kW/(m3/s)]
  const deltaTempTurReturKjøling = Number(energiData.deltaTempTurReturKjøling.value); // [K]
  const driftstimerPumpeKjøling = Number(energiData.driftstimerPumpeKjøling.value); // [h]

  const sirkulertVannmengdeVarme = // [l/s]
    varmebehov / (spesifikkVarmekapasitetVann * densitetVann * deltaTempTurReturVarme);
  const sirkulertVannmengdeKjøl = // [l/s]
    kjølebehov / (spesifikkVarmekapasitetVann * densitetVann * deltaTempTurReturKjøling);

  const energibehov = round(
    SPP_varme * sirkulertVannmengdeVarme * driftstimerPumpeVarme +
      SPP_kjøling * sirkulertVannmengdeKjøl * driftstimerPumpeKjøling,
    0
  );

  return energibehov;
}

/**
 * Gets the annual energy consumption for the fans of the ventilasjon system
 *
 * @param {array} soneData - object containing user-input, incl. ventilasjonsobjects and oppvBRA
 * @returns {number} - The calculated annual energy consumption for this ventilasjon system
 */
export function getEnergibehovVent(sone) {
  console.log("sone: ", sone);
  console.log("sone.children: ", sone.children);
  const ventilasjonArray = sone.children.filter((child) => child.type === "ventilasjon");
  if (!ventilasjonArray.length) return 0;

  const oppvBRA = Number(sone.data.oppvarmetBRA.value);
  let energiTilluftsVifte = 0;
  let energiAvtrekksVifte = 0;

  ventilasjonArray.forEach((ventilasjonsanlegg) => {
    const ventilasjonsData = ventilasjonsanlegg.data;

    // i driftstiden
    const tilluftsmengde_on = Number(ventilasjonsData.tilluftsMengde_on.value) * oppvBRA;
    const avtrekksmengde_on = Number(ventilasjonsData.avtrekksMengde_on.value) * oppvBRA;
    const SFP_on = Number(ventilasjonsData.SFP_on.value);

    // utenfor driftstiden
    const tilluftsmengde_red = Number(ventilasjonsData.tilluftsMengde_red.value) * oppvBRA;
    const avtrekksmengde_red = Number(ventilasjonsData.avtrekksMengde_red.value) * oppvBRA;
    const SFP_red = Number(ventilasjonsData.SFP_red.value);

    // antall årlige timer i, og utenfor, driftstiden
    const { tid_on, tid_red } = getÅrligeTimer(ventilasjonsData);

    // Oppdaterer energibruken for vifter
    energiTilluftsVifte +=
      (tilluftsmengde_on * SFP_on * tid_on + tilluftsmengde_red * SFP_red * tid_red) / 3600;

    energiAvtrekksVifte +=
      (avtrekksmengde_on * SFP_on * tid_on + avtrekksmengde_red * SFP_red * tid_red) / 3600;
  });
  return energiTilluftsVifte + energiAvtrekksVifte;
}

/**
 * Beregn antalll årlige timer ventilasjonssystemet er i/ utenfor drift
 *
 * @param {*} ventilasjonsData - object med bruker-input for ventilasjonssystemet
 * @returns {number, number} - tid_on, tid_red; antalll årlige timer i/ utenfor drift
 */
function getÅrligeTimer(ventilasjonsData) {
  const tid_on =
    Number(ventilasjonsData.driftstid.value) +
    Number(ventilasjonsData.dagerPerUke.value) +
    Number(ventilasjonsData.ukerPerÅr.value);

  const tid_red = 24 * 365 - tid_on;
  return { tid_on, tid_red };
}
