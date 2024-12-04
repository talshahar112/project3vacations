import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { vacationService } from '../../../Services/VacationService';
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/store';
import { VacationModel } from '../../../Models/VacationModel';
import { Role } from '../../../Models/enums';
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { CSVLink } from 'react-csv';
import { NavLink } from 'react-router-dom';

const AdminReport: React.FC = () => {
  const [vacationLikes, setVacationLikes] = useState<{ destination: string; likes: number }[]>([]);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchVacationLikes = async () => {
      if (user && user.roleId === Role.Admin) {
        try {
          const vacations = await vacationService.getAllVacations();
          console.log("Fetched vacations: ", vacations);  // Log the API response to inspect the structure
  
          const likesCount = vacations.map((vacation: VacationModel) => ({
            destination: vacation.destination,
            likes: vacation.usersLikes?.length || 0,  // Ensure this part is working correctly
          }));
          setVacationLikes(likesCount);
        } catch (error) {
          console.error("Error fetching vacation likes:", error);
        }
      }
    };
  
    fetchVacationLikes();
    const intervalId = setInterval(fetchVacationLikes, 5000); // Fetch every 5 seconds
  
    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [user]);

  // CSV data preparation
  const csvData = vacationLikes.map(({ destination, likes }) => ({
    Destination: destination,
    Likes: likes,
  }));

  return (
    <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Vacation Likes Report
      </Typography>
      {user && user.roleId === Role.Admin ? (
        <>
          <Typography variant="h6">Likes for Each Vacation:</Typography>
          <Box sx={{ marginBottom: 2, textAlign: 'center' }}>
            {vacationLikes.map((vacation) => (
              <Typography key={vacation.destination}>
                {vacation.destination}: {vacation.likes} likes
              </Typography>
            ))}
          </Box>

          {/* Bar Chart */}
          <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
            <BarChart
              width={600}
              height={300}
              data={vacationLikes}
              margin={{
                top: 5, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="destination" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="likes" fill="#8884d8" />
            </BarChart>
          </Box>

          <CSVLink
            data={csvData}
            filename={"vacation_likes_report.csv"}
            className="btn btn-primary"
            target="_blank"
          >
            <Button variant="contained" color="primary">
              Download CSV
            </Button>
          </CSVLink>

          {/* Back button */}
          <Box sx={{ marginTop: 3 }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#0097a7', // Turquoise color
                "&:hover": {
                  backgroundColor: '#007f84', // Darker Turquoise on hover
                },
              }}
              component={NavLink}
              to="/list" // Link to the vacation list page
            >
              Back
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="h6" color="error">
          Access Denied: Admins only
        </Typography>
      )}
    </Box>
  );
};

export default AdminReport;
