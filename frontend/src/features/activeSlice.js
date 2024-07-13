import capitalize from "lodash/capitalize";
import { createSlice } from "@reduxjs/toolkit";
import { findNodeFromKey } from "../utils/nodes";

const initialState = {
  projectNodes: {
    activeProjectId: "",
    activeSoneId: "",
    activeFasadeId: "",
    activeTakId: "",
    activeGulvId: "",
    activeVinduId: "",
  },
  activeInputForm: "",
};

const activeSlice = createSlice({
  name: "active",
  initialState,
  reducers: {
    // TODO: repeatedly calling findNodeFromKey seems inefficient; find a better algorithm.
    setActiveNodeId: (state, action) => {
      const { node, projectHierarchy } = action.payload;
      console.log("setActiveNodeId called with node: ", node);

      // reset all active nodes by shallowly copying initialState.projectNodes
      state.projectNodes = { ...initialState.projectNodes };

      // Traverse up the hierarchy to set the active IDs
      const setActiveIds = (currentNode) => {
        while (currentNode) {
          const type = capitalize(currentNode.type);
          state.projectNodes[`active${type}Id`] = currentNode.key;
          currentNode = findNodeFromKey(projectHierarchy, currentNode.parent);
        }
      };

      setActiveIds(node);
    },
    setActiveInputForm: (state, action) => {
      console.log(`Setting active input form: ${action.payload}`);
      state.activeInputForm = action.payload;
    },
  },
});

export const { setActiveNodeId, setActiveInputForm } = activeSlice.actions;
export const activeReducer = activeSlice.reducer;
