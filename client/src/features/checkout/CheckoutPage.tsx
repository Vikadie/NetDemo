import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./checkoutValidation";
import agent from "../../app/http/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { clearBasket } from "../basket/basketSlice";
import { LoadingButton } from "@mui/lab";
import { StripeElementType } from "@stripe/stripe-js";
import { CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";

const steps = ["Shipping address", "Review your order", "Payment details"];

export default function CheckoutPage() {
    const dispatch = useAppDispatch();
    const [activeStep, setActiveStep] = useState(0);
    // local state for the payment message received from Stripe eventually
    const [paymentMessage, setPaymentMessage] = useState("");
    const [paymentSucceeded, setPaymentSucceeded] = useState(false);
    const { basket } = useAppSelector((state) => state.basket); // used for teh ClientSecret
    const stripe = useStripe(); // privides the function to create the actual payment
    const elements = useElements(); // to get details for the card itself as privided by Stripe

    // local state for newly created orderNumber
    const [orderNumber, setOrderNumber] = useState(0);
    const [loading, setLoading] = useState(false);

    // local state of PaymentFrom to track the states
    const [cardState, setCardState] = useState<{ elementError: { [key in StripeElementType]?: string } }>({
        elementError: {},
    });
    // state to check if inputs in PaymentFrom are validated and complete
    const [cardComplete, setCardComplete] = useState<any>({
        cardNumber: false,
        cardExpiry: false,
        cardCvc: false,
    });

    // funciton to track the states in PaymentForm
    function onCardInputChange(event: any) {
        setCardState({
            ...cardState,
            elementError: {
                ...cardState.elementError,
                [event.elementType]: event.error?.message,
            },
        });
        setCardComplete({
            ...cardComplete,
            [event.elementType]: event.complete,
        });
    }

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <AddressForm />;
            case 1:
                return <Review />;
            case 2:
                return <PaymentForm cardState={cardState} onCardInputChange={onCardInputChange} />;
            default:
                throw new Error("Unknown step");
        }
    }

    const currentValidationScheme = validationSchema[activeStep];
    const methods = useForm({
        // here we specify how do we want to validate:
        mode: "all",
        resolver: yupResolver(currentValidationScheme),
    }); // in methods we will store all our properties as in a context

    // below our methods (when they are already working) we check if there is any savedAddress for this user inside a useEffect
    useEffect(() => {
        agent.Account.savedAddress().then((res) => {
            if (res) {
                // we reset our methods with the new data and saveAddress set to false
                methods.reset({ ...methods.getValues(), ...res, saveAddress: false });
            }
        });
    }, [methods]);

    async function submitOrder(data: FieldValues) {
        setLoading(true);
        const { nameOnCard, saveAddress, ...shippingAddress } = data;
        if (!stripe || !elements || !basket?.clientSecret) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        } // stripe is not ready
        try {
            const cardElement = elements.getElement(CardNumberElement);
            const paymentResult = await stripe.confirmCardPayment(basket.clientSecret, {
                payment_method: {
                    card: cardElement!,
                    billing_details: {
                        name: nameOnCard, // sending additional properties
                    },
                },
            });
            console.log(paymentResult);

            if (paymentResult.paymentIntent?.status === "succeeded") {
                // create the order
                const orderNumber = await agent.Orders.create({
                    saveAddress,
                    shippingAddress,
                });
                setOrderNumber(orderNumber);
                setPaymentSucceeded(true);
                setPaymentMessage("Thank you - we have received your payment");
                setActiveStep(activeStep + 1);
                // API will remove the cookie, but not the basket; so it should be removed now:
                dispatch(clearBasket());
                setLoading(false);
            } else {
                setPaymentMessage(paymentResult.error?.message || "Payment failed");
                setPaymentSucceeded(false);
                setLoading(false);
                setActiveStep(activeStep + 1);
            }
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handleNext = async (data: FieldValues) => {
        if (activeStep === steps.length - 1) {
            await submitOrder(data);
        } else {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const submitDisabled =
        activeStep === steps.length - 1
            ? // on PaymentForm
              !cardComplete.cardCvc ||
              !cardComplete.cardExpiry ||
              !cardComplete.cardNumber ||
              !methods.formState.isValid
            : !methods.formState.isValid;

    return (
        <FormProvider {...methods}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center">
                    Checkout
                </Typography>
                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <>
                    {activeStep === steps.length ? (
                        <>
                            <Typography variant="h5" gutterBottom>
                                {paymentMessage}
                            </Typography>
                            {paymentSucceeded ? (
                                <Typography variant="subtitle1">
                                    Your order number is #{orderNumber}. We have emailed your order
                                    confirmation, and will send you an update when your order has shipped.
                                    Still fake!
                                </Typography>
                            ) : (
                                <Button onClick={handleBack} variant="contained">
                                    Go back and try again
                                </Button>
                            )}
                        </>
                    ) : (
                        <form onSubmit={methods.handleSubmit(handleNext)}>
                            {getStepContent(activeStep)}
                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                        Back
                                    </Button>
                                )}
                                <LoadingButton
                                    loading={loading}
                                    variant="contained"
                                    type="submit"
                                    sx={{ mt: 3, ml: 1 }}
                                    disabled={submitDisabled}
                                >
                                    {activeStep === steps.length - 1 ? "Place order" : "Next"}
                                </LoadingButton>
                            </Box>
                        </form>
                    )}
                </>
            </Paper>
        </FormProvider>
    );
}
