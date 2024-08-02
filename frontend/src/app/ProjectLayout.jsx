import React, { useRef, useCallback, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import TreeMenu from "../components/TreeMenu";
import "../index.css";
import "./Layout.css";

const ProjectLayout = () => {
  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(200);

  const startResizing = useCallback((mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (mouseMoveEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left;
        setSidebarWidth(Math.min(Math.max(newWidth, 10), 350));
      }
    },
    [isResizing]
  );

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <div className="app-container">
      <div ref={sidebarRef} className="app-sidebar" style={{ width: sidebarWidth }}>
        <div className="app-sidebar-content">
          <TreeMenu />
        </div>
        <div className="app-sidebar-resizer" onMouseDown={startResizing} />
      </div>
      <main className="app-frame">
        <Toolbar />
        <Outlet />
      </main>
    </div>
  );
};

export default ProjectLayout;
