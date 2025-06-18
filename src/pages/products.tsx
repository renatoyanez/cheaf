import { useState, useEffect } from "react";
import ProductCard from "../components/productCard";
import { useAuth } from "../context/authContext";
import { Roles } from "../enums/auth";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import classes from "./products.module.css";

const Products = () => {
  const { currentRole } = useAuth();

  const [productsList, setProductsList] = useState([]);

  const handleGetProducts = async () => {
    return await fetch("https://dummyjson.com/products/category/groceries")
      .then((response) => response.json())
      .then((data) => {
        filterProductsByRole(currentRole, data?.products || []);
      });
  };

  useEffect(() => {
    handleGetProducts();
    return () => {
      setProductsList([]);
    };
  }, []);

  const filterProductsByRole = (role: string, list: any[]) => {
    if (role === Roles.VEGAN) {
      const noAnimalOriginList = list.filter(
        (product) =>
          !product.tags.some((tag: string) =>
            ["meat", "seafood", "dairy"].includes(tag.toLowerCase())
          )
      );
      setProductsList(noAnimalOriginList);
    } else {
      setProductsList(list);
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {productsList.map((product) => (
            <Grid key={product.id} size={{ xs: 2, sm: 4, md: 4 }}>
              <ProductCard
                title={product.title}
                description={product.description}
                images={product.images}
                price={product.price}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Products;
