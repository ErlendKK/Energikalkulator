const vaerData = [
  {
    måned: "Januar",
    temperatur: -3.7,
    relativLuftfuktighet: 88.2,
    vindhastighet: 1.8,
  },
  {
    måned: "Februar",
    temperatur: -4.8,
    relativLuftfuktighet: 85.9,
    vindhastighet: 1.5,
  },
  {
    måned: "Mars",
    temperatur: -0.5,
    relativLuftfuktighet: 77.4,
    vindhastighet: 1.8,
  },
  {
    måned: "April",
    temperatur: 4.8,
    relativLuftfuktighet: 64.6,
    vindhastighet: 2.6,
  },
  {
    måned: "Mai",
    temperatur: 11.7,
    relativLuftfuktighet: 58.6,
    vindhastighet: 2.6,
  },
  {
    måned: "Juni",
    temperatur: 16.5,
    relativLuftfuktighet: 57.8,
    vindhastighet: 2.6,
  },
  {
    måned: "Juli",
    temperatur: 17.5,
    relativLuftfuktighet: 63.0,
    vindhastighet: 2.3,
  },
  {
    måned: "August",
    temperatur: 16.6,
    relativLuftfuktighet: 64.6,
    vindhastighet: 2.6,
  },
  {
    måned: "September",
    temperatur: 11.5,
    relativLuftfuktighet: 69.7,
    vindhastighet: 2.7,
  },
  {
    måned: "Oktober",
    temperatur: 6.4,
    relativLuftfuktighet: 77.5,
    vindhastighet: 2.2,
  },
  {
    måned: "November",
    temperatur: 0.6,
    relativLuftfuktighet: 82.7,
    vindhastighet: 2.0,
  },
  {
    måned: "Desember",
    temperatur: -2.5,
    relativLuftfuktighet: 85.0,
    vindhastighet: 1.9,
  },
  {
    måned: "År",
    temperatur: 6.3,
    relativLuftfuktighet: 72.8,
    vindhastighet: 2.2,
  },
];

const innstraaling = [
  {
    orient: "S",
    helning: "90°",
    Januar: 28,
    Februar: 61,
    Mars: 106,
    April: 135,
    Mai: 134,
    Juni: 150,
    Juli: 140,
    August: 142,
    September: 113,
    Oktober: 70,
    November: 44,
    Desember: 28,
  },
  {
    orient: "Ø/V",
    helning: "90°",
    Januar: 11,
    Februar: 32,
    Mars: 55,
    April: 112,
    Mai: 124,
    Juni: 166,
    Juli: 142,
    August: 109,
    September: 66,
    Oktober: 37,
    November: 18,
    Desember: 9,
  },
  {
    orient: "N",
    helning: "90°",
    Januar: 6,
    Februar: 17,
    Mars: 25,
    April: 50,
    Mai: 75,
    Juni: 98,
    Juli: 83,
    August: 54,
    September: 36,
    Oktober: 17,
    November: 9,
    Desember: 3,
  },
  {
    orient: "S",
    helning: "60°",
    Januar: 28,
    Februar: 67,
    Mars: 127,
    April: 177,
    Mai: 193,
    Juni: 225,
    Juli: 205,
    August: 178,
    September: 105,
    Oktober: 78,
    November: 45,
    Desember: 27,
  },
  {
    orient: "Ø/V",
    helning: "60°",
    Januar: 13,
    Februar: 39,
    Mars: 76,
    April: 151,
    Mai: 169,
    Juni: 223,
    Juli: 196,
    August: 144,
    September: 88,
    Oktober: 46,
    November: 20,
    Desember: 5,
  },
  {
    orient: "N",
    helning: "60°",
    Januar: 8,
    Februar: 23,
    Mars: 40,
    April: 70,
    Mai: 102,
    Juni: 135,
    Juli: 115,
    August: 84,
    September: 47,
    Oktober: 21,
    November: 10,
    Desember: 4,
  },
  {
    orient: "S",
    helning: "30°",
    Januar: 21,
    Februar: 56,
    Mars: 115,
    April: 176,
    Mai: 205,
    Juni: 249,
    Juli: 222,
    August: 193,
    September: 122,
    Oktober: 66,
    November: 34,
    Desember: 19,
  },
  {
    orient: "Ø/V",
    helning: "30°",
    Januar: 12,
    Februar: 37,
    Mars: 80,
    April: 154,
    Mai: 183,
    Juni: 239,
    Juli: 209,
    August: 150,
    September: 93,
    Oktober: 45,
    November: 20,
    Desember: 9,
  },
  {
    orient: "N",
    helning: "30°",
    Januar: 8,
    Februar: 23,
    Mars: 42,
    April: 95,
    Mai: 143,
    Juni: 195,
    Juli: 166,
    August: 115,
    September: 57,
    Oktober: 21,
    November: 10,
    Desember: 4,
  },
  {
    orient: "0°",
    helning: "0°",
    Januar: 13,
    Februar: 43,
    Mars: 90,
    April: 153,
    Mai: 198,
    Juni: 249,
    Juli: 219,
    August: 175,
    September: 107,
    Oktober: 45,
    November: 19,
    Desember: 8,
  },
];

export { vaerData, innstraaling };