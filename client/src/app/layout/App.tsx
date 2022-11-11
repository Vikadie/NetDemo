import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import AboutPage from "../../features/about/AboutPage";
import Catalogue from "../../features/catalog/Catalog";
import ProductDetail from "../../features/catalog/ProductDetail";
import ContactPage from "../../features/contact/ContactPage";
import HomePage from "../../features/home/HomePage";
import Header from "./Header";

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
            <CssBaseline />
            <Header state={darkMode} changeMode={() => setDarkMode((prevState) => !prevState)} />
            <Container>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="catalog" element={<Catalogue />} />
                        <Route path="catalog/:id" element={<ProductDetail />} />
                    <Route path="contact" element={<ContactPage />} />
                    <Route path="about" element={<AboutPage />} />
                </Routes>
            </Container>
        </ThemeProvider>
    );
}

export default App;
