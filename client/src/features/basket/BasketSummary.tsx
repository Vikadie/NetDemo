import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Grid } from "@mui/material";
import { useStoreContext } from "../../app/ctx/StoreCtx";

const LIMIT = 200;

export default function BasketSummary() {
    const { basket } = useStoreContext();

    const subtotal = basket?.items.reduce((acc, item) => acc + item.quantity * item.price, 0) || 0;
    let deliveryFee = 0;
    if (subtotal > 0 && subtotal / 100 < LIMIT) {
        deliveryFee = 5;
    }

    return (
        <Grid container>
            <TableContainer component={Paper} variant={"outlined"}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{(subtotal / 100).toFixed(2)} BGN</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">{deliveryFee.toFixed(2)} BGN</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">
                                {((subtotal + deliveryFee * 100) / 100).toFixed(2)} BGN
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
