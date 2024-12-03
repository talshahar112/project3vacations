import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { UserModel } from '../../../Models/UserModel';
import { Role } from '../../../Models/enums';

function Menu(): JSX.Element {
  // Access the user from the Redux state
  const user = useSelector((state: { user: UserModel | null }) => state.user);

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left side - App name or logo */}
        <Typography variant="h6" sx={{ color: 'white' }}>
          Vacations
        </Typography>

        {/* Right side - Navigation buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Show "Register" button if the user is not logged in */}
          {user ? (
            <></>
          ) : (
            <Button
              component={NavLink}
              to="/register"
              sx={{
                color: 'white',
                textDecoration: 'none',
                marginLeft: 2,
                '&:hover': { color: '#f1f1f1' },
              }}
            >
              Register to see your next vacation!
            </Button>
          )}

          {/* Conditionally render "New" and "Report" buttons for Admin users */}
          {user && user.roleId === Role.Admin && (
            <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 2 }}>
              <Button
                component={NavLink}
                to="/new"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  marginRight: 2,
                  '&:hover': { color: '#f1f1f1' },
                }}
              >
                New
              </Button>
              <Button
                component={NavLink}
                to="/report"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  '&:hover': { color: '#f1f1f1' },
                }}
              >
                Report
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Menu;
