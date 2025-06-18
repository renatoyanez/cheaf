import { useRoutes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import PrivateRoute from "./privateRoute";
import { AuthProvider } from "./context/authContext";
import MainLayout from "./layouts/mainLayout";
import ProductsLayout from './layouts/productsLayout'
import "./App.css";

const App = () => {
  const routesArray = [
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "home",
          element: <PrivateRoute element={<Home />} />,
        },
        {
          path: "products",
          element: <ProductsLayout />,
        },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "*", element: <Login /> },
  ];

  const routesElement = useRoutes(routesArray);

  return <AuthProvider>{routesElement}</AuthProvider>;
};

export default App;
