import { useContext } from "react";
import { PackagesContext } from "../context/packagesContext";

export const usePackages = () => {
  const context = useContext(PackagesContext);
  if (!context) {
    throw new Error("usePackages unavailable, there's no PackagesProvider");
  }
  return context;
};