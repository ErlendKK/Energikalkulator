import { useState } from "react";

const VentilasjonInput = () => {
  const [fieldVerdier, setFieldVerdier] = useState({
    effektVarmebatteri: { value: "", documentation: "" },
    effektKjølebatteri: { value: "", documentation: "" },
    luftmengde: { iDriftstiden: "", utenforDriftstiden: "", documentation: "" },
    virkningsgrad: {
      iDriftstiden: "",
      utenforDriftstiden: "",
      documentation: "",
    },
    sfp: { iDriftstiden: "", utenforDriftstiden: "", documentation: "" },
    setpunkt: { iDriftstiden: "", utenforDriftstiden: "", documentation: "" },
  });

  const rows = [
    { id: "luftmengde", label: "Spesifikk ventilasjonsluftmengde" },
    { id: "virkningsgrad", label: "Temperaturvirkningsgrad" },
    { id: "sfp", label: "Spesifikk vifteeffekt (SFP)" },
    { id: "setpunkt", label: "Setpunkt-temperatur" },
  ];

  const fields = [
    { id: "effektVarmebatteri", label: "Installert Effekt Varmebatteri" },
    { id: "effektKjølebatteri", label: "Installert Effekt Kjølebatteri" },
  ];

  const handleChange = (field, type) => (event) => {
    let { value } = event.target;

    // Replace commas with dots
    if (value.includes(",")) {
      value = value.replace(",", ".");
    }

    setFieldVerdier((prevFieldVerdier) => ({
      ...prevFieldVerdier,
      [field]: {
        ...prevFieldVerdier[field],
        [type]: value,
      },
    }));
  };

  const handleTableChange = (field, type) => (event) => {
    const { value } = event.target;
    setFieldVerdier((prevFieldVerdier) => ({
      ...prevFieldVerdier,
      [field]: {
        ...prevFieldVerdier[field],
        [type]: value,
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Lagret verdier:", fieldVerdier);
  };

  const handleInvalid = (event, column) => {
    if (column.field !== "documentation") {
      event.target.setCustomValidity("Feil format! Verdien må være numerisk");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header card-form-header">
            <h3 className="card-form-heading">Ventilasjon</h3>
            <button type="submit" className="btn btn-success btn-submit mt-3">
              Lagre
            </button>
          </div>
          <div className="card-body">
            {/* Tabell med verdier i/utenfor driftstiden */}
            <div className="card sub-card">
              <div className="card-body">
                <table className="table table-responsive">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Driftstiden</th>
                      <th>Utenfor Driftstiden</th>
                      <th>documentation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td className="col-3">{row.label}</td>
                        <td className="col-2">
                          <input
                            type="text"
                            pattern="^\d*[,.]?\d*$"
                            title="Feil format; legg inn et tall"
                            className="form-control"
                            value={fieldVerdier[row.id].iDriftstiden}
                            onChange={handleTableChange(row.id, "iDriftstiden")}
                          />
                        </td>
                        <td className="col-2">
                          <input
                            type="text"
                            pattern="^\d*[,.]?\d*$"
                            title="Feil format; legg inn et tall"
                            className="form-control"
                            value={fieldVerdier[row.id].utenforDriftstiden}
                            onChange={handleTableChange(row.id, "utenforDriftstiden")}
                          />
                        </td>
                        <td className="col-5">
                          <input
                            type="text"
                            className="form-control doc-input"
                            value={fieldVerdier[row.id].documentation}
                            onChange={handleTableChange(row.id, "documentation")}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tabell for Effekbehov */}
            {/* <h5 className="mt-4">Effekbehov</h5> */}
            <div className="card sub-card">
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Effekbehov</th>
                      <th>Verdi</th>
                      <th>documentation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field) => (
                      <tr key={field.id}>
                        <td className="col-3">{field.label}</td>
                        <td className="col-3">
                          <input
                            type="text"
                            pattern="^\d*[,.]?\d*$"
                            title="Oppgi et tall"
                            className="form-control"
                            value={fieldVerdier[field.id].value}
                            onChange={handleChange(field.id, "value")}
                          />
                        </td>
                        <td className="col-6">
                          <input
                            type="text"
                            className="form-control"
                            value={fieldVerdier[field.id].documentation}
                            onChange={handleChange(field.id, "documentation")}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VentilasjonInput;
