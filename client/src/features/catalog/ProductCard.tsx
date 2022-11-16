import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    CardHeader,
    Avatar,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { Link } from "react-router-dom";
import agent from "../../app/http/agent";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setBasket } from "../basket/basketSlice";
// import { useStoreContext } from "../../app/ctx/StoreCtx";

const ProductCard = ({ product }: { product: Product }) => {
    // const {setBasket} = useStoreContext(); // using context
    // using Redux store
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);

    const handleAddItem = (productId: number) => {
        setLoading(true);
        agent.Basket.addItem(productId)
            .then(basket => dispatch(setBasket(basket)))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    };
    return (
        <Grid item xs={3}>
            <Card>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: "secondary.light" }}>
                            {product.name.charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    title={product.name}
                    titleTypographyProps={{
                        sx: { fontWeight: "bold", color: "primary.main" },
                    }}
                />
                <CardMedia
                    image={product.pictureUrl}
                    sx={{ height: 140, backgroundSize: "contain", bgcolor: "grey.400" }}
                    title={product.name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" color="secondary">
                        {(product.price / 100).toFixed(2)} BGN
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {product.brand} / {product.type}
                    </Typography>
                </CardContent>
                <CardActions>
                    <LoadingButton size="small" onClick={() => handleAddItem(product.id)} loading={loading}>
                        Add to Card
                    </LoadingButton>
                    <Button size="small" component={Link} to={`${product.id}`}>
                        View
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default ProductCard;
