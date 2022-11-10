import { Grid } from "@mui/material";
import { Product } from "../../app/models/product";
import ProductCard from "./ProductCard";

const ProductList = ({ products }: { products: Product[] }) => {
    return (
        <Grid container spacing={4}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </Grid>
    );
};

export default ProductList;
