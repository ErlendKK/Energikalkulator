import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ProjectPage from "../pages/ProjectPage";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/project/add/:activeInputForm" element={<Inputs />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/projects/:projectId/" element={<ProjectPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
