import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "../components/Inputs/Inputs.css";
import { ProjectInput, SoneInput, FasadeInput, TakInput, GulvInput } from "../components/Inputs";
import { selectNodeByKey } from "../features/projectSlice";

const inputFields = {
  project: ProjectInput,
  sone: SoneInput,
  fasade: FasadeInput,
  tak: TakInput,
  gulv: GulvInput,
};

const ProjectPage = () => {
  const { newNodeType, existingNodeKey } = useParams();
  const nodeParam = useSelector((state) => selectNodeByKey(state, existingNodeKey));
  const projectRootNode = useSelector((state) => state.project);

  // Keep for debugging
  useEffect(() => {
    console.log("newNodeType: ", newNodeType);
    console.log("existingNodeKey: ", existingNodeKey);
    if (existingNodeKey) {
      console.log(`Editing node: ${existingNodeKey}`);
    } else if (newNodeType) {
      console.log(`Creating node. Active input form: ${newNodeType}`);
    } else {
      console.log(`No params. (presumably means that the root-node is active)`);
    }
  }, [newNodeType, existingNodeKey]);

  // Determine the active input form from the node type if editing
  const activeExistingNode = !nodeParam && !newNodeType ? projectRootNode : nodeParam;
  const nodeType = newNodeType || activeExistingNode.type;
  const ActiveComponent = inputFields[nodeType];

  return (
    <div className="input-container ">
      {ActiveComponent ? (
        <ActiveComponent activeExistingNode={activeExistingNode} />
      ) : (
        <div>
          {newNodeType
            ? `Input felt for ${newNodeType} er foreløpig ikke implementert`
            : "Under konstruksjon"}
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
