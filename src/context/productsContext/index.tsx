import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { Product } from "../../types/products";
import { useAuth } from "../authContext";
import { filterProductsByRoles } from "../../helpers/products";

type ProductsContextType = {
  products: Product[];
  loading: boolean;
  error: string | null;
  setFilteredProducts: (filtered: Product[]) => void;
  resetProducts: () => void;
};

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const { currentRole } = useAuth();

  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductsFromAPI();
  }, []);

  const fetchProductsFromAPI = () => {
    fetch("https://dummyjson.com/products/category/groceries")
      .then((res) => res.json())
      .then((data) => {

        const filteredDataList = filterProductsByRoles(
          [currentRole],
          data.products
        );

        setOriginalProducts(filteredDataList);
        setFilteredProducts(filteredDataList);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const setFilteredProducts = useCallback((filtered: Product[]) => {
    setProducts(filtered);
  }, []);

  const resetProducts = useCallback(() => {
    setProducts(originalProducts);
  }, [originalProducts]);

  const value = useMemo(
    () => ({
      products,
      loading,
      error,
      setFilteredProducts,
      resetProducts,
    }),
    [products, loading, error, setFilteredProducts, resetProducts]
  );
  // to be used like: setFilteredProducts([...newFilteredProductsList])

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context)
    throw new Error("useProducts must be used within a ProductsProvider");
  return context;
};
