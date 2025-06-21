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
  const { packages, handleAddToPackage, addPackage } = usePackages();
  console.log({ packages });

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
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": "basic-button",
              },
            }}
          >
            {packages.length
              ? packages.map((eachPackage, i) => {
                  const productIsInPackage = checkProductExistsInCurrentPackage(
                    eachPackage,
                    product.id
                  );

                  const packageName = eachPackage.packageName?.length
                    ? eachPackage.packageName
                    : `Unnamed package ${i + 1}`;

                  const optionText = productIsInPackage
                    ? "- Remove from"
                    : "+ Add to";
                  return (
                    <MenuItem
                      key={eachPackage.packageId}
                      sx={{ color: productIsInPackage ? "red" : "green" }}
                      onClick={() =>
                        handleAddToPackage(product, eachPackage.packageId)
                      }
                    >
                      {`${optionText} ${packageName}`}
                    </MenuItem>
                  );
                })
              : null}
            <MenuItem onClick={handleClickOpenPackageName}>
              + Add to a new package
            </MenuItem>
            <Dialog
              open={openPackageName}
              onClose={handleClosePackageName}
              fullWidth
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Name your package
              </DialogTitle>
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
