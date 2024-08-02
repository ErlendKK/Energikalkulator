import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Table, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { TableDropdown } from "../Forms";

import "./Inputs.css";
import { addNode, selectNodeByKey } from "../../features/projectSlice";
import bygningskategorier from "../../data/bygningskategorier";
import { treeMenuConstants } from "../Toolbar/Toolbar";

const DEFAULT_LABEL = "Nytt Prosjekt";
const NODE_TYPE = "prosjekt";
const LEGAL_PARENTS = [null];

const initialState = {
  navn: { value: "", documentation: "" },
  bygningskategori: { value: "", documentation: "" },
};

/**
 * SoneInput component for submitting new sone-nodes.
 * @component
 */
const ProjectInput = ({ activeExistingNode }) => {
  const [inputVerdier, setInputVerdier] = useState(structuredClone(initialState));
  const [openDropdown, setOpenDropdown] = useState(null);
  const { activeProjectId } = useSelector((state) => state.active.projectNodes);
  const { projectNode } = useSelector((state) => state.project);

  const dispatch = useDispatch();

  // TODO: Update this temporary solution - get from store => route-params
  const activeProject = useSelector((state) => selectNodeByKey(state, activeProjectId));

  useEffect(() => {
    console.log("activeProject", activeProject);
    console.log("node: ", activeExistingNode);

    if (activeExistingNode) {
      // Prefill form with existing node data if an existing node is selected
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
  // const toggleDropdown = (dropdownId) => {
  //   setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  // };

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
      type: NODE_TYPE,
      data: inputVerdier,
      label: inputVerdier.navn.value || DEFAULT_LABEL,
      icon: treeMenuConstants[NODE_TYPE].icon,
      parent: activeProjectId,
      children: [],
    };

    console.log("newSone:", newSone);
    dispatch(addNode({ targetKey: newSone.parent, nodesToAdd: [newSone] }));
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

  //Display a table of input values
  return (
    <div className="container ">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header card-form-header">
            <h3 className="card-form-heading">{activeProject?.label || DEFAULT_LABEL}</h3>
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

export default ProjectInput;
