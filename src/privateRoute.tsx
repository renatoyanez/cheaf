import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/authContext";

const PrivateRoute = ({ element }: { element: ReactNode }) => {
  const { isUserLoggedIn } = useAuth();
  const location = useLocation();
  console.log({location});
  
  if (!isUserLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return element;
};

export default PrivateRoute;
