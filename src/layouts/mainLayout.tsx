import { Outlet } from "react-router-dom";
import { PackagesProvider } from "../context/packagesContext";
import { useAuth } from "../context/authContext";
import Navbar from "../components/shared/navbar";
import "../App.css";

const MainLayout = () => {
  const { currentUser } = useAuth();

  return (
    <PackagesProvider
      userId={currentUser?.uid || ""}
      userEmail={currentUser?.email || ""}
    >
      <Navbar />
      <div className="app-container">
        <Outlet />
      </div>
    </PackagesProvider>
  );
};

export default MainLayout;
