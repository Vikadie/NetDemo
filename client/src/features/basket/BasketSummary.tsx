import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Grid } from "@mui/material";
// import { useStoreContext } from "../../app/ctx/StoreCtx";
import { useAppSelector } from "../../app/store/configureStore";

const LIMIT = 200;

export default function BasketSummary({ subtotal }: { subtotal?: number | undefined }) {
    // const { basket } = useStoreContext(); // using context
    // using Redux toolkit useSelector, or customly predefined useAppSelector
    const { basket } = useAppSelector((state) => state.basket);

    const subttl = !subtotal
        ? basket?.items.reduce((acc, item) => acc + item.quantity * item.price, 0) || 0
        : subtotal;
    let deliveryFee = 0;
    if (subttl > 0 && subttl / 100 < LIMIT) {
        deliveryFee = 5;
    }

    return (
        <Grid container>
            <TableContainer component={Paper} variant={"outlined"}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{(subttl / 100).toFixed(2)} BGN</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{deliveryFee.toFixed(2)} BGN</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">
                                {((subttl + deliveryFee * 100) / 100).toFixed(2)} BGN
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{ fontStyle: "italic" }}>
                                    *Orders over {LIMIT} BGN qualify for free delivery
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
}
