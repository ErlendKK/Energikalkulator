import { useState } from "react";

const initialValues = {
  belysning: {
    effektbehov: "",
    varmetilskudd: "",
    driftstid: "",
    documentation: "",
    isBehovstyrtBelysing: false,
  },
  utstyr: {
    effektbehov: "",
    varmetilskudd: "",
    driftstid: "",
    documentation: "",
  },
  varmtvann: {
    effektbehov: "",
    varmetilskudd: "",
    driftstid: "",
    documentation: "",
  },
  personer: {
    effektbehov: "0",
    varmetilskudd: "",
    driftstid: "",
    documentation: "",
  },
};

const InternlastInput = () => {
  const [fieldVerdier, setFieldVerdier] = useState(initialValues);

  const rows = [
    { id: "belysning", label: "Belysning i driftstiden" },
    { id: "utstyr", label: "Utstyr i driftstiden" },
    { id: "varmtvann", label: "Varmtvann i driftstiden" },
    { id: "personer", label: "Personer i driftstiden" },
  ];

  const columns = [
    {
      heading: "Spesifikt effektbehov",
      class: "col-2",
      field: "effektbehov",
      units: "kW/m2",
    },
    {
      heading: "Spesifikt varmetilskudd",
      class: "col-2",
      field: "varmetilskudd",
      units: "kW/m2",
    },
    {
      heading: "Driftstid",
      class: "col-2",
      field: "driftstid",
      units: "timer/dag",
    },
    {
      heading: "documentation",
      class: "col-6",
      field: "documentation",
      units: "",
    },
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
            <h3 className="card-form-heading">Internlaster</h3>
            <button type="submit" className="btn btn-success btn-submit mt-3">
              Lagre
            </button>
          </div>
          <div className="card-body">
            {/*Sub-card: Tabell: Internlaster */}
            <div className="card sub-card">
              <div className="card-body table-responsive">
                <table className="table ">
                  <thead>
                    <tr>
                      <th></th>
                      {columns.map((column, index) => (
                        <th key={index}>{column.heading}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td className="col-2">{row.label}</td>
                        {columns.map((column) => (
                          <td key={column.field} className={column.class}>
                            <div className="input-group mb-3">
                              <input
                                type="text"
                                id={`${row.id}${column.field}`}
                                className="form-control"
                                value={fieldVerdier[row.id][column.field]}
                                onChange={handleChange(row.id, column.field)}
                                disabled={row.id === "personer" && column.field === "effektbehov"}
                                pattern={
                                  column.field !== "documentation" ? "^\\d*[,.]?\\d*$" : undefined
                                }
                                title={
                                  column.field !== "documentation"
                                    ? "Feil format; kun tall er tillatt"
                                    : ""
                                }
                              />
                            </div>
                          </td>
                        ))}
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

export default InternlastInput;
