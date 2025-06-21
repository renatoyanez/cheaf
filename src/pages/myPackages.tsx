import React, { useState, useEffect } from "react";
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
import { useAuth } from "../context/authContext";
import { Roles } from "../enums/auth";
import { createInternalPackageIfNeeded } from "../firebase/packages";

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
  const { currentRole, currentUser } = useAuth();
  const {
    packages,
    deletePackage,
    loadPackages,
    canAddPackage,
    handleRemoveProductFromPackage,
  } = usePackages();

  const [expanded, setExpanded] = React.useState(false);
  const [expandedPackage, setExpandedPackage] = useState("");
  const [canHaveSpecialPackage, setCanHaveSpecialPackage] = useState(false);
  const [hasSpecialPackage, setHasSpecialPackage] = useState(false);

  const handleExpandClick = (selectedPackageId: string) => {
    setExpandedPackage(selectedPackageId);
    setExpanded(!expanded);
  };

  const calculatePackagePrice = (products: Product[]) => {
    return products.reduce((accumulator, product) => {
      return accumulator + product.price;
    }, 0);
  };

  const handleCreateSpecialPackage = async () => {
    await createInternalPackageIfNeeded(currentUser.uid, currentUser.email)
      .then(() => {
        setHasSpecialPackage(true);
        setCanHaveSpecialPackage(false);
      })
      .then(() => {
        loadPackages();
      })
      .catch((err) => console.log(err, "Error creating special package"));
  };

  useEffect(() => {
    if (currentRole === Roles.INTERNAL && !hasSpecialPackage && canAddPackage) {
      setCanHaveSpecialPackage(true);
    }
  }, [currentRole, hasSpecialPackage, canAddPackage]);

  useEffect(() => {
    const alreadyHasSpecialPack = packages.some(
      (pack) => pack.isInternal === true
    );
    if (currentRole === Roles.INTERNAL && alreadyHasSpecialPack) {
      setHasSpecialPackage(true);
    }

    if (!canAddPackage) {
      setCanHaveSpecialPackage(false);
    }
  }, [currentRole, packages, packages.length, canAddPackage]);

  return (
    <>
      <Typography variant="h5" component="div">
        My Packages
      </Typography>

      {canHaveSpecialPackage && !hasSpecialPackage && canAddPackage ? (
        <Button
          variant="outlined"
          onClick={() => handleCreateSpecialPackage()}
          size="small"
        >
          Add special Package (Only for Internals)
        </Button>
      ) : null}

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
                    <Typography>Price: ${packPrice.toFixed(2)}</Typography>
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
                            <MenuItem key={eachProd.id} disableGutters divider>
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
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </>
  );
};

export default myPackages;
