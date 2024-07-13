const projectData = {
  type: "project",
  key: "p0",
  userId: "u0",
  label: "",
  dateCreated: 0,
  soner: [],
};

const SoneInput = {
  type: "sone",
  id: "s0",
  projectId: "p0",
  userId: "u0",
  label: "",
  dateCreated: 0,
  dateUpdated: 0,
  fasader: [],
  tak: [],
  gulv: [],
};

const fasadeData = {
  type: "fasade",
  id: "f0",
  soneId: "s0",
  userId: "u0",
  label: "",
  dateCreated: 0,
  dateUpdated: 0,
  areal: 0,
  varmepakasitet: {
    navn: "",
    C: 0,
    Beskrivelse: "",
  },
  Uverdi: 0,
  himmelretning: 0,
  vinduer: [],
};

const takData = {
  type: "tak",
  id: "f0",
  soneId: "s0",
  userId: "u0",
  label: "",
  dateCreated: 0,
  dateUpdated: 0,
  areal: 0,
  varmepakasitet: {
    navn: "",
    C: 0,
    Beskrivelse: "",
  },
  Uverdi: 0,
  himmelretning: 0,
  vinkel: 0,
  vinduer: [],
};

const gulvData = {
  type: "gulv",
  id: "f0",
  soneId: "s0",
  userId: "u0",
  label: "",
  dateCreated: 0,
  dateUpdated: 0,
  areal: 0,
  varmepakasitet: {
    navn: "",
    C: 0,
    Beskrivelse: "",
  },
  Uverdi: 0,
  omkrets: 0,
  kantisolering: 0,
  vinduer: [],
};

const vindusData = {
  type: "vindu",
  id: "v0",
  id: "f0",
  soneId: "s0",
  userId: "u0",
  parentId: 0,
  soneId: 0,
  userId: 0,
  name: "",
  dateCreated: 0,
  dateUpdated: 0,
  bredde: 0,
  høyde: 0,
  Uverdi: 0,
  gverdi: 0,
  andelKarm: 0,
  solskjerming: 0,
};

const projectSlice = createSlice({
  name: "project",
  initialState: {
    soner: {},
    fasader: {},
    gulv: {},
    tak: {},
    vinduer: {},
  },
  reducers: {
    // ... your reducers here
  },
});

//Lookup table for Tree-menu icons and depths
const treeMenuConstants = {
  prosject: { depth: 0, icon: "pi pi-fw pi-building" },
  sone: { depth: 1, icon: "pi pi-fw pi-box" },
  fasade: { depth: 2, icon: "pi pi-fw pi-home" },
  tak: { depth: 2, icon: "pi pi-fw pi-map" },
  gulv: { depth: 2, icon: "pi pi-fw pi-stop" },
  vindu: { depth: 3, icon: "pi pi-fw pi-microsoft" },
};

const SoneInputFull = {
  energikilder: {
    andeler: [
      { id: "andelEl", label: "Elektrisk", value: "100" },
      { id: "andelVarme", label: "Rom", value: "100" },
      { id: "andelVann", label: "Tappevann", value: "100" },
      { id: "andelVentVarme", label: "Varmebatteri", value: "100" },
      { id: "andelVentKjol", label: "Kjølebatteri", value: "100" },
    ],
    virkningsgrader: [
      { id: "virkningsgradEl", label: "Elektrisk", value: "95" },
      { id: "virkningsgradVarme", label: "Rom", value: "95" },
      { id: "virkningsgradVann", label: "Tappevann", value: "95" },
      { id: "virkningsgradVentVarme", label: "Varmebatteri", value: "95" },
      { id: "virkningsgradVentKjol", label: "Kjølebatteri", value: "95" },
    ],
  },
  vannbårenOppvarming: false,

  effektVarmeKjøl: {
    effektRomVarme: { value: "", documentation: "" },
    effektVentKjøl: { value: "", documentation: "" },
    settpunktSommer: { value: "", documentation: "" },
    settpunktVinter: { value: "", documentation: "" },
    pumpeEffektSpesifikk: { value: "", documentation: "" },
  },
  fasader: [],
  tak: [],
  gulv: [],
};

internlaster = {
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
};
const driftstider = {
  lysVarmeUtstyr: { timer: 16, døgn: 7, uker: 52 },
  ventilasjon: { timer: 24, døgn: 7, uker: 52 },
  personer: { timer: 24, døgn: 7, uker: 52 },
};
const setpunktTemp = {
  varmeDriftstiden: 21,
  varmeUtenforDriftstiden: 19,
};
const luftmengderKontroll = {
  driftstiden: 1.2,
  utenforDriftstiden: 1.2,
};
const veiledendeVerdier = {
  spesifikkLuftmengde: 1.2,
  spesifikkVifteEffekt: 2.5,
  temperaturØkningOverVifte: 0.93,
  temperaturOppvarming: 20.3,
};
