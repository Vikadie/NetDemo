import { Remove, Add, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box } from "@mui/material";
import { BasketItem } from "../../app/models/basket";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { removeBasketItemAsync, addBasketItemAsync } from "./basketSlice";

interface Props {
    items: BasketItem[];
    isBasket?: boolean;
}
export default function BasketTable({ items, isBasket = true }: Props) {
    const { status } = useAppSelector((state) => state.basket);
    const dispatch = useAppDispatch();
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Products</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        {isBasket && <TableCell align="right"></TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((item) => (
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
                                {isBasket && (
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
                                )}
                                {item.quantity}
                                {isBasket && (
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
                                )}
                            </TableCell>
                            <TableCell align="right">
                                {((item.price * item.quantity) / 100).toFixed(2)} BGN
                            </TableCell>
                            {isBasket && (
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
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

