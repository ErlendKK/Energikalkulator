import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { useParams } from "react-router-dom";

import "./Inputs.css";
import { add, selectNodeByKey } from "../../features/projectSlice";
import bygningskategorier from "../../data/bygningskategorier";

const initialState = {
  navn: { value: "", documentation: "" },
  bygningskategori: { value: "", documentation: "" },
};

/**
 * SoneInput component for submitting new sone-nodes.
 * @component
 */
const ProjectInput = () => {
  const [inputVerdier, setInputVerdier] = useState(structuredClone(initialState));
  const [openDropdown, setOpenDropdown] = useState(null);
  const { activeProjectId } = useSelector((state) => state.active.projectNodes);
  const dispatch = useDispatch();

  // TODO: Update this temporary solution - get from store => route-params
  const activeProject = useSelector((state) => selectNodeByKey(state, activeProjectId));

  useEffect(() => {
    // Reset inputVerdier when activeProjectId changes
    setInputVerdier(structuredClone(initialState));
  }, [activeProjectId]);

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

    setOpenDropdown(null);
  };

  /**
   * Toggles the visibility of the dropdown menu.
   * @param {string} dropdownId - The dropdown identifier.
   */
  const toggleDropdown = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  /**
   * Handles the form submission and dispatches the new node.
   * @param {React.FormEvent} event - The form submit-event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Lagret verdier:", inputVerdier);

    const newSone = {
      key: nanoid(),
      depth: 1,
      type: "sone",
      data: inputVerdier,
      label: inputVerdier.navn.value || "Ny sone",
      icon: "pi pi-fw pi-box",
      parent: activeProjectId,
      children: [],
    };

    delete newSone.data.navn;
    console.log("newSone:", newSone);

    dispatch(add({ targetKey: newSone.parent, nodesToAdd: [newSone] }));
    setInputVerdier(structuredClone(initialState));
  };

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
      id: "bygningskategori",
      label: "Bygningskategori",
      normertOptions: null,
    },
  ];

  /**
   * Dropdown component for selecting building categories.
   * @component
   * @returns {JSX.Element}
   */
  const BygningskategoriDropdown = () => {
    return (
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic" size="sm" style={{ width: "100%" }}>
          {!inputVerdier.bygningskategori.value
            ? "Bygningskategori"
            : inputVerdier.bygningskategori.value.length > 20
            ? inputVerdier.bygningskategori.value.substring(0, 18) + "..."
            : inputVerdier.bygningskategori.value}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Header>Bygningskategori</Dropdown.Header>
          {bygningskategorier.map((item) => (
            <Dropdown.Item
              key={item.kategori}
              onClick={() => handleInputChange(item.kategori, "bygningskategori", "value")}
            >
              {item.kategori}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  /**
   * Dropdown component for selecting normalized values.
   * @component
   * @param {Object} props.field - The field object.
   * @param {number} props.index - The index of the field.
   * @returns {JSX.Element}
   */
  const NormerteVerdierDropdown = ({ field, index }) => {
    return (
      <Dropdown
        show={openDropdown === `dropdown-${index}`}
        onToggle={() => toggleDropdown(`dropdown-${index}`)}
      >
        <Dropdown.Toggle
          variant="light"
          size="sm"
          id={`dropdown-${index}`}
          drop="down-centered"
        ></Dropdown.Toggle>

        <Dropdown.Menu className="p-0 custom-dropdown-menu">
          <div className="custom-dropdown-table">
            <div className="dropdown-header">
              <div className="value-column">Verdi</div>
              <div className="description-column">Beskrivelse</div>
            </div>
            {field.normertOptions.map((option, optionIndex) => (
              <div
                key={optionIndex}
                className="dropdown-row"
                onClick={() => handleInputChange(option.value, field.id, "value")}
              >
                <div className="value-column">{option.value}</div>
                <div className="description-column">{option.description}</div>
              </div>
            ))}
          </div>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header card-form-header">
            <h3 className="card-form-heading">{activeProject?.label || "Nytt Prosjekt"}</h3>
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
                      {field.id === "bygningskategori" ? (
                        <BygningskategoriDropdown />
                      ) : (
                        <input
                          type="text"
                          pattern={field.id === "navn" ? ".+" : "^\\d*[,.]?\\d*$"}
                          title={field.id === "navn" ? "Oppgi navn" : "Oppgi et tall"}
                          className="form-control form-control-sm"
                          id={field.id}
                          value={inputVerdier[field.id]?.value || ""}
                          onChange={(e) => handleInputChange(e.target.value, field.id, "value")}
                        />
                      )}
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

export default ProjectInput;
