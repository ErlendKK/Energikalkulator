import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table } from "react-bootstrap";
import "./Inputs.css";
import initialEnergikilder from "../../data/energikilder";

const EnergikilderInput = () => {
  const [energikilder, setEnergikilder] = useState(initialEnergikilder);

  const andelHeadings = [
    { id: "andelEl", label: "Elektrisk" },
    { id: "andelVarme", label: "Rom" },
    { id: "andelVann", label: "Tappevann" },
    { id: "andelVentVarme", label: "Varmebatteri" },
    { id: "andelVentKjol", label: "Kjølebatteri" },
  ];

  const virkningsgradHeadings = [
    { id: "virkningsgradEl", label: "Elektrisk" },
    { id: "virkningsgradVarme", label: "Rom" },
    { id: "virkningsgradVann", label: "Tappevann" },
    { id: "virkningsgradVentVarme", label: "Varmebatteri" },
    { id: "virkningsgradVentKjol", label: "Kjølebatteri" },
  ];

  const handleCheckboxChange = (index) => (event) => {
    const newEnergikilder = [...energikilder];
    newEnergikilder[index].included = event.target.checked;
    setEnergikilder(newEnergikilder);
  };

  // TODO: Dobbeltsjekk at dette fungerer som forventet.
  const handleInputChange = (index, field) => (event) => {
    let { value } = event.target;

    // Replace commas with dots
    if (value.includes(",")) {
      value = value.replace(",", ".");
    }

    setEnergikilder((prevEnergikilder) => {
      const newEnergikilder = [...prevEnergikilder];
      newEnergikilder[index] = {
        ...newEnergikilder[index],
        [field]: value,
      };
      return newEnergikilder;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Lagret verdier:", energikilder);
  };

  const isAndelNotHundred = (id) => {
    const andelSum = energikilder.reduce(
      (sum, energikilde) => sum + parseFloat(energikilde[id]),
      0
    );
    return andelSum !== 100;
  };

  const isVirkningsgradOverHundreds = (id, energikilde) => {
    if (energikilde.navn === "Varmepumpe") return false;
    return parseFloat(energikilde[id]) > 100;
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header card-form-header">
            <h3 className="card-form-heading">Energikilder</h3>
            <button type="submit" className="btn btn-success btn-submit mt-3">
              Lagre
            </button>
          </div>
          <div className="card-body">
            {/* Sub-card: Checkbox for energikilder */}
            <div className="card sub-card">
              <div className="card-body">
                {energikilder.map((energikilde, index) => (
                  <div className="form-check form-check-inline" key={index}>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`energikilde-${index}`}
                      checked={energikilde.included}
                      onChange={handleCheckboxChange(index)}
                    />
                    <label className="form-check-label" htmlFor={`energikilde-${index}`}>
                      {energikilde.navn}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-card: Tabell for energikilder */}
            <div className="card sub-card">
              <div className="card-body">
                <h5>Energikilder Detaljer</h5>
                <div className="table-responsive">
                  <Table bordered hover size="sm">
                    <thead>
                      <tr>
                        <th rowSpan="2">Navn</th>
                        <th colSpan="4">Andel</th>
                        <th className="table-divider"></th>
                        <th colSpan="4">Virkningsgrad</th>
                      </tr>
                      <tr>
                        {andelHeadings.map((heading, index) => (
                          <th key={`andel-${index}`}>{heading.label}</th>
                        ))}
                        <th className="table-divider"></th>
                        {virkningsgradHeadings.map((heading, index) => (
                          <th key={`virkningsgrad-${index}`}>{heading.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {energikilder
                        .filter((energikilde) => energikilde.included)
                        .map((energikilde, index) => (
                          <tr key={index}>
                            <td>{energikilde.navn}</td>

                            {/* Andeler */}
                            {andelHeadings.map((heading) => (
                              <td
                                key={`${index}-${heading.id}`}
                                className={isAndelNotHundred(heading.id) ? "table-warning" : ""}
                              >
                                <input
                                  type="text"
                                  className="form-control"
                                  value={energikilde[heading.id]}
                                  onChange={handleInputChange(index, heading.id)}
                                  pattern="^\d*[,.]?\d*$"
                                  title="Oppgi et tall"
                                />
                              </td>
                            ))}
                            <td className="table-divider"></td>

                            {/* Virkningsgrader */}
                            {virkningsgradHeadings.map((heading) => (
                              <td
                                key={`${index}-${heading.id}`}
                                className={
                                  isVirkningsgradOverHundreds(heading.id, energikilde)
                                    ? "table-warning"
                                    : ""
                                }
                              >
                                <input
                                  type="text"
                                  className="form-control"
                                  value={energikilde[heading.id]}
                                  onChange={handleInputChange(index, heading.id)}
                                  pattern="^\d*[,.]?\d*$"
                                  title="Oppgi et tall"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnergikilderInput;
