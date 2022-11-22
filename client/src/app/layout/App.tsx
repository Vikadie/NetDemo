import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AboutPage from "../../features/about/AboutPage";
import Catalogue from "../../features/catalog/Catalog";
import ProductDetail from "../../features/catalog/ProductDetail";
import ContactPage from "../../features/contact/ContactPage";
import HomePage from "../../features/home/HomePage";
import Header from "./Header";
import "react-toastify/dist/ReactToastify.css";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
// import { useStoreContext } from "../ctx/StoreCtx";
// import { getCookie } from "../../util/utils";
// import agent from "../http/agent";
import Loading from "./Loading";
import CheckoutPage from "../../features/checkout/CheckoutPage";
import { useAppDispatch } from "../store/configureStore";
import { 
    // setBasket, 
    fetchBasketAsync } from "../../features/basket/basketSlice";
import Login from "../../features/account/Login";
import { Register } from "../../features/account/Register";
import { fetchCurrentUser } from "../../features/account/accountSlice";

function App() {
    // using context
    // const context = useStoreContext();
    // const { setBasket } = context; 
    // using Redux toolkit
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    const initApp = useCallback(async () => {
        try {
            await dispatch(fetchCurrentUser());
            await dispatch(fetchBasketAsync());
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    useEffect(() => {
        /* const buyerId = getCookie("buyerId");
        dispatch(fetchCurrentUser());
        if (buyerId) {
            agent.Basket.getBasket()
                .then(basket => dispatch(setBasket(basket))) // when from context : (setBasket)
                .catch((err) => console.log(err))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        } */ // replace by initApp function
        initApp().then(() => setLoading(false));
    }, [initApp]);

    const [darkMode, setDarkMode] = useState(false);

    const paletteType = darkMode ? "dark" : "light";
    const theme = createTheme({
        palette: {
            mode: paletteType,
            background: {
                default: darkMode ? "#121212" : "#eaeaea",
            },
            grey: {
                400: darkMode ? "#616161" : "#bdbdbd",
            },
        },
    });

    if (loading) {
        return <Loading message="Initializing App..."/>
    }

    return (
        <ThemeProvider theme={theme}>
            <ToastContainer position="bottom-right" theme="colored" hideProgressBar />
            <CssBaseline />
            <Header state={darkMode} changeMode={() => setDarkMode((prevState) => !prevState)} />
            <Container>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="catalog" element={<Catalogue />} />
                    <Route path="catalog/:id" element={<ProductDetail />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="server-error" element={<ServerError />} />
                    <Route path="about" element={<AboutPage />} />
                    <Route path="basket" element={<BasketPage />} />
                    <Route path="checkout" element={<CheckoutPage />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Container>
        </ThemeProvider>
    );
}

export default App;
