import { månedsdata } from "../data/månedsdata";
import { terrengskjermingskoeffisienter } from "../data/terrengskjermingskoeffisienter";
import { grunnforhold } from "../data/grunnforhold";
import { varmetapsfaktorer } from "../data/varmetapsfaktorer";
import { getEmptyReturnArray } from "../utils/misc";

/**
 * Beregner varmetap per måned basert på soneData og varmetapstall.
 *
 * @param {Object} sone - Data for den aktuelle sonen.
 * @param {Object} varmetapstall - Objekt som inneholder varmetapstall [W/K] for ulike bygningsdeler.
 * @returns {Array} - En array med objekter som inneholder månedsnavn og varmetap for måneden.
 */
export function getVarmetapPerMåned(sone, varmetapstall) {
  const varmetapPerMåned = getEmptyReturnArray("varmetap");
  const settpunktOppvarming = Number(sone.data.settpunktOppvarming.value);

  const { varmetapstallGulv, varmetapstallRest } = splitVarmeTapstallPåGulvOgRest(varmetapstall);

  // Beregn månedlig varmetap iht NS3031 6.1.1.1 og legg til i varmetapPerMåned
  månedsdata.forEach((month, idx) => {
    const deltaTemp = getDeltaTempUteInne(settpunktOppvarming, month.navn);
    const normalisertAntallTimer = getNormalisertAntallTimer(month.navn);
    const calculatedVarmetap =
      varmetapstallRest * deltaTemp * normalisertAntallTimer + varmetapstallGulv;

    varmetapPerMåned[idx].varmetap = calculatedVarmetap;
  });

  return varmetapPerMåned;
}

/**
 * Split varmetapstall i en del for gulv (måneds-variabel) og en del for resten (konstanter)
 *
 * @param {Object} varmetapstall - Objekt som inneholder varmetapstall for ulike bygningsdeler.
 * @returns {Object} - varmetapstallGulv, varmetapstallRest: Objekter med varmetappstall per måned
 */
function splitVarmeTapstallPåGulvOgRest(varmetapstall) {
  const varmetapstallGulv = Number(varmetapstall.Gulv || 0);

  const varmetapstallPerType = Object.keys(varmetapstall)
    .filter((key) => key !== "Gulv")
    .reduce((obj, key) => {
      obj[key] = Number(varmetapstall[key] || 0);
      return obj;
    }, {});

  const varmetapstallRest = Object.values(varmetapstallPerType).reduce((acc, val) => acc + val, 0);

  return { varmetapstallGulv, varmetapstallRest };
}

/**
 * Calculates the total heat loss for an array of bygningsdel objects.
 *
 * @param {Array} nodes - Array of bygningsdel objects.
 * @returns {number} - The total heat loss for all members of the bygningsdel.
 */
function getVarmetapstallBygningsdel(nodes) {
  return nodes.reduce(
    (acc, node) => acc + Number(node.data.uVerdi.value) * Number(node.data.areal.value),
    0
  );
}

/**
 * Beregner direkte varmetransmisjonstap til det fri, i W/K, etter NS3031 6.1.1.1.1.
 *
 * @param {Object} sortedNodes - Et objekt som inneholder sorterte bygningsdeler.
 * @param {Array} sortedNodes.fasade - En liste av fasader.
 * @param {Array} sortedNodes.tak - En liste av tak.
 * @param {string} soneKey - Nøkkelen til sonen som skal beregnes.
 * @returns {Object} - Et objekt som inneholder varmetap for fasade, tak, gulv og vindu og kuldebroverdi
 */
