import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import agent from "../../app/http/agent";
import Loading from "../../app/layout/Loading";
import { Order } from "../../app/models/order";
import OrderDetails from "./OrderDetails";

export default function Orders() {
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [loading, setLoading] = useState(true);

    const [orderDetail, setOrderDetail] = useState<Order | undefined>();
    const [showOrderDetail, setShowOrderDetail] = useState(false);

    useEffect(() => {
        agent.Orders.list()
            .then((order) => setOrders(order))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, []);

    const handleViewOrder = (id: number) => {
        setLoading(true);
        // 1/ way of doing it via API
        // agent.Orders.fetch(id)
        //     .then((order) => {
        //         setOrderDetail(order);
        //         setShowOrderDetail(true);
        //     })
        //     .catch((err) => console.log(err))
        //     .finally(() => setLoading(false));
        // 2/ way using find in the current context to avoid not needed fetching
        setOrderDetail(orders?.find(o => o.id === id));
        setShowOrderDetail(true);
        setLoading(false);
    };

    if (loading) return <Loading message="Loading orders..." />;

    return showOrderDetail ? (
        <OrderDetails orderDetail={orderDetail} setShowOrderDetail={setShowOrderDetail} />
    ) : (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Order number</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="right">Order Date</TableCell>
                        <TableCell align="right">Order status</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders?.map((order) => (
                        <TableRow key={order.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                            <TableCell component="th" scope="row">
                                {order.id}
                            </TableCell>
                            <TableCell align="right">{(order.total / 100).toFixed(2)} BGN</TableCell>
                            <TableCell align="right">{order.orderDate.split("T")[0]}</TableCell>
                            <TableCell align="right">{order.orderStatus}</TableCell>
                            <TableCell align="right">
                                <Button onClick={() => handleViewOrder(order.id)}>View</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
