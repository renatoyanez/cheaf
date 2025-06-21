import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Package } from "../../types/package";
import { Product } from "../../types/products";

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
};

interface IPackagesProviderProps {
  userId: string;
  children: ReactNode;
  userEmail: string;
}

export const PackagesContext = createContext<PackagesContextType | null>(null);

export const PackagesProvider = ({
  userId,
  children,
  userEmail,
}: IPackagesProviderProps) => {
  const [packages, setPackages] = useState<Package[]>([]);

  const loadPackages = async () => {
    const ref = collection(db, "users", userId, "packages");
    const snapshot = await getDocs(ref);
    const result = snapshot.docs.map((doc) => ({
      packageId: doc.id,
      ...doc.data(),
    })) as Package[];
    setPackages(result);
  };

  const addPackage = async (newPackage: Omit<Package, "packageId">) => {
    const ref = collection(db, "users", userId, "packages");
    const docRef = await addDoc(ref, { ...newPackage, createdAt: new Date() });

    const packageName = newPackage.packageName?.length
      ? newPackage.packageName
      : `Unnamed package ${packages.length}`;
    setPackages((prev) => [
      ...prev,
      {
        ...newPackage,
        packageId: docRef.id,
        packageName,
      },
    ]);
  };

  const updatePackage = async (
    id: string,
    updates: Partial<Package>
  ): Promise<void> => {
    const ref = doc(db, "users", userId, "packages", id);
    await updateDoc(ref, updates);
    setPackages((prev) =>
      prev.map((pack) =>
        pack.packageId === id ? { ...pack, ...updates } : pack
      )
    );
  };

  const deletePackage = async (id: string): Promise<void> => {
    const ref = doc(db, "users", userId, "packages", id);
    await deleteDoc(ref);
    setPackages((prev) => prev.filter((pkg) => pkg.packageId !== id));
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

  useEffect(() => {
    if (userId) loadPackages();
  }, [userId]);

  return (
    <PackagesContext.Provider
      value={{
        packages,
        loadPackages,
        addPackage,
        updatePackage,
        deletePackage,
        handleAddToPackage,
      }}
    >
      {children}
    </PackagesContext.Provider>
  );
};
