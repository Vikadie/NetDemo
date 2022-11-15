import { Delete } from "@mui/icons-material";
import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
} from "@mui/material";
import { useStoreContext } from "../../app/ctx/StoreCtx";
import Typography from "@mui/material/Typography";
// import { useEffect, useState } from "react";
// import agent from "../../app/http/agent";
// import Loading from "../../app/layout/Loading";
// import { Basket } from "../../app/models/basket";

const BasketPage = () => {
    const {basket} = useStoreContext();
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

    if (!basket) return <Typography variant="h3">Your Basket is empty</Typography>;

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Products</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
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
                                {item.name}
                            </TableCell>
                            <TableCell align="right">{(item.price / 100).toFixed(2)} BGN</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">
                                {((item.price * item.quantity) / 100).toFixed(2)} BGN
                            </TableCell>
                            <TableCell align="right">
                                <IconButton color="error">
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default BasketPage;
