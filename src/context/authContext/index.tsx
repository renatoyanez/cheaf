import React, { useEffect, useState, useContext } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { Roles } from "../../enums/auth";
import { doc, getDoc } from "firebase/firestore";

interface IUser {
  currentUser: User;
  isUserLoggedIn: boolean;
  loading: boolean;
  currentRole: Roles;
}

const AuthContext = React.createContext({} as IUser);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: { children: any }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState(Roles.USER);

  const initializeUser = async (user: User | null) => {
    setLoading(true);

    if (user) {
      setCurrentUser({ ...user });
      setIsUserLoggedIn(true);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.exists() ? userDoc.data().role : Roles.USER;
      setCurrentRole(role);
      localStorage.setItem("role", JSON.stringify(role));
      setLoading(false);
    } else {
      setCurrentRole(Roles.VISITOR);
      setCurrentUser(null);
      setIsUserLoggedIn(false);
      localStorage.setItem("role", JSON.stringify(Roles.VISITOR));
      setLoading(false);
    }

    setLoading(false);
  };

  const value = {
    currentUser,
    isUserLoggedIn,
    loading,
    currentRole,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
