import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { history } from "../..";

const ServerError = () => {
    const { state }: { state: any } = history.location;
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
            <Button onClick={() => history.push("catalog")}>Go back to the store</Button>
        </Container>
    );
};

export default ServerError;
