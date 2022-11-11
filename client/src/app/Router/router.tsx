import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import AboutPage from "../../features/about/AboutPage";
import Catalogue from "../../features/catalog/Catalog";
import ContactPage from "../../features/contact/ContactPage";
import App from "../layout/App";
import ErrorPage from "./ErrorPage";

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
        element: <>Element</>,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "catalog",
                element: <Catalogue />,
            },
            {
                path: "contact",
                element: <ContactPage />,
            },
            {
                path: "about",
                element: <AboutPage />,
            },
        ],
    },
]);

export default router;
