import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";
import AboutPage from "../../features/about/AboutPage";
import Catalogue from "../../features/catalog/Catalog";
import ContactPage from "../../features/contact/ContactPage";
import App from "../layout/App";
import ProductDetail from "../../features/catalog/ProductDetail";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import BasketPage from "../../features/basket/BasketPage";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";
import Orders from "../../features/orders/Orders";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import ErrorPage from "./ErrorPage";
import RequireAuth from "./RequireAuth";

export const router1 = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<App />}>
            <Route path="catalog" element={<Catalogue />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="about" element={<AboutPage />} />
        </Route>
    )
);

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <RequireAuth />,
                children: [
                    {
                        path: "checkout",
                        element: <CheckoutWrapper />,
                    },
                    {
                        path: "orders",
                        element: <Orders />,
                    },
                ],
            },
            {
                element: <RequireAuth roles={["Admin"]} />,
                children: [
                    {
                        path: "inventory",
                        element: <CheckoutWrapper />,
                    },
                ],
            },
            {
                path: "catalog",
                element: <Catalogue />,
            },
            {
                path: "catalog/:id",
                element: <ProductDetail />,
            },
            {
                path: "about",
                element: <AboutPage />,
            },
            {
                path: "contact",
                element: <ContactPage />,
            },
            {
                path: "server-error",
                element: <ServerError />,
            },
            {
                path: "not-found",
                element: <NotFound />,
            },
            {
                path: "basket",
                element: <BasketPage />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "*",
                element: <Navigate replace to="/not-found" />,
            },
        ],
    },
]);

export default router;
