import { Box, AppBar, Toolbar, Container, Grid, Typography } from "@mui/material";
import Copyrights from "../Copyrights/Copyrights";
import Header from "../Header/Header";
import Routing from "../Routing/Routing";

function Layout(): JSX.Element {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header Section */}
            <AppBar position="static" sx={{ backgroundColor: '#1976d2', boxShadow: 3 }}>
                <Header />
            </AppBar>

            {/* Main Content Section */}
            <Box component="main" sx={{ flexGrow: 1, padding: 3 }}>
                <Container maxWidth="lg">
                    <Routing />
                </Container>
            </Box>

            {/* Footer Section */}
                <Typography variant="body2" color="white">
                    <Copyrights />
                </Typography>
            </Box>
    );
}

export default Layout;
