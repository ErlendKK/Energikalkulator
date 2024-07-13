import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import "./Inputs.css";

// TODO refactorer til å bruke looper til å generere input felt.

const initialState = {
  soneNavn: "Energi",
  vannbårenOppvarming: false,
  effektRomVarme: { value: "", documentation: "" },
  effektVentKjøl: { value: "", documentation: "" },
  settpunktSommer: { value: "", documentation: "" },
  settpunktVinter: { value: "", documentation: "" },
  pumpeEffektSpesifikk: { value: "", documentation: "" },
};

const fieldsEffect = [
  {
    id: "effektRomVarme",
    label: "Installert effekt Romoppvarming",
  },
  {
    id: "effektVentKjøl",
    label: "Installert effekt Lokal Kjøling",
  },
  {
    id: "pumpeEffektSpesifikk",
    label: "Spesifikk pumpeeffekt (SPP)",
  },
];

// TODO: Hent activeSone fra state
const activeSone = "0-1";
// const activeSone = useSelector((state) => state.project.activeSone);

const EnergiInput = () => {
  const [inputVerdier, setInputVerdier] = useState(initialState);
  const dispatch = useDispatch();

  const columnsVirkningsgrad = ["Parameter", "Rom/Direkte", "Ventilasjon", "documentation"];

  const handleChange = (field, type) => (event) => {
    let { value } = event.target;

    // Replace commas with dots for numeric fields
    if (field !== "documentation" && value.includes(",")) {
      value = value.replace(",", ".");
    }

    // Only allow numbers for numeric fields
    if (field !== "documentation" && isNaN(Number(value))) {
      return;
    }

    setInputVerdier({
      ...inputVerdier,
      [field]: {
        ...inputVerdier[field],
        [type]: value,
      },
    });
  };

  const handleCheckboxChange = (event) => {
    setInputVerdier({
      ...inputVerdier,
      vannbårenOppvarming: event.target.checked,
    });
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
      depth: 2,
      type: "energi",
      data: inputVerdier,
      label: inputVerdier.soneNavn || "Energi",
      icon: "pi pi-fw pi-bolt",
      parent: activeSone,
      children: [null],
    };

    delete newSone.data.soneNavn;
    console.log("newSone:", newSone);

    dispatch(add({ targetKey: activeSone, nodesToAdd: [newSone] }));
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header card-form-header">
            <h3 className="card-form-heading">Energibehov</h3>
            <button type="submit" className="btn btn-success btn-submit mt-3">
              Lagre
            </button>
          </div>
          <div className="card-body">
            {/* Sub-card: Checkbox: Vannbåren oppvarming */}
            <div className="card sub-card">
              <div className="card-body">
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="vannbårenOppvarming"
                    checked={inputVerdier.vannbårenOppvarming}
                    onChange={handleCheckboxChange}
                  />
                  <label className="form-check-label" htmlFor="vannbårenOppvarming">
                    Vannbåren Oppvarming
                  </label>
                </div>
              </div>
            </div>

            {/* Sub-card: Tabell for settpunkter */}
            <div className="card sub-card">
              <div className="card-body">
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>
                        <h6>Settpunkter</h6>
                      </th>
                      <th>Vinter</th>
                      <th>Sommer</th>
                      <th>documentation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="col-3">Setpunkt romtemperatur</td>
                      <td className="col-2">
                        <input
                          type="text"
                          pattern="^\d*[,.]?\d*$"
                          title="Feil format; legg inn et tall"
                          className="form-control form-control-sm"
                          id="settpunktVinter"
                          value={inputVerdier.settpunktVinter.value}
                          onChange={handleChange("settpunktVinter", "value")}
                        />
                      </td>
                      <td className="col-2">
                        <input
                          type="text"
                          pattern="^\d*[,.]?\d*$"
                          title="Feil format; legg inn et tall"
                          className="form-control form-control-sm"
                          id="settpunktSommer"
                          value={inputVerdier.settpunktSommer.value}
                          onChange={handleChange("settpunktSommer", "value")}
                        />
                      </td>
                      <td className="col-5">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="SettpunktDocumentation"
                          value={inputVerdier.settpunktVinter.documentation}
                          onChange={handleChange("settpunktVinter", "documentation")}
                        />
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>

            {/* Sub-card: Tabell for effekt */}
            <div className="card sub-card">
              <div className="card-body">
                <Table hover size="sm">
                  <thead>
                    <tr>
                      <th>
                        <h6>Effekt</h6>
                      </th>
                      <th>Verdi</th>
                      <th>documentation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fieldsEffect.map((row, index) => (
                      <tr key={index}>
                        <td className="col-3">{row.label}</td>
                        <td className="col-3">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            pattern="^\d*[,.]?\d*$"
                            id={row.id}
                            value={inputVerdier[row.id].value}
                            onChange={handleChange(row.id, "value")}
                          />
                        </td>
                        <td className="col-6">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id={`${row.id}Documentation`}
                            value={inputVerdier[row.id].documentation}
                            onChange={handleChange(row.id, "documentation")}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnergiInput;
