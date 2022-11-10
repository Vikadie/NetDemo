import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import Catalogue from "../../features/catalog/Catalog";
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
            }
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header state={darkMode} changeMode={() => setDarkMode((prevState) => !prevState)} />
            <Container>
                <Catalogue />
            </Container>
        </ThemeProvider>
    );
}

export default App;
