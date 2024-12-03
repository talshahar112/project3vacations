import { Box, Typography, AppBar, Toolbar, Container } from "@mui/material";

function Copyrights(): JSX.Element {
    return (
        <AppBar position="static" sx={{ 
            background: 'linear-gradient(to right, #0097A7, #00B8D4)', 
            padding: '10px 0', 
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' 
        }}>
            <Toolbar>
                <Container maxWidth="lg">
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <Typography
                            variant="body1"
                            sx={{
                                fontSize: '1rem',
                                fontWeight: 400,
                                color: 'white',
                                fontFamily: 'Roboto, sans-serif',
                                textAlign: 'center',
                                letterSpacing: 0.5,
                            }}
                        >
                            All Rights Reserved © Tal-Shahar Vacations
                        </Typography>
                    </Box>
                </Container>
            </Toolbar>
        </AppBar>
    );
}

export default Copyrights;
