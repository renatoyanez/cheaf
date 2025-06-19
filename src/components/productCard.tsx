import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import { createPackage } from "../firebase/packages";
import { Product } from "../types/products";

interface IProductCardProps {
  title?: string;
  description?: string;
  images?: string | string[];
  price?: number;
  isAddedToCart?: boolean;
}

const ProductCard: React.FC<IProductCardProps> = ({
  title,
  description,
  images,
  price,
  isAddedToCart,
}) => {
  const [packageName, setPackageName] = useState("");

  const handleAddToPackage = (product: Product) => {};
  return (
    <Card sx={{ maxWidth: 345 }}>
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
        title={title}
        // subheader={price}
      />
      <CardMedia
        component="img"
        height="194"
        image={images.length ? images[0] : ""}
        alt={title}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {isAddedToCart ? (
          <IconButton aria-label="add or remove from package">
            <RemoveShoppingCartIcon />
          </IconButton>
        ) : (
          <IconButton aria-label="add or remove from package">
            <ShoppingCartIcon />
          </IconButton>
        )}
        <Typography variant="h6">${price}</Typography>
      </CardActions>
    </Card>
  );
};
export default ProductCard;
