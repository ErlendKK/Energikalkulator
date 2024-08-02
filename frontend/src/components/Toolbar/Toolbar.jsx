import { Tooltip, OverlayTrigger } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import { setActiveInputForm } from "../../features/activeSlice";
import "./Toolbar.css";
import "../../index.css";

export const treeMenuConstants = {
  sone: { depth: 1, icon: "pi pi-fw pi-box", tooltip: "Sone" },
  energiforsyning: { depth: 2, icon: "pi pi-fw pi-bolt", tooltip: "Energiforsyning" },
  internlaster: { depth: 2, icon: "pi pi-fw pi-cog", tooltip: "Internlaster" },
  ventilasjon: { depth: 2, icon: "pi pi-fw pi-play-circle", tooltip: "Ventilasjon" },
  fasade: { depth: 2, icon: "pi pi-fw pi-home", tooltip: "Fasade" },
  tak: { depth: 2, icon: "pi pi-fw pi-map", tooltip: "Tak" },
  gulv: { depth: 2, icon: "pi pi-fw pi-stop", tooltip: "Gulv" },
  vindu: { depth: 3, icon: "pi pi-fw pi-microsoft", tooltip: "Vindu" },
};

const Toolbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /**
   * Dispatches an action to activeSlice, to set the active input form
   * and navigates to the corresponding route
   * @param {string} key - The key representing the active input form to set
   */
  const handleClick = (key) => {
    console.log("Clicked item:", key);
    dispatch(setActiveInputForm(key));
    navigate(`/project/add/${key}`);
  };

  return (
    <Row className="container" id="toolbar-container">
      <Col md={12} className="mb-3 mb-md-0">
        <div className="node-menu ">
          {Object.entries(treeMenuConstants).map(([key, item], index) => (
            <OverlayTrigger
              key={index}
              placement="bottom"
              overlay={
                <Tooltip id={`tooltip-${index}`} style={{ position: "fixed" }}>
                  {item.tooltip}
                </Tooltip>
              }
            >
              <button type="button" className="icon-button" onClick={() => handleClick(key)}>
                <i className={item.icon}></i>
              </button>
            </OverlayTrigger>
          ))}
        </div>
      </Col>
    </Row>
  );
};

export default Toolbar;
