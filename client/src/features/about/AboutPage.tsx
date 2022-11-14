import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, Typography } from "@mui/material";
import { useState } from "react";
import agent from "../../app/http/agent";

const AboutPage = () => {
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const getValitionError = () => {
        agent.TestErrors.getValidationError()
            .then(() => console.log("should never see this"))
            .catch(setValidationErrors);
    };
    return (
        <Container>
            <Typography variant="h2">About Page</Typography>
            <Typography gutterBottom variant="h2">
                Errors for testing purposes
            </Typography>
            <ButtonGroup fullWidth>
                <Button onClick={() => agent.TestErrors.get400Error().catch((error) => console.log(error))}>
                    Test 400 Error
                </Button>
                <Button onClick={() => agent.TestErrors.get401Error().catch((error) => console.log(error))}>
                    Test 401 Error
                </Button>
                <Button onClick={() => agent.TestErrors.get404Error().catch((error) => console.log(error))}>
                    Test 404 Error
                </Button>
                <Button onClick={() => agent.TestErrors.get500Error().catch((error) => console.log(error))}>
                    Test Server Error
                </Button>
                <Button onClick={getValitionError}>Test Validation Error</Button>
            </ButtonGroup>
            {validationErrors.length > 0 && (
                <Alert severity="error">
                    <AlertTitle>Validation Errors</AlertTitle>
                    <List>
                        {validationErrors.map((error, index) => (
                            <ListItem key={index}>{error}</ListItem>
                        ))}
                    </List>
                </Alert>
            )}
        </Container>
    );
};

export default AboutPage;
