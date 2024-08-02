import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { TableDropdown } from "../Forms";

import "./Inputs.css";
import "../../index.css";
import { addNode, updateNode } from "../../features/projectSlice";
import { lekkasjetall } from "../../data/bygningskropp";
import { kuldebroverdier } from "../../data/bygningskropp";
import varmekapasiteter from "../../data/varmekapasiteter";
import { treeMenuConstants } from "../Toolbar/Toolbar";

const DEFAULT_LABEL = "Ny Sone";
const NODE_TYPE = "sone";
const LEGAL_PARENTS = ["project"];

const initialState = {
  navn: { value: "", documentation: "" },
  varmekapasitet: { value: "", documentation: "" },
  lekkasjetall: { value: "", documentation: "" },
  kuldebroverdi: { value: "", documentation: "" },
  oppvarmetBRA: { value: "", documentation: "" },
  takhoyde: { value: "", documentation: "" },
  settpunktOppvarming: { value: "", documentation: "" },
  skjermingsklasse: { value: "IngenSkjerming", documentation: "" },
  solutsatteFasader: { value: "enUtsattFasade", documentation: "" },
};

/**
 * SoneInput component for submitting new sone-nodes.
 * @component
 */
const SoneInput = ({ activeExistingNode }) => {
  const [inputVerdier, setInputVerdier] = useState(structuredClone(initialState));
  const [openDropdown, setOpenDropdown] = useState(null);
  const { activeProjectId } = useSelector((state) => state.active.projectNodes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("activeProject", activeProject);
    console.log("activeExistingNode: ", activeExistingNode);

    if (activeExistingNode) {
      // Prefill form with existing node data if an existing node is active
      const preSetInputValues = structuredClone(activeExistingNode.data);
      console.log("preSetInputValues: ", preSetInputValues);
      setInputVerdier(preSetInputValues);
    } else {
      // Otherwise reset inputVerdier when node changes
      setInputVerdier(structuredClone(initialState));
    }
  }, [activeExistingNode]);

  /**
   * Handles input change events and updates the state accordingly.
   * @param {string} value - The input value.
   * @param {string} fieldId - The field identifier.
   * @param {string} type - The type of value being updated (e.g., "value" or "documentation").
   */
  const handleInputChange = (value, fieldId, type) => {
    console.log(`Input value: ${value} for field: ${fieldId}, type: ${type}`);
    const isNumericField = fieldId !== "navn" && type !== "documentation";

    // Replace commas with dots for numeric fields
    if (isNumericField && value.includes(",")) {
      value = value.replace(",", ".");
    }

    // Only allow numbers for numeric fields
    if (isNumericField && isNaN(Number(value))) {
      return;
    }

    setInputVerdier((prevState) => ({
      ...prevState,
      [fieldId]: {
        ...prevState[fieldId],
        [type]: value,
      },
    }));

    // Close the dropdown after selection
    setOpenDropdown(null);
  };

  /**
   * Handles the form submission and dispatches the new or updated node.
   * @param {React.FormEvent} event - The form submit-event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("handleSubmit inputVerdier:", inputVerdier);
    console.log("activeExistingNode: ", activeExistingNode);

    if (activeExistingNode) {
      updateExistingNode();
    } else {
      addNewNode();
    }
  };

  function updateExistingNode() {
    const updatedNode = {
      ...activeExistingNode,
      data: inputVerdier,
      label: inputVerdier.navn.value || activeExistingNode.label,
    };
    console.log("updateExistingNode dispatches: ", updatedNode);
    dispatch(updateNode(updatedNode));
  }

  /**
   * Adds a new node to the active sone.
   * Resets the input values to the initial state.
   */
  function addNewNode() {
    const newNode = {
      key: nanoid(),
      depth: 2,
      type: NODE_TYPE,
      data: inputVerdier,
      label: inputVerdier.navn.value || DEFAULT_LABEL,
      icon: treeMenuConstants[NODE_TYPE].icon,
      parent: activeProjectId,
      children: [],
    };

    console.log("newNode:", newNode);
    dispatch(addNode({ targetKey: newNode.parent, nodesToAdd: [newNode] }));
    setInputVerdier(structuredClone(initialState));
    navigate(`/project/node/${newNode.key}`);
  }

  /**
   * Returns a sorted array of normert-verdi options.
   * @param {Object} tableName - The table containing the options.
   * @returns {Array} Sorted array of options.
   */
  const normertOptions = (tableName) => {
    return Object.values(tableName)
      .map((item) => ({
        value: item.value,
        description: item.description,
      }))
      .sort((a, b) => a.value - b.value);
  };

  const fields = [
    {
      id: "navn",
      label: "Navn",
      normertOptions: null,
    },
    {
      id: "varmekapasitet",
      label: "Varmekapasitet",
      normertOptions: normertOptions(varmekapasiteter),
    },
    {
      id: "lekkasjetall",
      label: "Lekkasjetall",
      normertOptions: normertOptions(lekkasjetall),
    },
    {
      id: "kuldebroverdi",
      label: "Kuldebroverdi",
      normertOptions: normertOptions(kuldebroverdier),
    },
    {
      id: "oppvarmetBRA",
      label: "Oppvarmet Bruksareal",
      normertOptions: null,
    },
    {
      id: "takhoyde",
      label: "Takhøyde",
      normertOptions: null,
    },
    {
      id: "settpunktOppvarming",
      label: "Settpunkt Romemperatur",
      normertOptions: null,
    },
  ];

  // If no appropriate parent-node is selected; display a message
  if (!activeProjectId) {
    return (
      <MissingParent
        LEGAL_PARENTS={LEGAL_PARENTS}
        DEFAULT_LABEL={DEFAULT_LABEL}
        NODE_TYPE={NODE_TYPE}
      />
    );
  }

  // Otherwise display a table of input values

  return (
    <div className="container ">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header card-form-header">
            <h3 className="card-form-heading">{activeExistingNode?.label || DEFAULT_LABEL}</h3>
            <button type="submit" className="btn btn-sm btn-success btn-submit mt-3">
              Lagre
            </button>
          </div>
          <div className="card-body">
            <Table bordered hover size="sm" responsive="md">
              <thead>
                {/* Overskrifter */}
                <tr>
                  <th></th>
                  <th>Verdi</th>
                  <th>Normert</th>
                  <th>Kommentar</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={index} className="form-group-sm">
                    <td className="col-4">{field.label}</td>

                    {/* Input verdi */}
                    <td className="col-2">
                      <input
                        type="text"
                        pattern={field.id === "navn" ? ".+" : "^\\d*[,.]?\\d*$"}
                        title={field.id === "navn" ? "Oppgi navn" : "Oppgi et tall"}
                        className="form-control form-control-sm"
                        id={field.id}
                        value={inputVerdier[field.id]?.value || ""}
                        onChange={(e) => handleInputChange(e.target.value, field.id, "value")}
                      />
                    </td>

                    {/* Normerte verdier fra NS3031 */}
                    <td className="col-1">
                      {Array.isArray(field.normertOptions) && (
                        <TableDropdown
                          field={field}
                          index={index}
                          openDropdown={openDropdown}
                          setOpenDropdown={setOpenDropdown}
                          handleInputChange={handleInputChange}
                        />
                      )}
                    </td>

                    {/* Dokumentasjon */}
                    <td className="col-4">
                      <input
                        type="text"
                        disabled={field.id === "navn"}
                        className="form-control form-control-sm"
                        id={`documentation-${index}`}
                        value={inputVerdier[field.id]?.documentation || ""}
                        onChange={(e) =>
                          handleInputChange(e.target.value, field.id, "documentation")
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SoneInput;
