import HeaderNav from "../components/HeaderNav";
import Footer from "../components/Footer";
import SidebarNav from "../components/SidebarNav";
import Toolbar from "../components/Toolbar";
import "../index.css";

const Layout = ({ children }) => (
  <div className="main-layout">
    <HeaderNav />
    <div className="content-wrapper">
      <SidebarNav />
      <main
        className="flex-grow-1 p-3"
        style={{
          marginLeft: "200px",
          transition: "margin-left .15s",
        }}
      >
        <Toolbar />
        {children}
      </main>
    </div>
    <Footer />
  </div>
);

export default Layout;
