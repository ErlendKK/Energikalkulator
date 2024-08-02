import React from "react";
import Accordion from "react-bootstrap/Accordion";
import Select from "react-select";
import "./Accordion.css";

function AccordionInstillinger({ selectedSones, setSelectedSones, allSones }) {
  // Convert soner array to an array of options
  const options = allSones.map((sone) => ({
    value: sone.key,
    label: sone.label,
  }));

  /**
   * Update the selectedSones state with the new selection
   * @param {Array} selectedOptions An array of selected options
   */
  const handleSelectChange = (selectedOptions) => {
    console.log("selectedOptions: ", selectedOptions);
    const selectedKeys = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    const newSelectedSones = allSones.filter((sone) => selectedKeys.includes(sone.key));
    setSelectedSones(newSelectedSones);
  };

  // Map selectedSones to the format expected by the Select component
  const selectedValues = selectedSones.map((sone) => ({
    value: sone.key,
    label: sone.label,
  }));

  return (
    <Accordion className="accordion-box">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Instillinger</Accordion.Header>
        <Accordion.Body>
          <Select
            isMulti
            value={selectedValues}
            onChange={handleSelectChange}
            options={options}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
          />
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AccordionInstillinger;
