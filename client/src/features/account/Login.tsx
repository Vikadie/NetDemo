import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { history } from "../.."; //required to redirect the user
import { useAppDispatch } from "../../app/store/configureStore";
import { signInUser } from "./accountSlice";
// import { useMemo } from "react";

export default function Login() {
    const dispatch = useAppDispatch();
    const location = useLocation();

    // const from = useMemo(() => {
    //     const state = location.state as { from: Location };
    //     if (state && state.from && state.from.pathname) {
    //         return state.from?.pathname;
    //     }

    //     return null;
    // }, [location]); // can be used in the submitForm function, in case it is coming from basket -> checkout button, thus sent from Checkout Page and no user is there.

    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors, isValid },
    } = useForm({
        mode: "all", // mode to use to validate the inputs
    });

    // const [values, setValues] = React.useState({
    //     username: "",
    //     password: "",
    // }); // no use of local state with react-hook-form

    // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     agent.Account.login(values);
    // }; // this function is automatically provided from react-hook-form

    // const handleInputs = (event: any) => {
    //     const { name, value } = event?.target;
    //     setValues({ ...values, [name]: value });
    // }; // no need as it will be handled with react-hook-form

    async function submitForm(data: FieldValues) {
        // try {
        //     // to get the isSubmitting, this function should be async
        //     await agent.Account.login(data); // await due to async
        // } catch (error) {
        //     console.log(error);
        // } // no need with Redux
        try {
            await dispatch(signInUser(data));
            // if it is coming from a specific location written in the location.state.from, it will go there, else in the '/catalog'
            history.push(location.state?.from?.pathname || "/catalog"); 
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <Container
            component={Paper}
            maxWidth="sm"
            sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}
        >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="Username"
                    autoFocus
                    {...register("username", { required: "Username is required" })}
                    autoComplete="username"
                    error={!!errors.username} // it will color the form in red if problems
                    helperText={errors?.username?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    {...register("password", { required: "Password is required" })}
                    autoComplete="current-password"
                    error={!!errors.password} // it will color the form in red if problems
                    helperText={errors?.password?.message as string}
                />
                <LoadingButton
                    disabled={!isValid}
                    loading={isSubmitting}
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </LoadingButton>
                <Grid container>
                    <Grid item>
                        <Link to="/register">{"Don't have an account? Sign Up"}</Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
