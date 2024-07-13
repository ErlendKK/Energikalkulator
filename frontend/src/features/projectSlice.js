import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  key: "0",
  depth: 0,
  type: "project",
  label: "Prosjekt 1",
  data: {},
  icon: "pi pi-fw pi-building",
  parent: null,
  children: [
    {
      key: "sone1",
      depth: 1,
      type: "sone",
      label: "Sone 1",
      data: {},
      icon: "pi pi-fw pi-box",
      parent: "0",
      children: [
        {
          key: "0-33",
          depth: 2,
          type: "fasade",
          label: "Fasade 1",
          data: {},
          icon: "pi pi-fw pi-home",
          parent: "sone1",
          children: [],
        },
        {
          key: "0-34",
          depth: 2,
          type: "fasade",
          label: "Fasade 2",
          data: {},
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
      data: {},
      icon: "pi pi-fw pi-box",
      parent: "0",
      children: [],
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
    add: (state, action) => {
      // targetKey is the key of the parent of the added nodes
      // nodesToAdd is an array of node-objects
      const { targetKey, nodesToAdd } = action.payload;

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
    update: (state, action) => {
      const updatedNode = action.payload;

      const updateNode = (nodes) =>
        nodes.map((node) => {
          if (node.key === updatedNode.key) {
            return updatedNode;
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

export const { deleteNode, add, update } = projectSlice.actions;
export const projectReducer = projectSlice.reducer;
