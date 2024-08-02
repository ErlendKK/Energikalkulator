import { månedsdata } from "../data/månedsdata";

/**
 * Updates the value of a nested property within an object.
 * The function navigates through the object using the provided path,
 * and updates the value of the specified nested property by adding the given value to it.
 *
 * @param {Object} obj - The object containing the nested property to be updated.
 * @param {string} path - The path to the nested property, with keys separated by dots.
 * @param {number} value - The value to be added to the nested property's current value.
 *
 * @example
 * const obj = {
 *   total: {
 *     Romoppvarming: { code: "1", value: 0 },
 *     Varmtvann: { code: "2", value: 0 },
 *     // other properties...
 *   }
 * };
 * updateNestedProperty(obj, 'total.Romoppvarming', 100);
 * // obj.total.Romoppvarming.value will be updated to 100
 */
export const updateNestedProperty = (obj, path, value) => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const lastObj = keys.reduce((acc, key) => (acc[key] = acc[key] || {}), obj);
  lastObj[lastKey] = { ...lastObj[lastKey], value: lastObj[lastKey].value + value };
};

/**
 * Returnerer en array med { måned, type } hvor varmetilskudd er satt til 0.
 * Brukes som guard clause for evt. nodetyper som mangler.
 *
 * @param {string} type - Typen som skal settes til 0. Standardverdi er "varmetilskudd".
 * @returns {Array} - En array av { måned: 'string', type: 0 }
 */
export function getEmptyReturnArray(type = "varmetilskudd") {
  return månedsdata.map((month) => ({
    måned: month.navn,
    [type]: 0,
  }));
}

/**
 * Finds elements that are present in one array but not the other using sets for better performance.
 * @param {Array} arr1 - The first array.
 * @param {Array} arr2 - The second array.
 * @returns {Array} - An array of elements that are present in one array but not the other.
 */
const getNewElements = (oldArray, newArray) => {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const uniqueToArr1 = arr1.filter((element) => !set2.has(element));
  const uniqueToArr2 = arr2.filter((element) => !set1.has(element));

  return [...uniqueToArr1, ...uniqueToArr2];
};

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param {number} num - The number to be rounded.
 * @param {number} [i=2] - The number of decimal places to round to. Default is 2.
 * @returns {number} - The rounded number.
 */
export function round(num, i = 2) {
  return parseFloat(num.toFixed(i));
}

export function getInitalResults(scope = "all") {
  const initialResults = {
    // Initialize yearly data
    yearly: {
      energibehovInternlaster: 0,
      energibehovKjøling: 0,
      energibehovOppvarming: 0,
      energibehovPumper: 0,
      energibehovVent: 0,
      varmetapTotalt: 0,
      varmetapstall: {
        Gulv: 0,
        Infiltrasjon: 0,
        Kuldebroer: 0,
        Ventilasjon: 0,
        VinduerOgDører: 0,
        Yttertak: 0,
        Yttervegger: 0,
      },
    },
    monthly: [],
  };

  // Initialize monthly data
  månedsdata.forEach((month) => {
    initialResults.monthly.push({
      month: month.navn,
      energibehovInternlaster: 0,
      energibehovKjøling: 0,
      energibehovOppvarming: 0,
      energibehovPumper: 0,
      energibehovVent: 0,
      varmetapTotalt: 0,
    });
  });

  return scope === "all" ? initialResults : initialResults[scope];
}

/**
 * Aggregates the yearly and monthly data for each soneKey included in the array of selectedZones.
 *
 * @param {Object} resultsAll - The data object containing soneKey and soneData.
 * @param {Array} selectedZones - The array of selected sones
 * @returns {Object} - An object containing aggregated yearly and monthly data.
 */
export function aggregateData(resultsAll, selectedZones) {
  const aggregatedData = getInitalResults();
  console.log("selectedZones", selectedZones);
  console.log("resultsAll", resultsAll);

  selectedZones.forEach((sone) => {
    const zoneData = resultsAll[sone.key];
    console.log("zoneData: ", zoneData);

    // Aggregate yearly data
    if (zoneData.yearly) {
      aggregatedData.yearly.energibehovInternlaster += zoneData.yearly.energibehovInternlaster || 0;
      aggregatedData.yearly.energibehovKjøling += zoneData.yearly.energibehovKjøling || 0;
      aggregatedData.yearly.energibehovOppvarming += zoneData.yearly.energibehovOppvarming || 0;
      aggregatedData.yearly.energibehovPumper += zoneData.yearly.energibehovPumper || 0;
      aggregatedData.yearly.energibehovVent += zoneData.yearly.energibehovVent || 0;
      aggregatedData.yearly.varmetapTotalt += zoneData.yearly.varmetapTotalt || 0;

      Object.keys(zoneData.yearly.varmetapstall).forEach((key) => {
        aggregatedData.yearly.varmetapstall[key] += zoneData.yearly.varmetapstall[key] || 0;
      });
    }

    // Aggregate monthly data
    if (zoneData.monthly) {
      zoneData.monthly.forEach((monthData, index) => {
        aggregatedData.monthly[index].month = monthData.month;
        aggregatedData.monthly[index].energibehovInternlaster +=
          monthData.energibehovInternlaster || 0;
        aggregatedData.monthly[index].energibehovKjøling += monthData.energibehovKjøling || 0;
        aggregatedData.monthly[index].energibehovOppvarming += monthData.energibehovOppvarming || 0;
        aggregatedData.monthly[index].energibehovPumper += monthData.energibehovPumper || 0;
        aggregatedData.monthly[index].energibehovVent += monthData.energibehovVent || 0;
        aggregatedData.monthly[index].varmetapTotalt += monthData.varmetapTotalt || 0;
      });
    }
  });

  return aggregatedData;
}
