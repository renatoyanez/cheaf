import { useState, useEffect } from "react";
import ProductCard from "../components/productCard";
import { useAuth } from "../context/authContext";
import { Roles } from "../enums/auth";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
// import classes from "./products.module.css";
import { useProducts } from "../context/productsContext";

const Products = () => {
  const { products } = useProducts();

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {products.map((product) => (
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
