import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";

import "./Inputs.css";
import { add, update } from "../../features/projectSlice";

const initialState = {
  navn: { value: "", documentation: "" },
  areal: { value: "", documentation: "" },
  uVerdi: { value: "", documentation: "" },
  omkrets: { value: "", documentation: "" },
};

const GulvInput = ({ node }) => {
  const [inputVerdier, setInputVerdier] = useState(structuredClone(initialState));
  const dispatch = useDispatch();
  const { activeSoneId } = useSelector((state) => state.active.projectNodes);

  useEffect(() => {
    if (node) {
      // Prefill form with existing node data if an existing node is selected
      setInputVerdier(node.data);
    } else {
      // Otherwise reset inputVerdier when node changes
      setInputVerdier(structuredClone(initialState));
    }
  }, [node]);

  /**
   * Handles input change events and updates the state accordingly.
   * @param {string} value - The input value.
   * @param {string} fieldId - The field identifier.
   * @param {string} type - The type of value being updated (e.g., "value" or "documentation").
   */
  const handleInputChange = (value, fieldId, type) => {
    console.log(`Selected: ${value} for field: ${fieldId}, type: ${type}`);
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
  };

  /**
   * Handles the form submission and dispatches the new or updated node.
   * @param {React.FormEvent} event - The form submit-event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Lagret verdier:", inputVerdier);

    if (node) {
      updateExistingNode;
    } else {
      addNewNode();
    }
  };

  function updateExistingNode() {
    const updatedNode = {
      ...node,
      data: inputVerdier,
      label: inputVerdier.navn.value || node.label,
    };
    dispatch(update(updatedNode));
  }

  /**
   * Adds a new node to the active sone.
   * Resets the input values to the initial state.
   */
  function addNewNode() {
    const newNode = {
      key: nanoid(),
      depth: 2,
      type: "gulv",
      data: inputVerdier,
      label: inputVerdier.navn.value || "Nytt gulv",
      icon: "pi pi-fw pi-stop",
      parent: activeSoneId,
      children: [],
    };
    delete newNode.data.navn;
    console.log("newNode:", newNode);
    dispatch(add({ targetKey: newNode.parent, nodesToAdd: [newNode] }));
    setInputVerdier(structuredClone(initialState));
    // TODO: Route to new node after creation
  }

  // TODO: Hent normerte U-Verdier fra data
  const fields = [
    {
      id: "navn",
      label: "Navn",
      normertOptions: null,
    },
    {
      id: "areal",
      label: "Areal",
      normertOptions: null,
    },

    {
      id: "uVerdi",
      label: "U-Verdi",
      normertOptions: null,
      // normertOptions: normertOptions(uVerdier),
    },
    {
      id: "omkrets",
      label: "Omkrets",
      normertOptions: null,
    },
  ];

  return (
    <div className="container mt-5">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header card-form-header">
            <h3 className="card-form-heading">{node ? "Rediger Gulv" : "Nytt Gulv"}</h3>
            <button type="submit" className="btn btn-sm btn-success btn-submit mt-3">
              {node ? "Oppdater" : "Opprett"}
            </button>
          </div>
          <div className="card-body">
            <Table bordered hover size="sm" responsive>
              <thead>
                {/* Overskrifter */}
                <tr>
                  <th></th>
                  <th>Verdi</th>
                  <th>Normert</th>
                  <th>Dokumentatasjon</th>
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
                        // TODO: find out why inputVerdier[field.id].value sometimes fails and implement more robust solution
                        value={inputVerdier[field.id]?.value || ""}
                        onChange={(e) => handleInputChange(e.target.value, field.id, "value")}
                      />
                    </td>

                    {/* Normerte verdier fra NS3031 */}
                    <td className="col-1"></td>

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

export default GulvInput;
