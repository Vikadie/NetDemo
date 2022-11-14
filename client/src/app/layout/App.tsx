import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AboutPage from "../../features/about/AboutPage";
import Catalogue from "../../features/catalog/Catalog";
import ProductDetail from "../../features/catalog/ProductDetail";
import ContactPage from "../../features/contact/ContactPage";
import HomePage from "../../features/home/HomePage";
import Header from "./Header";
import 'react-toastify/dist/ReactToastify.css';
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";

function App() {
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
            <ToastContainer position="bottom-right" theme="colored" hideProgressBar/>
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
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Container>
        </ThemeProvider>
    );
}

export default App;
