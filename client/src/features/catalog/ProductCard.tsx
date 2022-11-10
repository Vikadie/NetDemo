import {ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { Product } from "../../app/models/product";

const ProductCard = ({ product }: {product: Product}) => {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar src={product.pictureUrl}></Avatar>
            </ListItemAvatar>
            <ListItemText>
                {product.name} - {product.price}
            </ListItemText>
        </ListItem>
    );
};

export default ProductCard;
