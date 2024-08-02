import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";

import ProjectPage from "./pages/ProjectPage";
import ErrorPage from "./pages/ErrorPage";
import ResultsPage from "./pages/ResultsPage";
import BaseLayout from "./app/BaseLayout";
import ProjectLayout from "./app/ProjectLayout";
import { store } from "./app/store";
import "./index.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<BaseLayout />}>
      {/* Placeholder for landing page */}
      {/* <Route index element={<ProjectLayout />} /> */}
      <Route path="project" element={<ProjectLayout />}>
        <Route index element={<ProjectLayout />} />
        <Route path="node/:existingNodeKey" element={<ProjectPage />} />
        <Route path="add/:newNodeType" element={<ProjectPage />} />
        <Route path="results" element={<ResultsPage />}></Route>
        <Route path="*" element={<ErrorPage />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Route>
  )
);

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default App;
