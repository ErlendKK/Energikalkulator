import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";

const MyAccordion = () => {
  return (
    <div>
      <h3>Default</h3>
      <Accordion>
        <AccordionTab header="Header I">
          <p>Content I</p>
        </AccordionTab>
        <AccordionTab header="Header II">
          <p>Content II</p>
        </AccordionTab>
        <AccordionTab header="Header III">
          <p>Content III</p>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default MyAccordion;
