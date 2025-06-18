import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/navbar";
import { useAuth } from "../context/authContext";
import "../App.css";

const MainLayout = () => {
  const { currentRole, isUserLoggedIn } = useAuth();
  // Los necesitas para pasarle al navbar y setear Logout o Login
  // Tambien para mostrar el link a los paquetes dependiendo del rol

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