export function getVarmetapstallDirekte(sortedNodes, soneKey) {
  const varmetapstall = {};
  // Finn aktuelle sone, fasader og tak
  const fasader = sortedNodes.fasade.filter((f) => f.parent === soneKey);
  const tak = sortedNodes.tak.filter((t) => t.parent === soneKey);
  const vinduerOgDører = sortedNodes.vinduOgDør.filter((t) => t.parent === soneKey);

  // Beregn varmetap for fasader, tak og vindu
  varmetapstall.fasader = getVarmetapstallBygningsdel(fasader);
  varmetapstall.tak = getVarmetapstallBygningsdel(tak);
  varmetapstall.vinduerOgDører = getVarmetapstallBygningsdel(vinduerOgDører);

  // Forenklet beregning varmetap kuldebroer, ref. NS3031 6.1.1.1.1
  const aktivSone = sortedNodes.sone.find((s) => s.key === soneKey);
  const normalisertKuldebroverdi = Number(aktivSone.data.kuldebroverdi.value);
  const oppvBRA = Number(aktivSone.data.oppvarmetBRA.value);
  varmetapstall.kuldebro = oppvBRA * normalisertKuldebroverdi;

  return varmetapstall;
}

/**
 * Finn Varmetappstall for varmetap til uoppvarmede soner, i W/K, beregnet etter NS3031 6.1.1.1.2.
 *
 * @param {Array} nodeArray - Array av sorterte node-objects som representerer prosjektet
 * @param {string} key - sone.key for sonen varmetapstallet skal beregnes for
 * @returns {number} - Varmetappstall mot uoppvarmet sone, i W/K.
 */
export function getVarmetapstallUoppvarmetSone(sortedNodes, key) {
  const skillekonstruksjoner = sortedNodes.skillekonstruksjon.filter((item) => item.parent === key);

  const varmetapstallUoppvarmetSone = skillekonstruksjoner.reduce((acc, konstruksjon) => {
    const uVerdi = Number(konstruksjon.data.uVerdi.value);
    const areal = Number(konstruksjon.data.areal.value);
    const varmetapsFaktor = varmetapsfaktorer[konstruksjon.data.varmetapsFaktor.value];

    const bidragTilVarmetapstall = varmetapsFaktor * areal * uVerdi;
    return acc + bidragTilVarmetapstall;
  }, 0);

  return varmetapstallUoppvarmetSone;
}

/**
 * Finn varmetapstall for varmetap via ventilasjon, i W/K, beregnet etter NS3031 6.1.1.1.4.
 *
 * @param {Array} sortedNodes - Array av sorterte node-objects som representerer prosjektet.
 * @param {string} key - sone.key for sonen varmetapstallet skal beregnes for.
 * @returns {number} - Varmetapstall for ventilasjon, i W/K.
 */
export function getVarmetapstallVentilasjon(sortedNodes, key) {
  const ventilasjonsanlegg = sortedNodes.ventilasjon.filter((item) => item.parent === key);
  if (ventilasjonsanlegg.length === 0) return 0;

  const varmetapstallVent = ventilasjonsanlegg.reduce((acc, anlegg) => {
    // Ekstrakter data fra ventilasjonsanlegg
    const ventilasjonsData = anlegg.data;
    const luftmengde_on = Number(ventilasjonsData.tilluftsMengde_on.value);
    const luftmengde_red = Number(ventilasjonsData.tilluftsMengde_red.value);
    const varmevirkningsgrad_on = Number(ventilasjonsData.varmevirkningsgrad_on.value);
    const varmevirkningsgrad_red = Number(ventilasjonsData.varmevirkningsgrad_red.value);

    // Beregn gjennomsnittlig årlig luftmengde og virkningsgrad
    const { tid_on, tid_red } = getÅrligeTimerIOgUtenforDrift(ventilasjonsData);
    const totalTid = tid_on + tid_red;
    const luftmengdeSnitt = (tid_on * luftmengde_on + tid_red * luftmengde_red) / totalTid;
    const virkningsgradSnitt =
      (varmevirkningsgrad_on * luftmengde_on + varmevirkningsgrad_red * luftmengde_red) / totalTid;

    // Beregn anleggets bidrag til varmetapstallet og legg til i totalen
    const tilleggVarmetapstall = 0.33 * luftmengdeSnitt * (1 - virkningsgradSnitt);
    return acc + tilleggVarmetapstall;
  }, 0);

  return varmetapstallVent;
}

