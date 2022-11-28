import {
    // IconButton,
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
import BasketSummary from "./BasketSummary";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/store/configureStore";
// import { setBasket } from "./basketSlice";
import BasketTable from "./BasketTable";
// import Loading from "../../app/layout/Loading";
// import { Basket } from "../../app/models/basket";

const BasketPage = () => {
    // const { basket, setBasket, removeItem } = useStoreContext();
    // using Redux toolkit useSelector, or customly predefined useAppSelector
    const { basket } = useAppSelector((state) => state.basket);

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
            <BasketTable items={basket.items} />
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
