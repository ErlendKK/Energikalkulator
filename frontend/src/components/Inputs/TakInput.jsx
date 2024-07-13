import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { useParams } from "react-router-dom";

import "./Inputs.css";
import { add } from "../../features/projectSlice";

const initialState = {
  navn: { value: "", documentation: "" },
  areal: { value: "", documentation: "" },
  uVerdi: { value: "", documentation: "" },
  himmelretning: { value: "", documentation: "" },
  takvinkel: { value: "", documentation: "" },
};

/**
 * TakInput component for managing and submitting input values.
 * @component
 */
const TakInput = () => {
  const [inputVerdier, setInputVerdier] = useState(structuredClone(initialState));
  const { activeSoneId } = useSelector((state) => state.active.projectNodes);
  const dispatch = useDispatch();
  const { soneID } = useParams();

  useEffect(() => {
    // Reset inputVerdier when activeSoneId changes
    setInputVerdier(structuredClone(initialState));
  }, [activeSoneId]);

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
   * Handles the form submission and dispatches the new node.
   * @param {React.FormEvent} event - The form submit-event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Lagret verdier:", inputVerdier);

    const newNode = {
      key: nanoid(),
      depth: 2,
      type: "tak",
      data: inputVerdier,
      label: inputVerdier.navn.value || "Nytt tak",
      icon: "pi pi-fw pi-map",
      parent: activeSoneId,
      children: [],
    };

    delete newNode.data.navn;
    console.log("newNode:", newNode);

    dispatch(add({ targetKey: newNode.parent, nodesToAdd: [newNode] }));
    setInputVerdier(structuredClone(initialState));
  };

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
      id: "himmelretning",
      label: "Himmelretning",
      normertOptions: null,
    },
    {
      id: "takvinkel",
      label: "Takvinkel",
      normertOptions: null,
    },
  ];

  return (
    <div className="container mt-5">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header card-form-header">
            <h3 className="card-form-heading">Nytt Tak</h3>
            <button type="submit" className="btn btn-sm btn-success btn-submit mt-3">
              Lagre
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
                        value={inputVerdier[field.id]?.value || ""}
                        onChange={(e) => handleInputChange(e.target.value, field.id, "value")}
                      />
                    </td>

                    {/* Normerte verdier fra NS3031 */}
                    <td className="col-1">
                      {Array.isArray(field.normertOptions) && (
                        <NormerteVerdierDropdown field={field} index={index} />
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

export default TakInput;
