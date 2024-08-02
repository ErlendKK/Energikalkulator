// import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Table } from "react-bootstrap";

/**
 * Dropdown component for selecting normalized values.
 * @component
 * @param {Object} field - The field object.
 * @param {number} index - The index of the field.
 * @param {string} openDropdown - The dropdown identifier state-variable.
 * @param {Function} setOpenDropdown - The state-setting function for openDropdown.
 * @param {Function} handleInputChange - The input change handler function.
 * @returns {JSX.Element}
 */
const TableDropdown = ({ field, index, openDropdown, setOpenDropdown, handleInputChange }) => {
  /**
   * Toggles the visibility of the dropdown menu.
   * @param {string} dropdownId - The dropdown identifier.
   */
  const toggleDropdown = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

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

export default TableDropdown;
