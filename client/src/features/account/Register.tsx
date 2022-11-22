import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import agent from "../../app/http/agent";
import { toast } from "react-toastify";
import { history } from "../..";

export default function Register() {
    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, errors, isValid },
    } = useForm({
        mode: "all", // mode to use to validate the inputs
    });

    function handleApiErrors(errors: any) {
        if (errors) {
            errors.forEach((error: string) => {
                if (error.includes("Password")) {
                    setError("password", { message: error });
                } else if (error.includes("Email")) {
                    setError("email", { message: error });
                } else if (error.includes("Username")) {
                    setError("username", { message: error });
                }
            });
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
                Register
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit((data) =>
                    agent.Account.register(data)
                        .then(() => {
                            toast.success("Registration successful - you can now login");
                            history.push("/login");
                        })
                        .catch(handleApiErrors)
                )}
                noValidate
                sx={{ mt: 1 }}
            >
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
                    label="Email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                            value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Not a valid email address",
                        },
                    })}
                    autoComplete="email"
                    error={!!errors.email} // it will color the form in red if problems
                    helperText={errors?.email?.message as string}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    {...register("password", {
                        required: "Password is required",
                        pattern: {
                            value: /(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                            message: "Password does not meet complexity requirements",
                        },
                    })}
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
                    Register
                </LoadingButton>
                <Grid container>
                    <Grid item>
                        <Link to="/login">{"Already have an account? Sign In"}</Link>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}
