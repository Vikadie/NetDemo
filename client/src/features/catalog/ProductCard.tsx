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
// import { useState } from "react";
import { Link } from "react-router-dom";
// import agent from "../../app/http/agent";
import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import {
    addBasketItemAsync,
    // setBasket // needed when using the normal function
} from "../basket/basketSlice";
import ProductCardSkeleton from "./ProductFileSkeleton";
// import { useStoreContext } from "../../app/ctx/StoreCtx";

const ProductCard = ({ product }: { product: Product }) => {
    // const {setBasket} = useStoreContext(); // using context
    // using Redux store
    const dispatch = useAppDispatch();
    // const [loading, setLoading] = useState(false); // not needed when using the redux thunk

    // const handleAddItem = (productId: number) => { // old function when no Redux is needed replace dispatch(addBasketItemAsync(...))
    //     setLoading(true);
    //     agent.Basket.addItem(productId)
    //         .then(basket => dispatch(setBasket(basket)))
    //         .catch((err) => console.log(err))
    //         .finally(() => setLoading(false));
    // };

    const { status } = useAppSelector((state) => state.basket);

    const { productsLoaded } = useAppSelector((state) => state.catalog);

    return (
        <Grid item xs={4}>
            {!productsLoaded ? (
                <ProductCardSkeleton />
            ) : (
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
                        <LoadingButton
                            size="small"
                            onClick={() => dispatch(addBasketItemAsync({ productId: product.id }))}
                            loading={status === ("pendingAddItem" + product.id)}
                        >
                            Add to Card
                        </LoadingButton>
                        <Button size="small" component={Link} to={`${product.id}`}>
                            View
                        </Button>
                    </CardActions>
                </Card>
            )}
        </Grid>
    );
};

export default ProductCard;
