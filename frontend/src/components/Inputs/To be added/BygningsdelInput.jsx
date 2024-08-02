import { useState } from "react";

const initialValues = {
  yttervegg: { areal: "", uVerdi: "", documentation: "" },
  tak: { areal: "", uVerdi: "", documentation: "" },
  gulv: { areal: "", uVerdi: "", documentation: "" },
  vindu: { areal: "", uVerdi: "", documentation: "" },
  dorer: { areal: "", uVerdi: "", documentation: "" },
};

const BygningsdelInput = () => {
  const [fieldVerdier, setFieldVerdier] = useState(initialValues);

  const rows = [
    { id: "yttervegg", label: "Yttervegg" },
    { id: "tak", label: "Tak" },
    { id: "gulv", label: "Gulv" },
    { id: "vindu", label: "Vindu" },
    { id: "dorer", label: "Dører" },
  ];

  const handleChange = (rowId, field) => (event) => {
    const { value } = event.target;

    // Replace commas with dots
    if (field !== "documentation" && value.includes(",")) {
      value = value.replace(",", ".");
    }

    setFieldVerdier((prevFieldVerdier) => ({
      ...prevFieldVerdier,
      [rowId]: {
        ...prevFieldVerdier[rowId],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Lagret verdier:", fieldVerdier);
  };

  return (
    <div className="container ">
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="card-header card-form-header">
            <h3 className="card-form-heading">Bygningsdeler</h3>
            <button type="submit" className="btn btn-success btn-submit mt-3">
              Lagre
            </button>
          </div>
          <div className="card-body">
            {/*Sub-card: Tabell: Bygningsdeler */}
            <div className="card sub-card">
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Bygningsdel</th>
                      <th>Areal</th>
                      <th>U-verdi</th>
                      <th>documentation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.label}</td>
                        <td className="col-2">
                          <input
                            type="text"
                            pattern="^\d*[,.]?\d*$"
                            title="Feil format; legg inn et tall"
                            className="form-control"
                            value={fieldVerdier[row.id].areal}
                            onChange={handleChange(row.id, "areal")}
                          />
                        </td>
                        <td className="col-2">
                          <input
                            type="text"
                            pattern="^\d*[,.]?\d*$"
                            title="Feil format; legg inn et tall"
                            className="form-control"
                            value={fieldVerdier[row.id].uVerdi}
                            onChange={handleChange(row.id, "uVerdi")}
                          />
                        </td>
                        <td className="col-6">
                          <input
                            type="text"
                            className="form-control doc-input"
                            value={fieldVerdier[row.id].documentation}
                            onChange={handleChange(row.id, "documentation")}
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

export default BygningsdelInput;
