import { useForm } from "react-hook-form";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { useNavigate } from "react-router-dom";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";
import { TextField, Button, Box, Typography, Container, Link } from '@mui/material';

export function Login(): JSX.Element {
    const { register, handleSubmit } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    // Handle the form submission for login
    async function send(credentials: CredentialsModel) {
        try {
            await userService.login(credentials); // Send login request
            notify.success("Welcome back!"); // Notify successful login
            navigate("/list"); // Redirect to the list page
        } catch (err: any) {
            notify.error(err); // Notify error if login fails
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {/* Title for the login page */}
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit(send)} sx={{ mt: 3 }}>
                    {/* Email input field */}
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        margin="normal"
                        {...register("email")}
                        required
                    />
                    {/* Password input field */}
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        margin="normal"
                        {...register("password")}
                        required
                    />
                    {/* Submit button with custom turquoise color */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3, 
                            mb: 2, 
                            backgroundColor: '#0097a7', // Turquoise color
                            '&:hover': {
                                backgroundColor: '#007c8c', // Darker turquoise on hover
                            },
                        }}
                    >
                        Login
                    </Button>

                    {/* Link to the registration page if the user doesn't have an account */}
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2">
                            Don't have an account?{" "}
                            <Link href="/register" variant="body2">
                                Register now
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
}
