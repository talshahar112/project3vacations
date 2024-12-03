import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/store";
import { UserModel } from "../../../Models/UserModel";
import { NavLink } from "react-router-dom";
import { userService } from "../../../Services/UserService";
import { notify } from "../../../Utils/Notify";
import { Button, Typography } from '@mui/material';

export function UserMenu(): JSX.Element {
    // Retrieving the user from Redux store
    const user = useSelector<AppState, UserModel>(store => store.user);

    // Logout function
    function logout() {
        userService.logout();
        notify.success("Bye bye");
    }

    return (
        <div className="UserMenu">
            {/* If there is no user logged in */}
            {!user ? (
                <>
                    <Typography variant="body1">Hello Guest | </Typography>
                    {/* Register button with custom styling (turquoise color) */}
                    <NavLink to="/register">
                        <Button 
                            variant="contained" 
                            sx={{
                                backgroundColor: '#0097a7', // Turquoise color
                                // Hover effect to make it darker when the mouse is over the button
                                '&:hover': {
                                    backgroundColor: '#007c8c', // Darker turquoise on hover
                                },
                            }}
                        >
                            Register
                        </Button>
                    </NavLink>
                    <span> | </span>
                    {/* Login button with custom styling (turquoise color) */}
                    <NavLink to="/login">
                        <Button 
                            variant="contained" 
                            sx={{
                                backgroundColor: '#0097a7', // Turquoise color
                                '&:hover': {
                                    backgroundColor: '#007c8c', // Darker turquoise on hover
                                },
                            }}
                        >
                            Login
                        </Button>
                    </NavLink>
                </>
            ) : (
                <>
                    {/* If user is logged in, display their name */}
                    <Typography variant="body1">Hello {user.firstName} {user.lastName} | </Typography>
                    {/* Logout button with custom styling (turquoise color) */}
                    <NavLink to="/login" onClick={logout}>
                        <Button 
                            variant="contained" 
                            sx={{
                                backgroundColor: '#0097a7', // Turquoise color
                                '&:hover': {
                                    backgroundColor: '#007c8c', // Darker turquoise on hover
                                },
                            }}
                        >
                            Logout
                        </Button>
                    </NavLink>
                </>
            )}
        </div>
    );
}
