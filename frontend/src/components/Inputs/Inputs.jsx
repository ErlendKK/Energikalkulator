import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Inputs.css";

import ProjectInput from "./ProsjektInput";
import SoneInput from "./SoneInput";
import FasadeInput from "./FasadeInput";
import TakInput from "./TakInput";
import GulvInput from "./GulvInput";
import { selectNodeByKey } from "../../features/projectSlice";

const inputFields = {
  project: ProjectInput,
  sone: SoneInput,
  fasade: FasadeInput,
  tak: TakInput,
  gulv: GulvInput,
};

/**
 * Inputs component for managing and displaying input forms.
 * @component
 * @param {string} activeInputForm - The active input form.
 * @param {string} nodeKey - The key of the node being edited.
 */
const Inputs = ({ activeInputForm, nodeKey }) => {
  const nodeParam = useSelector((state) => selectNodeByKey(state, nodeKey));
  const projectRootNode = useSelector((state) => state.project);

  // Keep for debugging
  useEffect(() => {
    if (nodeKey) {
      console.log(`Editing node: ${nodeKey}`);
    } else if (activeInputForm) {
      console.log(`Creating node. Active input form: ${activeInputForm}`);
    } else {
      console.log(`No params. (presumably means that the root-node is active)`);
    }
  }, [activeInputForm, nodeKey]);

  // Determine the active input form from the node type if editing
  const activeExistingNode = !nodeParam && !activeInputForm ? projectRootNode : nodeParam;
  const nodeType = activeInputForm || activeExistingNode.type;
  const ActiveComponent = inputFields[nodeType];

  return (
    <div className="input-container mt-5">
      {ActiveComponent ? (
        <ActiveComponent node={activeExistingNode} />
      ) : (
        <div>Invalid input form</div>
      )}
    </div>
  );
};

export default Inputs;

// TODO: add the rest of the input forms

// import VentilasjonInput from "./VentilasjonInput";
// import InternlastInput from "./InternlastInput";
// import EnergiInput from "./EnergiInput";
// import EnergikilderInput from "./EnergikilderInput";

// { id: "ventilasjon", component: VentilasjonInput, isDisplayed: false },
// { id: "internlast", component: InternlastInput, isDisplayed: false },
// { id: "energi", component: EnergiInput, isDisplayed: false },
// { id: "energikilder", component: EnergikilderInput, isDisplayed: false },
