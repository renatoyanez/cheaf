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
import { useAuth } from '../authContext'

type ProductsContextType = {
  products: Product[];
  loading: boolean;
  error: string | null;
  setFilteredProducts: (filtered: Product[]) => void;
  resetProducts: () => void;
};

const LOCAL_STORAGE_KEY = "products_data";

const ProductsContext = createContext<ProductsContextType | undefined>(
  undefined
);

export const ProductsProvider = ({ children }: { children: ReactNode }) => {
  const { currentRole } = useAuth();
  console.log(currentRole);
  
  const [originalProducts, setOriginalProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Product[];
        setOriginalProducts(parsed);
        setProducts(parsed);
        setLoading(false);
      } catch (err) {
        console.error("Error parsing localStorage data", err);
        fetchProductsFromAPI();
      }
    } else {
      fetchProductsFromAPI();
    }
  }, []);

  const fetchProductsFromAPI = () => {
    fetch("https://dummyjson.com/products/category/groceries")
      .then((res) => res.json())
      .then((data) => {
        setOriginalProducts(data);
        setProducts(data);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
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
