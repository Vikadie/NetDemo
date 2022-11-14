import { Button, Container, Divider, Paper } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <Container id="error-page" component={Paper} sx={{ height: '400px' }}>
            <h1>Oops!</h1>
            <p>Sorry, we could not found what you are looking for...</p>
            <p>{/* <i>{error.statusText || error.message}</i> */}</p>
            <Divider />
            <Button fullWidth component={Link} to="catalog">Go back to shop</Button>
        </Container>
    );
};

export default NotFound;