/**
 * Beregner årlige timer i og utenfor drift for ventilasjonsanlegg.
 *
 * @param {Object} ventilasjonsData - Dataobjektet som inneholder informasjon om ventilasjonsanlegget.
 * @returns {Object} - Et objekt som inneholder tid_on og tid_red, som representerer årlige timer i og utenfor drift.
 */
export function getÅrligeTimerIOgUtenforDrift(ventilasjonsData) {
  // Ekstrakter data fra ventilasjonsData
  const timer_on = Number(ventilasjonsData.driftstid.value);
  const dagerPerUke = Number(ventilasjonsData.dagerPerUke.value);
  const ukerPerÅr = Number(ventilasjonsData.ukerPerÅr.value);

  // Beregn og returner tid_on og tid_red
  let tid_on = timer_on * dagerPerUke * ukerPerÅr;
  if (ventilasjonsData.isVAV.value) {
    tid_on *= 0.8;
  }
  const tid_red = 24 * 365 - tid_on;

  return { tid_on, tid_red };
}

/**
 * Infiltrasjonsvarmetap, i W/K, beregnet etter NS3031 6.1.1.1.5.
 *
 * @param {Object} sone - Zone object containing data and children.
 * @returns {number} - The infiltration heat loss in W/K.
 */
export function getVarmetapstallInfiltrasjon(sone) {
  // ekstrakter data fra sone-object
  const soneData = sone.data;
  const oppvBRA = Number(soneData.oppvarmetBRA.value);
  const volum = oppvBRA * Number(soneData.takhoyde.value);
  const lekkasjetall = Number(soneData.lekkasjetall.value);
  const skjermingsklasse = soneData.skjermingsklasse.value;
  const solutsatteFasader = soneData.solutsatteFasader.value;

  // Beregn terrengskjermingskoeffisienter (e og f), ref. NS3031 6.1.1.1.5;
  const { e, f } = terrengskjermingskoeffisienter[skjermingsklasse][solutsatteFasader];

  // Beregn frekvens luftskifter pga infiltrasjon
  const ventilasjonsanleggArray = sone.children.filter((child) => child.type === "ventilasjon");
  const ubalanseTilluft = getUbalanseTilluft(ventilasjonsanleggArray);
  const luftskifte = getLuftskifteInfiltrasjon(e, f, ubalanseTilluft, lekkasjetall, volum);

  return 0.33 * volum * luftskifte;
}

/**
 * Ubalanse i tilluftsmengde og avtrekksmengde.
 *
 * @param {Array} ventilasjonsanleggArray - Array of ventilation system objects.
 * @returns {number} - The imbalance in air supply in relation to the exhaust air.
 */
function getUbalanseTilluft(ventilasjonsanleggArray) {
  // Beregn total tilluftsmengde
  const totalTilluftsmengde = ventilasjonsanleggArray.reduce((acc, ventilasjonsanlegg) => {
    return acc + Number(ventilasjonsanlegg.data.tilluftsMengde_on.value);
  }, 0);

  // Beregn total avtrekksmengde
  const totalAvtrekksmengde = ventilasjonsanleggArray.reduce((acc, ventilasjonsanlegg) => {
    return acc + Number(ventilasjonsanlegg.data.avtrekksMengde_on.value);
  }, 0);

  // Returner ubalansen i luftmengde ift tilluftsmengde
  return totalTilluftsmengde - totalAvtrekksmengde;
}

/**
 * Beregner luftskifte infiltrasjon.
 *
 * @param {number} e_f - Terrain shielding coefficients
 * @param {number} delteLuftmengde - Imbalance in air supply and exhaust air.
 * @param {number} lekkasjetall - Air leakage rate.
 * @param {number} volum - Volume of the zone.
 * @returns {number} - The air change rate due to infiltration.
 */
function getLuftskifteInfiltrasjon(e, f, delteLuftmengde, lekkasjetall, volum) {
  const numerator = lekkasjetall * e;
  const terrengFaktor = f / e;
  const denumerator = 1 + terrengFaktor * (delteLuftmengde / (lekkasjetall * volum)) ** 2;

  return numerator / denumerator;
}

