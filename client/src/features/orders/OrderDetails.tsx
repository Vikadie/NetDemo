import { Grid, Typography, Button } from "@mui/material";
import { BasketItem } from "../../app/models/basket";
import { Order } from "../../app/models/order";
import BasketSummary from "../basket/BasketSummary";
import BasketTable from "../basket/BasketTable";

interface Props {
    orderDetail: Order | undefined;
    setShowOrderDetail: (value: boolean) => void;
}
export default function OrderDetails({ orderDetail, setShowOrderDetail }: Props) {
    return (
        <>
            <Grid container justifyContent={"space-between"} sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Order #{orderDetail?.id} summary:
                </Typography>
                <Button variant={"contained"} onClick={() => setShowOrderDetail(false)}>
                    Back to Orders
                </Button>
            </Grid>
            <BasketTable items={orderDetail?.orderItems as BasketItem[]} isBasket={false} />
            <Grid container>
                <Grid item xs={6}></Grid>
                <Grid item xs={6}>
                    <BasketSummary subtotal={orderDetail?.subTotal}/>
                </Grid>
            </Grid>
        </>
    );
}
