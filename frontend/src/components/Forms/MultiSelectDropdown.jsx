import React from "react";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // theme
import "primereact/resources/primereact.css"; // core css
//import styling from primereact

// import "./forms.css";

export function MultiSelectDropdown({ data, selectedData, setSelectedData }) {
  return (
    <div className="card flex justify-content-center">
      <MultiSelect
        value={selectedData}
        onChange={(e) => setSelectedData(e.value)}
        options={data}
        optionLabel="label"
        filter
        placeholder="Velg soner"
        maxSelectedLabels={3}
        className="w-full md:w-20rem"
      />
    </div>
  );
}

export default MultiSelectDropdown;
