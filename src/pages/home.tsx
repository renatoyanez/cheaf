import React from "react";
import { useAuth } from "../context/authContext";

const Home = () => {
  const { currentUser, currentRole } = useAuth();
  return (
    <div>
      Hello{" "}
      {currentUser.displayName ? currentUser.displayName : currentUser.email},
      you are now logged in.
    </div>
  );
};

export default Home;
