import { Navigate, Route, Routes } from 'react-router-dom';
import Page404 from '../page404/page404';
import List from '../../VacationsArea/List/List';
import { Box } from '@mui/material';
import { AddVacation } from '../../VacationsArea/Add/Add';
import { Register } from '../../VacationsArea/Register/Register';
import { Login } from '../../VacationsArea/Login/Login';
import AdminReport from '../../VacationsArea/Report/Report';

function Routing(): JSX.Element {
  return (
    <Box className="Routing" sx={{ padding: 2, minHeight: '80vh' }}>
      <Routes>
        <Route path="/" element={<Navigate to="/list" />} />
        <Route path="/list" element={<List />}  />
        <Route path="/add-vacation" element={<AddVacation />} />
        <Route path="/report" element={<AdminReport />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </Box>
  );
}

export default Routing;