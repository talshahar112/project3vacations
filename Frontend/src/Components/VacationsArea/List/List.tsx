import { useSelector } from "react-redux";
import { UserModel } from "../../../Models/UserModel";
import { useDispatch } from "react-redux";
import { RootState, vacationActions } from "../../../Redux/store";
import { useEffect, useState } from "react";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { Role } from "../../../Models/enums";
import { Box, Button, Grid, Menu, MenuItem, Pagination } from "@mui/material";
import { VacationCard } from "../VacationCard/VacationCard";
import { NavLink } from "react-router-dom";

function List(): JSX.Element {
    // Redux:
    const vacations = useSelector((state: RootState) => state.vacations);
    const user = useSelector((state: { user: UserModel | null }) => state.user);
    const dispatch = useDispatch();

    // Local state:
    const [showLiked, setShowLiked] = useState<boolean>(false);
    const [likedVacations, setLikeVacations] = useState<VacationModel[]>([]);
    const [showActive, setShowActive] = useState<boolean>(false);
    const [showUpcoming, setShowUpcoming] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const vacationsPerPage = 9;

    useEffect(() => {
        const fetchVacations = async () => {
            try {
                const vacationsData = await vacationService.getAllVacations();
                const sortedVacations = [...vacationsData].sort((a: VacationModel, b: VacationModel) =>
                    new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
                dispatch(vacationActions.initVacations(sortedVacations));
            } catch (error) {
                console.log(error);
            }
        };
        fetchVacations();
    }, [dispatch]);

    useEffect(() => {
        if (user && user.roleId === Role.User) {
            const likedVacations = vacations.filter((vacation) =>
                vacation.usersLikes?.some((like) => like.userId === user._id)
            );
            setLikeVacations(likedVacations);
        }
    }, [vacations, user]);

    const handleToggleLiked = () => {
        setShowLiked(true);
        setShowActive(false);
        setShowUpcoming(false);
        setCurrentPage(1);
        setAnchorEl(null);
    };

    const handleToggleActive = () => {
        setShowActive(true);
        setShowLiked(false);
        setShowUpcoming(false);
        setCurrentPage(1);
        setAnchorEl(null);
    };

    const handleToggleUpcoming = () => {
        setShowUpcoming(true);
        setShowLiked(false);
        setShowActive(false);
        setCurrentPage(1);
        setAnchorEl(null);
    };

    const handleShowAll = () => {
        setShowUpcoming(false);
        setShowActive(false);
        setShowLiked(false);
        setCurrentPage(1);
        setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const getActiveVacations = () => {
        const currentDate = new Date();
        return vacations.filter(
            (vacation) => new Date(vacation.startDate) <= currentDate && new Date(vacation.endDate) >= currentDate
        );
    };

    const getUpcomingVacations = () => {
        const currentDate = new Date();
        return vacations.filter((vacation) => new Date(vacation.startDate) > currentDate);
    };

    const vacationToDisplay = showLiked
        ? likedVacations
        : showActive
        ? getActiveVacations()
        : showUpcoming
        ? getUpcomingVacations()
        : vacations;

    const indexOfLastVacation = currentPage * vacationsPerPage;
    const indexOfFirstVacation = indexOfLastVacation - vacationsPerPage;
    const currentVacations = vacationToDisplay.slice(indexOfFirstVacation, indexOfLastVacation);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    return (
        <div className="List">
            <Box textAlign="center" mb={3}>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    {/* Filter button */}
                    <Grid item>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#0097a7', // Turquoise
                                "&:hover": {
                                    backgroundColor: '#0097a7', // Darker Turquoise
                                },
                            }}
                            onClick={handleClick}
                        >
                            Filter By...
                        </Button>
                    </Grid>

                    {/* Show all vacations button */}
                    <Grid item>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#0097a7', // Light Turquoise
                                "&:hover": {
                                    backgroundColor: '#0097a7', // Darker Light Turquoise
                                },
                            }}
                            onClick={handleShowAll}
                        >
                            Show All Vacations
                        </Button>
                    </Grid>

                    {/* Filter options menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        {user && user.roleId !== Role.Admin && (
                            <MenuItem onClick={handleToggleLiked}>Liked Vacations</MenuItem>
                        )}
                        <MenuItem onClick={handleToggleActive}>Active Vacations</MenuItem>
                        <MenuItem onClick={handleToggleUpcoming}>Upcoming Vacations</MenuItem>
                    </Menu>

                    {/* Only show the "Reports" button and "Add Vacation" button if the user is an admin */}
                    {user && user.roleId === Role.Admin && (
                        <>
                            {/* Reports button */}
                            <Grid item>
                                <Button
                                    variant="contained"
                                    sx={{
                                        backgroundColor: '#0097a7', // Medium Turquoise
                                        "&:hover": {
                                            backgroundColor: '#0097a7', // Darker Turquoise
                                        },
                                    }}
                                    component={NavLink}
                                    to="/report" // Link to the admin reports page
                                >
                                    Reports
                                </Button>
                            </Grid>

                            {/* Add Vacation button */}
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="success"
                                    sx={{
                                        backgroundColor: '#0097a7', // Medium Turquoise
                                        "&:hover": {
                                            backgroundColor: '#0097a7', // Darker Turquoise
                                        },
                                    }}
                                    component={NavLink}
                                    to="/add-vacation"
                                >
                                    Add Vacation
                                </Button>
                            </Grid>
                        </>
                    )}
                </Grid>
            </Box>

            {/* Display vacation cards */}
            <Grid container spacing={2} justifyContent="center">
                {currentVacations.map((vacation) => (
                    <Grid item xs={12} sm={6} md={4} key={vacation._id}>
                        <VacationCard {...vacation} />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                    count={Math.ceil(vacationToDisplay.length / vacationsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </div>
    );
}

export default List;
