import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import router from "../router/Router";
import { useLocation } from "react-router-dom";

const ServerError = () => {
    const { state }: { state: any } = useLocation();
    return (
        <Container component={Paper}>
            {state?.error ? (
                <>
                    <Typography variant="h3" color="error" gutterBottom>
                        {state.error.title}
                    </Typography>
                    <Divider />
                    <Typography>{state.error.detail || "Internal server error"}</Typography>
                </>
            ) : (
                <Typography variant="h3" gutterBottom>
                    Server Error
                </Typography>
            )}
            <Button onClick={() => router.navigate("catalog")}>Go back to the store</Button>
        </Container>
    );
};

export default ServerError;
