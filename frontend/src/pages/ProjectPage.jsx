import React from "react";
import Layout from "./Layout";
import { useParams } from "react-router-dom";

import { Inputs } from "../components/Inputs";

const ProjectPage = () => {
  const { activeInputForm, nodeKey } = useParams();

  return (
    <Layout>
      <Inputs activeInputForm={activeInputForm} nodeKey={nodeKey} />
    </Layout>
  );
};

export default ProjectPage;
