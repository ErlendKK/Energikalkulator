import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  key: "0",
  depth: 0,
  type: "project",
  label: "Prosjekt 1",
  data: {
    navn: { value: "Prosjekt 1", documentation: "" },
    bygningskategori: { value: "barnehage", documentation: "blabla2" },
    breddegrad: { value: "58", documentation: "ingen kommentar" },
  },
  icon: "pi pi-fw pi-building",
  parent: null,
  children: [
    {
      key: "sone1",
      depth: 1,
      type: "sone",
      label: "Sone 1",
      data: {
        navn: { value: "Sone 1", documentation: "blablabla" },
        varmekapasitet: { value: "20", documentation: "01" },
        lekkasjetall: { value: "0.6", documentation: "12" },
        kuldebroverdi: { value: "1", documentation: "23" },
        oppvarmetBRA: { value: "500", documentation: "34" },
        takhoyde: { value: "3", documentation: "45" },
        settpunktOppvarming: { value: "21", documentation: "" },
        settpunktKjøling: { value: "22", documentation: "" },
        skjermingsklasse: { value: "IngenSkjerming", documentation: "" },
        solutsatteFasader: { value: "enUtsattFasade", documentation: "" },
      },
      icon: "pi pi-fw pi-box",
      parent: "0",
      children: [
        {
          key: "36-01",
          depth: 2,
          type: "ventilasjon",
          label: "Anlegg 36-01",
          data: {
            // Generelt
            navn: { value: "Anlegg 36-01", documentation: "" },
            effektVarmebatteri: { value: "50", documentation: "gg" },
            effektKjolebatteri: { value: "50", documentation: "gg" },
            isVAV: { value: false, documentation: "" },
            plasseringTV: { value: "etter varmegjenvinner", documentation: "" },
            // I driftstiden (on)
            tilluftsMengde_on: { value: "10", documentation: "gg" },
            avtrekksMengde_on: { value: "10", documentation: "gg" },
            SFP_on: { value: "2", documentation: "gg" },
            varmevirkningsgrad_on: { value: "0.8", documentation: "gg" },
            setpunkt_on: { value: "19", documentation: "" },
            // Utenfor driftstiden (red)
            tilluftsMengde_red: { value: "2", documentation: "gg" },
            avtrekksMengde_red: { value: "2", documentation: "gg" },
            SFP_red: { value: "1", documentation: "gg" },
            varmevirkningsgrad_red: { value: "0.82", documentation: "gg" },
            setpunkt_red: { value: "19", documentation: "" },
            // Varighet Driftstiden
            driftstid: { value: "10", documentation: "gg" },
            dagerPerUke: { value: "7", documentation: "gg" },
            ukerPerÅr: { value: "52", documentation: "gg" },
          },
          icon: "pi pi-fw pi-play-circle",
          parent: "sone1",
          children: [],
        },
        {
          key: "0-33",
          depth: 2,
          type: "fasade",
          label: "Fasade 1",
          data: {
            navn: { value: "Fasade 1", documentation: "" },
            areal: { value: "55", documentation: "gg" },
            uVerdi: { value: "0.8", documentation: "gg" },
            himmelretning: { value: "60", documentation: "gg" },
          },
          icon: "pi pi-fw pi-home",
          parent: "sone1",
          children: [],
        },
        {
          key: "0-34",
          depth: 2,
          type: "fasade",
          label: "Fasade 2",
          data: {
            navn: { value: "Fasade 2", documentation: "" },
            areal: { value: "55", documentation: "gg" },
            uVerdi: { value: "21", documentation: "gg" },
            himmelretning: { value: "60", documentation: "gg" },
          },
          icon: "pi pi-fw pi-home",
          parent: "sone1",
          children: [],
        },
      ],
    },
    {
      key: "sone2",
      depth: 1,
      type: "sone",
      label: "Sone 2",
      data: {
        navn: { value: "Sone 2", documentation: "blablabla" },
        varmekapasitet: { value: "66", documentation: "01" },
        lekkasjetall: { value: "12", documentation: "12" },
        kuldebroverdi: { value: "21", documentation: "23" },
        oppvarmetBRA: { value: "31", documentation: "34" },
        takhoyde: { value: "41", documentation: "45" },
        settpunktOppvarming: { value: "22", documentation: "" },
        settpunktKjøling: { value: "22", documentation: "" },
        skjermingsklasse: { value: "IngenSkjerming", documentation: "" },
        solutsatteFasader: { value: "enUtsattFasade", documentation: "" },
      },
      icon: "pi pi-fw pi-box",
      parent: "0",
      children: [
        {
          key: "36-02",
          depth: 2,
          type: "ventilasjon",
          label: "Anlegg 36-02",
          data: {
            // Generelt
            navn: { value: "Anlegg 36-02", documentation: "" },
            effektVarmebatteri: { value: "50", documentation: "gg" },
            effektKjolebatteri: { value: "50", documentation: "gg" },
            isVAV: { value: false, documentation: "" },
            plasseringTV: { value: "før varmegjenvinner", documentation: "" },
            // I driftstiden (on)
            tilluftsMengde_on: { value: "10", documentation: "gg" },
            avtrekksMengde_on: { value: "10", documentation: "gg" },
            SFP_on: { value: "2", documentation: "gg" },
            varmevirkningsgrad_on: { value: "0.8", documentation: "gg" },
            setpunkt_on: { value: "19", documentation: "" },
            // Utenfor driftstiden (red)
            tilluftsMengde_red: { value: "2", documentation: "gg" },
            avtrekksMengde_red: { value: "2", documentation: "gg" },
            SFP_red: { value: "1", documentation: "gg" },
            varmevirkningsgrad_red: { value: "0.82", documentation: "gg" },
            setpunkt_red: { value: "19", documentation: "" },
            // Varighet Driftstiden
            driftstid: { value: "10", documentation: "gg" },
            dagerPerUke: { value: "21", documentation: "gg" },
            ukerPerÅr: { value: "52", documentation: "gg" },
          },
          icon: "pi pi-fw pi-play-circle",
          parent: "sone2",
          children: [],
        },
      ],
    },
  ],
};

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    replaceProject: (state, action) => {
      return action.payload;
    },
    deleteNode: (state, action) => {
      // nodesToAdd is an array of node-objects
      const keysToRemove = action.payload;

      const removeNodes = (nodes) =>
        nodes.filter((node) => {
          if (keysToRemove[node.key]) {
            return false;
          }
          node.children = removeNodes(node.children);
          return true;
        });

      state.children = removeNodes(state.children);
    },
    addNode: (state, action) => {
      // targetKey is the key of the parent of the added nodes
      // nodesToAdd is an array of node-objects
      const { targetKey, nodesToAdd } = action.payload;
      // nodesToAdd[0].className = "p-highlight";

      const addsToTarget = (nodes) => {
        for (const node of nodes) {
          if (node.key === targetKey) {
            node.children.push(...nodesToAdd);
            return;
          }
          addsToTarget(node.children);
        }
      };

      if (state.key === targetKey) {
        state.children.push(...nodesToAdd);
      } else {
        addsToTarget(state.children);
      }
    },
    updateNode: (state, action) => {
      const targetNode = action.payload;
      console.log("updateNode called for node: ", targetNode);

      const updateNode = (nodes) =>
        nodes.map((node) => {
          if (node.key === targetNode.key) {
            return targetNode;
          }
          node.children = updateNode(node.children);
          return node;
        });

      state.children = updateNode(state.children);
    },
  },
});

/**
 * Selector to find a node by its key.
 * @param {Object} state - The Redux state.
 * @param {string} id - The key of the node to find.
 * @returns {Object|null} - The found node object or null if not found.
 */
const selectNodeByKey = createSelector(
  (state) => state.project,
  (_, id) => id,
  (project, id) => {
    if (!id) return null;
    if (project.key === id) return project;

    // Initialize the BFS queue with the children of the root node
    const queue = [...project.children];

    while (queue.length > 0) {
      const currentNode = queue.shift();

      if (currentNode.key === id) {
        return currentNode;
      }

      if (currentNode.children) {
        queue.push(...currentNode.children);
      }
    }

    return null;
  }
);

export { selectNodeByKey };

export const { deleteNode, addNode, updateNode } = projectSlice.actions;
export const projectReducer = projectSlice.reducer;
