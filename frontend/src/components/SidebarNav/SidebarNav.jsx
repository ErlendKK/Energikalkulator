import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TreeMenu from "./TreeMenu";
import "./SidebarNav.css";

const SidebarNav = () => {
  return (
    <nav className="bg-light sidebar">
      <TreeMenu />
    </nav>
  );
};

export default SidebarNav;

// const SidebarNav = () => {
//   const [isOpen, setIsOpen] = useState(true);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
//       <div className="sidebar-content">{isOpen && <TreeMenu />}</div>
//       <button className="toggle-btn" onClick={toggleSidebar}>
//         {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
//       </button>
//     </div>
//   );
// };

// export default SidebarNav;
