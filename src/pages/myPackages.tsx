import React, { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { usePackages } from "../hooks/usePackages";
import { Product } from "../types/products";

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme }) => ({
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: "rotate(0deg)",
      },
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: "rotate(180deg)",
      },
    },
  ],
}));

const myPackages = () => {
  const { packages, addPackage, updatePackage, deletePackage } = usePackages();

  const [expanded, setExpanded] = React.useState(false);
  const [expandedPackage, setExpandedPackage] = useState("");

  const handleExpandClick = (selectedPackageId: string) => {
    setExpandedPackage(selectedPackageId);
    setExpanded(!expanded);
  };

  const calculatePackagePrice = (products: Product[]) => {
    return products.reduce((accumulator, product) => {
      return accumulator + product.price;
    }, 0);
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

  return (
    <>
      <Typography variant="h5" component="div">
        My Packages
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {packages.map((currentPackage) => {
            const packPrice = calculatePackagePrice(currentPackage.products);

            return (
              <Grid
                key={currentPackage.packageId}
                size={{ xs: 2, sm: 4, md: 4 }}
              >
                {/* <Box sx={{ maxWidth: 275 }}> */}
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      gutterBottom
                      sx={{ color: "text.secondary", fontSize: 14 }}
                    >
                      {currentPackage.packageName || "Unnamed Package"}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {currentPackage.packageName || "Unnamed Package"}
                    </Typography>
                    <Typography variant="body2">
                      {currentPackage.products.length} Product
                      {currentPackage.products.length > 1 ? "s" : ""} Added
                    </Typography>
                  </CardContent>
                  <CardActions
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deletePackage(currentPackage.packageId)}
                      size="small"
                      startIcon={<DeleteIcon />}
                    >
                      Remove Package
                    </Button>
                    <Typography>Price: ${packPrice}</Typography>
                    <ExpandMore
                      expand={
                        expandedPackage === currentPackage.packageId && expanded
                      }
                      onClick={() =>
                        handleExpandClick(currentPackage.packageId)
                      }
                      aria-expanded={
                        expandedPackage === currentPackage.packageId && expanded
                      }
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>

                  <Collapse
                    in={
                      expandedPackage === currentPackage.packageId && expanded
                    }
                    timeout="auto"
                    unmountOnExit
                  >
                    <CardContent>
                      <MenuList>
                        {currentPackage.products.map((eachProd) => {
                          return (
                            <MenuItem disableGutters divider>
                              <img
                                style={{ width: "52px" }}
                                src={eachProd.thumbnail}
                                alt="Product thumbnail"
                              />
                              <ListItemText>{eachProd.title}</ListItemText>
                              <Typography
                                variant="body2"
                                sx={{ color: "text.secondary" }}
                              >
                                ${eachProd.price}
                              </Typography>
                              <IconButton
                                onClick={() =>
                                  handleRemoveProductFromPackage(
                                    currentPackage.products,
                                    eachProd.id,
                                    currentPackage.packageId
                                  )
                                }
                                color="error"
                                aria-label="delete"
                              >
                                <DeleteOutlineOutlinedIcon />
                              </IconButton>
                            </MenuItem>
                          );
                        })}
                      </MenuList>
                    </CardContent>
                  </Collapse>
                </Card>
                {/* </Box> */}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

export default myPackages;
