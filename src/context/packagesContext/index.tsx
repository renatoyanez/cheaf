import { createContext, useEffect, useState, ReactNode } from "react";
import { Package } from "../../types/package";
import { Product } from "../../types/products";
import {
  dbLoadPackages,
  dbAddPackage,
  dbUpdatePackage,
  dbDeletePackage,
} from "../../firebase/packages";
import { Roles } from "../../enums/auth";

type PackagesContextType = {
  packages: Package[];
  loadPackages: () => Promise<void>;
  addPackage: (pkg: Omit<Package, "packageId">) => Promise<void>;
  updatePackage: (id: string, updates: Partial<Package>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  handleAddToPackage: (
    newProduct: Product,
    packageId?: string
  ) => Promise<void>;
  canAddPackage: boolean;
  handleRemoveProductFromPackage: (
    currentPackageProducts: Product[],
    productId: number,
    packageId: string
  ) => void;
  canAddProducts: boolean;
  isPackageIsFullByRole: (currentPackage: Package) => boolean;
};

interface IPackagesProviderProps {
  userId: string;
  children: ReactNode;
  userEmail: string;
  userRole: Roles;
}

export const PackagesContext = createContext<PackagesContextType | null>(null);

export const PackagesProvider = ({
  userId,
  children,
  userEmail,
  userRole,
}: IPackagesProviderProps) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [canAddPackage, setCanAddPackage] = useState(true);
  const [canAddProducts, setCanAddProducts] = useState(true);

  const loadPackages = async () => {
    try {
      const result = await dbLoadPackages(userId);
      setPackages(result);
    } catch (err) {
      console.error("Failed to load packages:", err);
    }
  };

  const addPackage = async (newPackage: Omit<Package, "packageId">) => {
    if (canAddPackage) {
      const result = await dbAddPackage(newPackage, userId, packages);
      setPackages((prev) => [...prev, result]);
    }
  };

  const updatePackage = async (
    packageId: string,
    updates: Partial<Package>
  ): Promise<void> => {
    const currentPackage = packages.find(
      (pack) => pack.packageId === packageId
    );

    if (currentPackage) {
      await dbUpdatePackage(userId, packageId, updates).then(() => {
        setPackages((prev) =>
          prev.map((pack) =>
            pack.packageId === packageId ? { ...pack, ...updates } : pack
          )
        );
      });
      if (isPackageIsFullByRole(currentPackage)) {
      }
      setCanAddProducts(false);
    }
  };

  const deletePackage = async (packageId: string): Promise<void> => {
    await dbDeletePackage(userId, packageId);
    setPackages((prev) => prev.filter((pkg) => pkg.packageId !== packageId));
  };

  const handleRemoveProductFromPackage = (
    currentPackageProducts: Product[],
    productId: number,
    packageId: string
  ) => {
    const updatedListOfProducts = currentPackageProducts.filter(
      (prod) => prod.id !== productId
    );
    updatePackage(packageId, { products: [...updatedListOfProducts] });
  };

  const handleAddToPackage = async (
    newProduct: Product,
    packageId?: string,
    packageName?: string
  ) => {
    if (!packages.length) {
      addPackage({
        packageName,
        email: userEmail,
        products: [newProduct],
      });
    } else {
      const selectedPackage = packages.find(
        (pack) => pack.packageId === packageId
      );
      if (typeof selectedPackage != "undefined") {
        const packageId = selectedPackage.packageId;
        const productExistsInSelectedPackage = selectedPackage.products.some(
          (p) => p.id === newProduct.id
        );

        if (productExistsInSelectedPackage) {
          updatePackage(packageId, {
            products: [...selectedPackage.products, newProduct],
          });
        } else {
          deletePackage(packageId);
        }
      }
    }
  };

  const isPackageIsFullByRole = (currentPackage: Package) => {
    return (
      currentPackage.products.length >= (userRole === Roles.FREQUENT ? 7 : 4)
    );
  };

  useEffect(() => {
    // Only frequent clients can have more than 3 packages
    // and 7 tops. The rest can have up to 3
    if (userRole != Roles.FREQUENT) {
      if (packages.length <= 2) {
        setCanAddPackage(true);
      } else {
        setCanAddPackage(false);
      }
    } else {
      if (packages.length <= 6) {
        setCanAddPackage(true);
      } else {
        setCanAddPackage(false);
      }
    }
  }, [userRole, packages.length]);

  useEffect(() => {
    if (userId && userRole) {
      loadPackages();
    }
  }, [userId, userRole]);

  return (
    <PackagesContext.Provider
      value={{
        packages,
        loadPackages,
        addPackage,
        updatePackage,
        deletePackage,
        handleAddToPackage,
        handleRemoveProductFromPackage,
        canAddPackage,
        canAddProducts,
        isPackageIsFullByRole,
      }}
    >
      {children}
    </PackagesContext.Provider>
  );
};
