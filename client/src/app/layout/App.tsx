import { Container, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { useState } from "react";
import Catalogue from "../../features/catalog/Catalog";
import Header from "./Header";

function App() {
    const [darkMode, setDarkMode] = useState(false);

    const paletteType = darkMode ? "dark" : "light";
    const theme = createTheme({
        palette: {
            mode: paletteType
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header state={darkMode} changeMode={() => setDarkMode(prevState => !prevState)}/>
            <Container>
                <Catalogue />
            </Container>
        </ThemeProvider>
    );
}

export default App;
