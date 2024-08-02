import { Outlet } from "react-router-dom";

import HeaderNav from "../components/HeaderNav";
import Footer from "../components/Footer";
import "../index.css";

const BaseLayout = () => (
  <div className="main-layout">
    <HeaderNav />

    <main className="content-wrapper">
      <Outlet />
    </main>

    <Footer />
  </div>
);

export default BaseLayout;
