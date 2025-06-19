import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/navbar";
import "../App.css";

const MainLayout = () => {

  return (
    <>
      <Navbar />
      <div className="app-container">
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
