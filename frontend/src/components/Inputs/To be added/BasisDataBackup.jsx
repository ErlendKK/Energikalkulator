// import { useState } from "react"
// import "bootstrap/dist/css/bootstrap.min.css"
// import "./Inputs.css"

// const SoneInput = () => {
//   const [basisVerdier, setBasisVerdier] = useState({
//     bygningskategori: { value: "", documentation: "" },
//     oppvarmetBruksareal: { value: "", documentation: "" },
//     takhoyde: { value: "", documentation: "" },
//     kuldebroverdi: { value: "", documentation: "" },
//     varmekapasitet: { value: "", documentation: "" },
//     lekkasjetall: { value: "", documentation: "" },
//   })

//   const handleChange = (field, type) => (event) => {
//     const { value } = event.target

//     // Replace commas with dots
//     if (field !== "documentation" && value.includes(",")) {
//       value = value.replace(",", ".")
//     }

//     setBasisVerdier({
//       ...basisVerdier,
//       [field]: {
//         ...basisVerdier[field],
//         [type]: value,
//       },
//     })
//   }

//   const handleSubmit = (event) => {
//     event.preventDefault()
//     console.log("Lagret verdier:", basisVerdier)
//   }

//   const fields = [
//     { id: "oppvarmetBruksareal", label: "Oppvarmet Bruksareal" },
//     { id: "takhoyde", label: "Gjennomsnitlig Takhøyde" },
//     { id: "kuldebroverdi", label: "Normalisert Kuldebroverdi" },
//     { id: "varmekapasitet", label: "Normalisert Varmekapasitet" },
//     { id: "lekkasjetall", label: "Lekkasjetall" },
//   ]

//   // TODO: Mulighet for å legge inn/ redigere navn.
//   return (
//     <div className="container mt-5">
//       <div className="card">
//         <form onSubmit={handleSubmit}>
//           <div className="card-header card-form-header">
//             <h3 className="card-form-heading">Basis Input</h3>
//             <button type="submit" className="btn btn-success btn-submit mt-3">
//               Lagre
//             </button>
//           </div>
//           <div className="card-body">
//             {/*Sub-card: Dropdown: Bygningskategori */}
//             <div className="card sub-card">
//               <div className="card-body">
//                 <div className="mb-3">
//                   <label htmlFor="bygningskategori" className="form-label">
//                     Bygningskategori
//                   </label>
//                   <select
//                     id="bygningskategori"
//                     className="form-control"
//                     value={basisVerdier.bygningskategori.value}
//                     onChange={handleChange("bygningskategori", "value")}
//                   >
//                     <option value="">Velg kategori</option>
//                     <option value="bolig">Bolig</option>
//                     <option value="næring">Næring</option>
//                     <option value="offentlig">Offentlig</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/*Sub-card: Tabell: areal, høyde, kuldebroverdi, varmekapasitet, lekkasjetall" */}
//             <div className="card sub-card">
//               <div className="card-body">
//                 <table className="table">
//                   <thead>
//                     <tr>
//                       <th>Parameter</th>
//                       <th>Verdi</th>
//                       <th></th>
//                       <th>documentation</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {fields.map((field, index) => (
//                       <tr key={index} className="form-group-sm">
//                         <td className="col-4">{field.label}</td>
//                         <td className="col-2">
//                           <input
//                             type="text"
//                             pattern="^\d*[,.]?\d*$"
//                             title="Feil format; legg inn et tall"
//                             className="form-control form-control-sm"
//                             id={field.id}
//                             value={basisVerdier[field.id].value}
//                             onChange={handleChange(field.id, "value")}
//                           />
//                         </td>
//                         <td>
//                           <button
//                             type="button"
//                             className="btn btn-sm btn-light dropdown-toggle dropdown-toggle-split"
//                             data-bs-toggle="dropdown"
//                             aria-expanded="false"
//                             // style={{ width: "90%" }}
//                           >
//                             <span className="visually-hidden">Toggle Dropdown</span>
//                           </button>
//                           <ul className="dropdown-menu">
//                             <li>
//                               <a className="dropdown-item" href="#">
//                                 Action
//                               </a>
//                             </li>
//                             <li>
//                               <a className="dropdown-item" href="#">
//                                 Another action
//                               </a>
//                             </li>
//                             <li>
//                               <a className="dropdown-item" href="#">
//                                 Something else here
//                               </a>
//                             </li>
//                           </ul>
//                         </td>

//                         <td className="col-5">
//                           <input
//                             type="text"
//                             className="form-control form-control-sm"
//                             id={`${field.id}Documentation`}
//                             value={basisVerdier[field.id].documentation}
//                             onChange={handleChange(field.id, "documentation")}
//                           />
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default SoneInput