/**
 * Beregner temperaturøkningen for en gitt måned.
 *
 * @param {number} settpunkt - Setpunkt-temperaturen.
 * @param {string} month - Måneden for hvilken temperaturøkningen skal beregnes.
 * @returns {number} - Temperaturøkningen for den gitte måneden.
 * @throws {Error} - Hvis måneden ikke finnes i dataene er det en feil i koden
 */
export function getDeltaTempUteInne(settpunkt, month) {
  const targetMonth = månedsdata.find((item) => item.navn.toLowerCase() === month.toLowerCase());
  if (!targetMonth) {
    console.error(`Month not found in data: `, month);
  }
  return settpunkt - targetMonth.temperatur;
}

/**
 * Henter normalisert antall timer (delt på 1000) for en gitt måned.
 *
 * @param {string} month - Måneden for hvilken antall timer skal hentes.
 * @returns {number} - Normalisert antall timer for den gitte måneden.
 * @throws {Error} - Hvis måneden ikke finnes i dataene er det en feil i koden.
 */
export function getNormalisertAntallTimer(month) {
  const targetMonth = månedsdata.find((item) => item.navn.toLowerCase() === month.toLowerCase());
  if (!targetMonth) {
    console.error(`Month not found in data: `, month);
    return 0;
  }
  // delt på 1 000 for omregning til kWh, ref. NS3031 6.1.1.1
  return targetMonth.timer / 1000;
}

/**
 * TODO: Ferdigstill denne
 */
export function getVarmetapstallMotGrund(sortedNodes, key) {
  const gulvArray = sortedNodes.gulv.filter((item) => item.parent === key);
  if (!gulvArray.length) return 0;

  const varmetapstallMotGrund = gulvArray.reduce((acc, gulv) => {
    // Ekstrakter data fra gulv-object
    const gulvData = gulv.data;
    const areal = Number(gulvData.areal.value);
    const omkrets = Number(gulvData.omkrets.value);
    const uVerdi = Number(gulvData.uVerdi.value);
    const tykkelseGrunnmur = Number(gulvData.tykkelseGrunnmur.value);

    // Beregninger iht formler i 6.1.1.1.3
    const Bprime = areal / (0.5 * omkrets); // Karakteristisk Dimensjon i meter
    const { varmekonduktivitet } = grunnforhold[gulvData.grundForhold.value]; // Grundens varmekonduktivitet i W/mK
    const oppfyllingshøyde = 0; // for gulv på grunn js NS 3031 6.1.1.1.3
    const ekvivalentTykkelse = tykkelseGrunnmur + varmekonduktivitet / uVerdi;
    const U_g = getEkvStasjUverdi(Bprime, ekvivalentTykkelse, oppfyllingshøyde, varmekonduktivitet);

    // Beregn bidrag til varmetapstall og legg til i summen
    const varmetapstall = !gulvData.isKantisolasjon && !gulvData.isKjeller ? U_g * areal : 0; //TODO: erstatt 0 med likning (18)
    return acc + varmetapstall;
  });

  return varmetapstallMotGrund;
}

/**
 * TODO: Ferdigstill denne
 */
