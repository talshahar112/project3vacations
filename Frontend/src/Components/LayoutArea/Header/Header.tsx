import { UserMenu } from "../../VacationsArea/UserMenu/UserMenu";
import { Box, Typography, AppBar, Toolbar, Container, Button } from "@mui/material";

function Header(): JSX.Element {
    return (
        <AppBar position="static" sx={{ 
            background: 'linear-gradient(to right, #0097a7, #00B8D4)', 
            padding: '10px 0', 
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' 
        }}>
            <Toolbar>
                <Container maxWidth="lg">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography 
                            variant="h4" 
                            component="h1" 
                            sx={{
                                fontSize: '2.2rem', 
                                fontWeight: 700, 
                                color: 'white', 
                                fontFamily: 'Roboto, sans-serif', 
                                letterSpacing: 1, 
                                textTransform: 'uppercase',
                                marginLeft: '10px'
                            }}
                        >
                            Vacations Site
                        </Typography>
                        <UserMenu />
                    </Box>
                </Container>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
