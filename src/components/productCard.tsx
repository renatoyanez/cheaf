import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Product } from "../types/products";
import { Package } from "../types/package";
import { useAuth } from "../context/authContext";
import { usePackages } from "../hooks/usePackages";

interface IProductCardProps {
  product: Product;
}

const ProductCard: React.FC<IProductCardProps> = ({ product }) => {
  const { currentUser } = useAuth();
  const {
    packages,
    addPackage,
    updatePackage,
    handleRemoveProductFromPackage,
    canAddPackage,
    isPackageIsFullByRole,
  } = usePackages();

  const [packageName, setPackageName] = useState("Unnamed package");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openPackageName, setOpenPackageName] = React.useState(false);

  const handleClickOpenPackageName = () => {
    setOpenPackageName(true);
  };

  const handleClosePackageName = () => {
    setOpenPackageName(false);
  };
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const checkProductExistsInCurrentPackage = (
    currentPackage: Package,
    productId: number
  ) => {
    return currentPackage.products.some((product) => product.id === productId);
  };

  const handleCreatePackage = () => {
    addPackage({
      packageName: packageName,
      email: currentUser.email,
      products: [product],
    })
      .then(() => handleClosePackageName())
      .catch((err) => console.log(err));
  };

  const handleAddOrRemoveProduct = (
    productIsInPackage: boolean,
    currentPack?: Package,
    newProduct?: Product
  ) => {    
    if (productIsInPackage) {
      handleRemoveProductFromPackage(
        currentPack.products,
        newProduct.id,
        currentPack.packageId
      );
    } else {
      updatePackage(currentPack.packageId, {
        products: [...currentPack.products, newProduct],
      });
    }
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={product.title}
      />
      <CardMedia
        component="img"
        height="194"
        image={product.images.length ? product.images[0] : ""}
        alt={product.title}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {product.description}
        </Typography>
      </CardContent>
      <CardActions
        sx={{ display: "flex", justifyContent: "space-between" }}
        disableSpacing
      >
        <>
          <Tooltip title="Add to a package">
            <IconButton
              aria-label="add or remove from package"
              onClick={handleClick}
            >
              <ShoppingBasketIcon />
            </IconButton>
          </Tooltip>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            {packages.length
              ? packages.map((eachPackage, i) => {
                  const productIsInPackage = checkProductExistsInCurrentPackage(
                    eachPackage,
                    product.id
                  );

                  const isPackageFull = isPackageIsFullByRole(eachPackage);

                  const packageName = eachPackage.packageName?.length
                    ? eachPackage.packageName
                    : `Unnamed package ${i + 1}`;

                  let optionText: string;
                  let textColor: string;

                  if (productIsInPackage) {
                    optionText = "- Remove from";
                    textColor = "red";
                  } else if (isPackageFull) {
                    optionText = "(Full Package)";
                    textColor = "GrayText";
                  } else {
                    optionText = "+ Add to";
                    textColor = "green";
                  }

                  return (
                    <MenuItem
                      key={eachPackage.packageId}
                      sx={{ color: textColor }}
                      onClick={() =>
                        handleAddOrRemoveProduct(
                          productIsInPackage,
                          eachPackage,
                          product
                        )
                      }
                    >
                      {`${optionText} ${packageName}`}
                    </MenuItem>
                  );
                })
              : null}
            {canAddPackage ? (
              <MenuItem onClick={handleClickOpenPackageName}>
                + Add to a new package
              </MenuItem>
            ) : (
              <MenuItem sx={{ color: "GrayText" }}>
                You reach your limit of packages
              </MenuItem>
            )}
            <Dialog
              open={openPackageName}
              onClose={handleClosePackageName}
              fullWidth
            >
              <DialogTitle>Name your package</DialogTitle>
              <DialogContent>
                <TextField
                  sx={{ marginTop: "12px" }}
                  fullWidth
                  label="Package Name"
                  value={packageName}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPackageName(event.target.value);
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button
                  variant="outlined"
                  disabled={!packageName.length}
                  onClick={() => handleCreatePackage()}
                >
                  Accept
                </Button>
              </DialogActions>
            </Dialog>
          </Menu>
        </>

        <Typography variant="h6">${product.price}</Typography>
      </CardActions>
    </Card>
  );
};
export default ProductCard;
