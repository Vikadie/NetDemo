import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
// import { createTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import "react-toastify/dist/ReactToastify.css";
// import { useStoreContext } from "../ctx/StoreCtx";
// import { getCookie } from "../../util/utils";
// import agent from "../http/agent";
import Loading from "./Loading";
import { useAppDispatch } from "../store/configureStore";
import {
    // setBasket,
    fetchBasketAsync,
} from "../../features/basket/basketSlice";
import { fetchCurrentUser } from "../../features/account/accountSlice";
import HomePage from "../../features/home/HomePage";

function App() {
    // using context
    // const context = useStoreContext();
    // const { setBasket } = context;
    // using Redux toolkit
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);

    const location = useLocation();

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

    return (
        <ThemeProvider theme={theme}>
            <ToastContainer position="bottom-right" theme="colored" hideProgressBar />
            <CssBaseline />
            <Header state={darkMode} changeMode={() => setDarkMode((prevState) => !prevState)} />
            {loading ? (
                <Loading message="Initializing App..." />
            ) : location.pathname === "/" ? (
                <HomePage />
            ) : (
                <Container sx={{ mt: 4 }}>
                    <Outlet />
                </Container>
            )}
            {/* <Routes>
                <Route path="/" element={<HomePage />} />
                <Route
                    path="*"
                    element={
                        <Container sx={{ mt: 4 }}>
                            <Routes>
                                <Route path="catalog" element={<Catalogue />} />
                                <Route path="catalog/:id" element={<ProductDetail />} />
                                <Route path="contact" element={<ContactPage />} />
                                <Route path="server-error" element={<ServerError />} />
                                <Route path="about" element={<AboutPage />} />
                                <Route path="basket" element={<BasketPage />} />
                                <Route element={<PrivateRoute />}>
                                    <Route path="checkout" element={<CheckoutWrapper />} />
                                    <Route path="orders" element={<Orders />} />
                                </Route>
                                <Route path="login" element={<Login />} />
                                <Route path="register" element={<Register />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Container>
                    }
                />
            </Routes> */}
        </ThemeProvider>
    );
}

export default App;