export function getVarmetapMotGrund(sortedNodes, soneKey, month) {
  // NB! TODO: Implementer disse
  const isKjeller = false;
  const isKantisolasjon = false;
  const kantisolasjonTykkelse = 0;
  const kantisolasjonType = null; // 'vertikal' / 'horisontal'
  const KantisolasjonUverdi = 0;
  // NB! TODO: Implementer disse

  // Finn aktuelle sone og gulv, returner om sonen ikke har gulv
  const aktivSone = sortedNodes.sone.find((s) => s.key === soneKey);
  const gulvArray = sortedNodes.gulv.filter((g) => g.parent === soneKey);
  if (!gulvArray.length) {
    return { varmetapMotGrund: 0, H_g: 0 };
  }

  // Felles data for alle gulv-elementer
  const i = månedsdata.findindex((item) => item.navn.toLowerCase() === month.toLowerCase()) + 1; // Månedsnummer (1-indeksert)
  const t_i = getNormalisertAntallTimer(month); //antall timer i måneden delt på 1 000 for omregning til kWh;
  const Omega_bar_i = Number(aktivSone.data.settpunktOppvarming.value); //årsmiddeltemperatur Inne, i °C;
  const Omega_bar_e = getÅrsmiddeltemperaturUte(); //årsmiddeltemperatur Ute, i °C;
  const Omega_tilda_e = getAmplitudevariasjon(); //amplitudevariasjonen omkring årsmiddeltemperaturen ute, i K;

  // TODO: Loop over alle gulv-elementer
  const gulvData = gulvArray[0].data;
  const areal = Number(gulvData.areal.value);
  const omkrets = Number(gulvData.omkrets.value);
  const uVerdi = Number(gulvData.uVerdi.value);
  const tykkelseGrunnmur = Number(gulvData.tykkelseGrunnmur.value);
  const { varmekonduktivitet, volumetriskVarmekapasitet, nedtrengingsdybde } =
    grunnforhold[gulvData.grundForhold.value];
  const oppfyllingshøyde = isKjeller ? Number(gulvData.oppfyllingshoyde.value) : 0;

  const beta = isKjeller ? 1 : 2; // faseforskjellen mellom utetemperatur og varmetap.

  const Bprime = areal / (0.5 * omkrets); // Karakteristisk Dimensjon
  const dprime = kantisolasjonTykkelse * (varmekonduktivitet * KantisolasjonUverdi - 1); //tillegg i ekvivalent tykkelse for kantisolasjon

  const ekvivalentTykkelse = tykkelseGrunnmur + varmekonduktivitet / uVerdi;

  // U_g: Ekvivalent stasjonær varmegjennomgangskoeffisient (U-verdi) for gulv mot grunnen inkludert varmemotstand i grunnen
  const U_g = getEkvStasjUverdi(Bprime, ekvivalentTykkelse, oppfyllingshøyde, varmekonduktivitet);

  // H_g stasjonær varmetransportkoeffisient, i W/K
  //   TODO: ta med varmegjennomgangskoeffisient for kantisolasjon: likning (18)
  const H_g = !isKantisolasjon && !isKjeller ? U_g * areal : 0; //TODO: erstatt 0 med likning (18)
  // Dprime: nomalisert dybde (vertikal) eller bredde (horisontal) på kantisolasjonen, i meter
  const Dprime = getNormalisertKantisolasjon(kantisolasjonTykkelse, kantisolasjonType);

  // H_pe: dynamisk varmetransportkoeffisient, i W/K.
  const expFactor = Math.exp(-Dprime / nedtrengingsdybde);
  const H_pe =
    0.37 *
    varmekonduktivitet *
    omkrets *
    ((1 - expFactor) * Math.log(nedtrengingsdybde / (ekvivalentTykkelse + dprime) + 1) +
      expFactor * Math.log(nedtrengingsdybde / ekvivalentTykkelse + 1));

  // varmetap mot grunnen
  const varmetapMotGrund =
    t_i *
    (H_g * (Omega_bar_i - Omega_bar_e) +
      H_pe * Omega_tilda_e * Math.cos(2 * Math.PI * ((i - 1 - beta) / 12)));

  return { varmetapMotGrund, H_g };
}

/**
 * Henter normalisert kantisolasjon basert på tykkelse og type.
 *
 * @param {number} tykkelse - Tykkelsen på isolasjonen.
 * @param {string} type - Typen isolasjon (f.eks. "horisontal").
 * @returns {number} - Den normaliserte kantisolasjonen.
 */
function getNormalisertKantisolasjon(tykkelse, type) {
  let D;
  if (!tykkelse) {
    D = 0;
  } else if (type === "horisontal") {
    D = tykkelse;
  } else {
    D = 2 * tykkelse;
  }
  return D;
}

