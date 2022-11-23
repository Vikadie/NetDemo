import { Add, Delete, Remove } from "@mui/icons-material";
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    // IconButton,
    Box,
    Grid,
    Button,
} from "@mui/material";
// import { useStoreContext } from "../../app/ctx/StoreCtx";
import Typography from "@mui/material/Typography";
// import {
//     // useEffect,
//     useState,
// } from "react";
// import agent from "../../app/http/agent";
import { LoadingButton } from "@mui/lab";
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync, 
//    setBasket 
} from "./basketSlice";
// import Loading from "../../app/layout/Loading";
// import { Basket } from "../../app/models/basket";

const BasketPage = () => {
    // const { basket, setBasket, removeItem } = useStoreContext();
    // using Redux toolkit useSelector, or customly predefined useAppSelector
    const { basket, status } = useAppSelector((state) => state.basket);
    const dispatch = useAppDispatch();
    // const [status, setStatus] = useState<{ loading: boolean; id: string }>({
    //     loading: false,
    //     id: "",
    // });

    // const handleAddItem = (action: string, productId: number) => {
    //     setStatus({ loading: true, id: action + productId });
    //     agent.Basket.addItem(productId)
    //         .then(basket => dispatch(setBasket(basket)))
    //         .catch((err) => console.log(err))
    //         .finally(() =>
    //             setStatus({
    //                 loading: false,
    //                 id: "",
    //             })
    //         );
    // };
    // const handleRemoveItem = (action: string, productId: number, quantity = 1) => {
    //     setStatus({ loading: true, id: action + productId });
    //     agent.Basket.removeItem(productId, quantity)
    //         .then(() => dispatch(removeItem({productId, quantity})))
    //         // removeItem from context or dispatch(removeItem) from Redux are used as agent.Basket.removeItem from API deletes on the server, but doesn't return anything
    //         .catch((err) => console.log(err))
    //         .finally(() =>
    //             setStatus({
    //                 loading: false,
    //                 id: "",
    //             })
    //         );
    // };
    // below code is not needed if we take the baske from the context
    // const [loading, setLoading] = useState(true);
    // const [basket, setBasket] = useState<Basket | null>(null);

    // useEffect(() => {
    //     setLoading(true);
    //     agent.Basket.getBasket()
    //         .then(setBasket)
    //         .catch((err) => console.log(err))
    //         .finally(() => setLoading(false));
    // }, []);

    // if (loading) return <Loading message="Loading basket..." />;

    if (!basket || basket.items.length === 0)
        return <Typography variant="h3">Your Basket is empty</Typography>;

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Products</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Quantity</TableCell>
                            <TableCell align="right">Subtotal</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {basket.items.map((item) => (
                            <TableRow
                                key={item.productId}
                                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Box display={"flex"} alignItems="center">
                                        <img
                                            src={item.pictureUrl}
                                            alt={item.name}
                                            style={{ height: 50, marginRight: 20 }}
                                        />
                                        <span>{item.name}</span>
                                    </Box>
                                </TableCell>
                                <TableCell align="right">{(item.price / 100).toFixed(2)} BGN</TableCell>
                                <TableCell align="center">
                                    <LoadingButton
                                        color="error"
                                        onClick={() =>
                                            dispatch(
                                                removeBasketItemAsync({
                                                    productId: item.productId,
                                                    name: "rem",
                                                })
                                            )
                                        }
                                        loading={status === "pendingRemoveItem" + item.productId + "rem"}
                                        // onClick={() => handleRemoveItem("add", item.productId)}
                                        // loading={
                                        //     status.id === "add" + item.productId ? status.loading : false
                                        // }
                                    >
                                        <Remove />
                                    </LoadingButton>
                                    {item.quantity}
                                    <LoadingButton
                                        color="secondary"
                                        onClick={() =>
                                            dispatch(addBasketItemAsync({ productId: item.productId }))
                                        }
                                        loading={status === "pendingAddItem" + item.productId}
                                        // onClick={() => handleAddItem("rem", item.productId)}
                                        // loading={
                                        //     status.id === "rem" + item.productId ? status.loading : false
                                        // }
                                    >
                                        <Add />
                                    </LoadingButton>
                                </TableCell>
                                <TableCell align="right">
                                    {((item.price * item.quantity) / 100).toFixed(2)} BGN
                                </TableCell>
                                <TableCell align="right">
                                    <LoadingButton
                                        color="error"
                                        onClick={() =>
                                            dispatch(
                                                removeBasketItemAsync({
                                                    productId: item.productId,
                                                    quantity: item.quantity,
                                                })
                                            )
                                        }
                                        loading={status === "pendingRemoveItem" + item.productId}
                                        // onClick={() => handleRemoveItem("del", item.productId, item.quantity)}
                                        // loading={
                                        //     status.id === "del" + item.productId ? status.loading : false
                                        // }
                                    >
                                        <Delete />
                                    </LoadingButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                    <BasketSummary />
                    <Button component={Link} to={"/checkout"} size="large" fullWidth variant="contained">
                        Checkout
                    </Button>
                </Grid>
            </Grid>
        </>
    );
};

export default BasketPage;