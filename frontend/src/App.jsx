import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import ProjectPage from "./pages/ProjectPage";
// import HomePage from "./pages/HomePage";
import { store } from "./store";
import "./index.css";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/project/node/:nodeKey" element={<ProjectPage />} />
          <Route path="/project/add/:activeInputForm" element={<ProjectPage />} />
          <Route path="/" element={<ProjectPage />} /> {/* Placeholder for landing page */}
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
