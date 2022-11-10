import { List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

const ProductList = ({ products }: { products: Product[] }) => {
    return (
        <List>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </List>
    );
};

export default ProductList;
