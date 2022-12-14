import { LoadingButton } from "@mui/lab";
import {
    Divider,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { useStoreContext } from "../../app/ctx/StoreCtx";
import NotFound from "../../app/errors/NotFound";
// import agent from "../../app/http/agent";
import Loading from "../../app/layout/Loading";
// import { Product } from "../../app/models/product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync, 
    // setBasket 
} from "../basket/basketSlice";
import { fetchProductAsync, productSelectors } from "./catalogSlice";

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    // const { basket, setBasket, removeItem } = useStoreContext(); // using context
    // using Redux toolkit useSelector, or customly predefined useAppSelector
    const { basket, status } = useAppSelector((state) => state.basket);
    const dispatch = useAppDispatch();

    // const [product, setProduct] = useState<Product | null>(null); // not needed with Redux
    const product = useAppSelector((state) => productSelectors.selectById(state, id!));
    const { status: productStatus } = useAppSelector((state) => state.catalog);
    const [quantity, setQuantity] = useState(0);
    // const [submitting, setSubmitting] = useState(false); //used only without Redux thunk for API requests

    const item = basket?.items.find((i) => i.productId === product?.id);

    // const [loading, setLoading] = useState(true); // replaced by status from catalogue

    useEffect(() => {
        if (item) {
            setQuantity(item.quantity);
        }
        if (!product) {
            dispatch(fetchProductAsync(parseInt(id!)));
        }
        // setLoading(true);
        // agent.Catalog.details(id ? +id : 0)
        //     .then(setProduct)
        //     .catch((err) => console.log(err))
        //     .finally(() => setLoading(false));
    }, [id, item, product, dispatch]);

    function handleUpdateCart() {
        if (!item || quantity > item.quantity) {
            const updatedQ = item ? quantity - item.quantity : quantity;
            dispatch(addBasketItemAsync({ productId: product!.id, quantity: updatedQ }));
        } else {
            const updatedQ = item.quantity - quantity;
            dispatch(removeBasketItemAsync({ productId: item.productId, quantity: updatedQ }));
        }
    }

    // function handleUpdateCart() { //used in this version only without Redux thunk for API requests
    //     setSubmitting(true);
    //     // item.quantity is the initial value
    //     if (item) {
    //         if (quantity > item.quantity) {
    //             agent.Basket.addItem(item.productId, quantity - item.quantity)
    //                 .then(basket => dispatch(setBasket(basket)))
    //                 .catch((err) => console.log(err))
    //                 .finally(() => setSubmitting(false));
    //         } else if (quantity < item.quantity) {
    //             agent.Basket.removeItem(item.productId, item.quantity - quantity)
    //                 .then(() => dispatch(removeItem({productId: item.productId, quantity: item.quantity - quantity})))
    //                 .catch((err) => console.log(err))
    //                 .finally(() => setSubmitting(false));
    //         }
    //     } else {
    //         if (quantity > 0 && product) {
    //             agent.Basket.addItem(product?.id, quantity)
    //                 .then(setBasket)
    //                 .catch((err) => console.log(err))
    //                 .finally(() => setSubmitting(false));
    //         }
    //     }
    // }

    if (productStatus === 'pendingFetchProducts') {
        return <Loading message="Loading product..." />;
    }

    if (!product) {
        return <NotFound />;
    }

    return (
        <Grid container spacing={6}>
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{ width: "100%" }} />
            </Grid>
            <Grid item xs={6}>
                <Typography variant="h3">{product.name}</Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h5" color={"secondary"}>
                    {(product.price / 100).toFixed(2)} BGN
                </Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Brand</TableCell>
                                <TableCell>{product.brand}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Quantity in stock</TableCell>
                                <TableCell>{product.quantityInStock}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <TextField
                            variant="outlined"
                            type="number"
                            label="Quantity in Cart"
                            fullWidth
                            value={quantity}
                            onChange={(e) => +e.target.value >= 0 && setQuantity(+e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <LoadingButton
                            sx={{ height: "55px" }}
                            size="large"
                            color="primary"
                            variant="contained"
                            fullWidth
                            loading={status.includes("pending")}
                            onClick={handleUpdateCart}
                            disabled={(!item && quantity === 0) || item?.quantity === quantity}
                        >
                            {item ? "Update Quantity" : "Add to Cart"}
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
