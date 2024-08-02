import React from "react";

const MissingParent = ({ LEGAL_PARENTS, DEFAULT_LABEL, NODE_TYPE }) => {
  const parentText = LEGAL_PARENTS.length === 1 ? LEGAL_PARENTS[0] : LEGAL_PARENTS.join(" eller ");

  return (
    <div className="container ">
      <div className="card">
        <div className="card-header card-form-header">
          <h3 className="card-form-heading">{DEFAULT_LABEL}</h3>
        </div>
        <div className="card-body">
          <p>{`Velg en ${parentText} for å legge til ${NODE_TYPE}`}</p>
        </div>
      </div>
    </div>
  );
};

export default MissingParent;
