import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import agent from "../../app/http/agent";
import Loading from "../../app/layout/Loading";
import { useAppDispatch } from "../../app/store/configureStore";
import { setBasket } from "../basket/basketSlice";
import CheckoutPage from "./CheckoutPage";

const stripePromise = loadStripe(
    "pk_test_51M9PrMAoIiuUMknDEa6MV90rGt7tWMwRzw3pVoPgr4hzrRGOQJyZrJ2ro8gsE5XnGe6XjLtrKkaMPXIiC9KrSCmi00gx3hw8uq"
);

export default function CheckoutWrapper() {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        agent.Payments.createPaymentIntent()
            .then((basket) => dispatch(setBasket(basket)))
            .catch((error) => console.log(error))
            .finally(() => setLoading(false));
    }, [dispatch]);

    if (loading) return <Loading message="Loading checkout..." />

    return (
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    );
}