/**
 * Beregner stasjonær varmetransportkoeffisient, i W/K.
 *
 * @param {number} Bprime - B' verdien.
 * @param {number} ekvivalentTykkelse - Ekvivalent tykkelse.
 * @param {number} oppfyllingshøyde - Oppfyllingshøyde.
 * @param {number} varmekonduktivitet - Varmekonduktivitet.
 * @returns {number} - Den stasjonære varmetransportkoeffisienten.
 */
function getEkvStasjUverdi(Bprime, ekvivalentTykkelse, oppfyllingshøyde, varmekonduktivitet) {
  if (Bprime > ekvivalentTykkelse * 0.5 * oppfyllingshøyde) {
    return (
      ((2 * varmekonduktivitet) /
        (Math.PI * Bprime + ekvivalentTykkelse + 0.5 * oppfyllingshøyde)) *
      Math.log((Math.PI * Bprime) / (ekvivalentTykkelse + 0.5 * oppfyllingshøyde + 1))
    );
  } else {
    return varmekonduktivitet / (0.457 * Bprime + ekvivalentTykkelse + 0.5 * oppfyllingshøyde);
  }
}

/**
 * Beregner den årlige gjennomsnittstemperaturen utendørs.
 *
 * @returns {number} - Den årlige gjennomsnittstemperaturen utendørs.
 */
function getÅrsmiddeltemperaturUte() {
  return månedsdata.reduce((acc, item) => acc + item.temperatur, 0) / 12;
}

/**
 * Beregner amplitudevariasjonen omkring årsmiddeltemperaturen.
 *
 * @returns {number} - Amplitudevariasjonen omkring årsmiddeltemperaturen.
 */
function getAmplitudevariasjon() {
  const årsmiddeltemperatur = getÅrsmiddeltemperaturUte();
  const avvik = månedsdata.map((item) => Math.abs(item.temperatur - årsmiddeltemperatur));
  const amplitudevariasjon = Math.max(...avvik);
  return amplitudevariasjon;
}

/**
 * UNDER ARBEID
 */

// /**
//  * Beregner gjennomsnittlig månedlig luftmengde.
//  *
//  * @param {Object} ventilasjonsData - Ventilation data object.
//  * @param {string} month - The month for which to calculate the average monthly air volume.
//  * @returns {number} - The average monthly air volume.
//  */
// function getMånedligLuftmengde(ventilasjonsData, month) {
//   const timer_on = Number(ventilasjonsData.driftstid.value);
//   const månedsData = månedsdata.find((item) => item.navn.toLowerCase() === month.toLowerCase());
//   const timerTotalt = månedsData.timer;
//   const timer_red = timerTotalt - timer_on;

//   const luftmengde_on = Number(ventilasjonsData.tilluftsMengde_on.value);
//   const luftmengde_red = Number(ventilasjonsData.tilluftsMengde_red.value);

//   let luftmengdeTotalt = timer_on * luftmengde_on + timer_red * luftmengde_red;

//   return luftmengdeTotalt / timerTotalt;
// }

// export function getVentilasjonsvarmetap(sortedNodes, key) {
//   const ventilasjonsanlegg = sortedNodes.ventilasjon.filter((item) => item.parent === key);

//   const varmetapstallVent = ventilasjonsanlegg.reduce((acc, anlegg) => {
//     const anleggData = anlegg.data;
//     const varmevirkningsgrad = Number(ventilasjonsData.varmevirkningsgrad.value);

//     // Beregn gjennomsntilig månedlig luftmengde
//     let luftmengde = getMånedligLuftmengde(anleggData, month);
//     if (anleggData.isVAV.value) {
//       luftmengde = luftmengde * 0.8;
//     }
//     const ventilasjonsvarmetap = 0.33 * luftmengde * (1 - varmevirkningsgrad);

//     acc += ventilasjonsvarmetap;
//     return acc;
//   }, 0);

//   return ventilasjonsvarmetap;
// }
