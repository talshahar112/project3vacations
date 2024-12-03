import { useForm } from 'react-hook-form';
import { VacationModel } from '../../../Models/VacationModel';
import { vacationService } from '../../../Services/VacationService';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  InputLabel,
  Input,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'; // MUI Components
import { notify } from '../../../Utils/Notify';
import React from 'react';

export function AddVacation() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<VacationModel>();

  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = React.useState(false); // State to control the dialog visibility

  // Function to validate the start date (date can't be in the past)
  const validateDate = (date: string) => {
    const today = new Date();
    const selectedDate = new Date(date);
    if (selectedDate < today) {
      return "Date can't be in the past";
    }
    return true; // If the date is valid
  };

  // Function to validate the end date against the start date (end date must be after start date)
  const validateEndDate = (endDate: string, startDate: string) => {
    if (new Date(endDate) < new Date(startDate)) {
      return "End date can't be before start date"; // Error message if end date is before start date
    }
    return true; // If the end date is valid
  };

  // Function to handle the form submission
  async function send(vacation: VacationModel) {
    try {
      vacation.image = (vacation.image as unknown as FileList)[0]; // Handle file upload
      console.log(vacation); // Log the vacation data for debugging
      await vacationService.addVacation(vacation); // Call service to add the vacation
      notify.success('Vacation added successfully'); // Show success notification
      navigate('/list'); // Redirect to the vacation list page
    } catch (error) {
      console.error('Error adding vacation:', error); // Log any errors during vacation addition
    }
  }

  // Function to handle 'Back' button click
  const handleBackClick = () => {
    // Ask for confirmation before navigating away if there are unsaved changes
    const isUnsavedChanges = watch(); // Check if there are unsaved changes
    if (isUnsavedChanges) {
      setOpenDialog(true); // Show dialog if there are unsaved changes
    } else {
      navigate('/list'); // Navigate to the vacation list page directly if no changes
    }
  };

  const handleDialogClose = (isConfirmed: boolean) => {
    setOpenDialog(false); // Close the dialog
    if (isConfirmed) {
      navigate('/list'); // Navigate to the vacation list page if confirmed
    }
  };

  return (
    <Box
      className="AddVacation"
      component="form"
      onSubmit={handleSubmit(send)}
      sx={{
        maxWidth: 400,
        margin: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{ textAlign: 'center', marginBottom: 3 }}
      >
        Add a Vacation
      </Typography>

      {/* Destination input field */}
      <TextField
        label="Destination"
        variant="outlined"
        {...register('destination', {
          required: 'Destination is required', // Required validation
          minLength: { value: 2, message: 'Minimum length is 2' }, // Minimum length validation
          maxLength: { value: 100, message: 'Maximum length is 100' }, // Maximum length validation
        })}
        error={!!errors.destination}
        helperText={errors.destination?.message} // Display error message if validation fails
      />

      {/* Description input field */}
      <TextField
        label="Description"
        variant="outlined"
        {...register('description', {
          required: 'Description is required', // Required validation
          minLength: { value: 10, message: 'Minimum length is 10' }, // Minimum length validation
          maxLength: { value: 1000, message: 'Maximum length is 1000' }, // Maximum length validation
        })}
        error={!!errors.description}
        helperText={errors.description?.message} // Display error message if validation fails
        multiline
        rows={4}
      />

      {/* Start Date input field */}
      <TextField
        label="Start Date"
        variant="outlined"
        type="date"
        {...register('startDate', {
          required: 'Start date is required', // Required validation
          validate: validateDate, // Custom validation to check if the date is in the future
        })}
        error={!!errors.startDate}
        helperText={errors.startDate?.message} // Display error message if validation fails
        InputLabelProps={{ shrink: true }}
      />

      {/* End Date input field */}
      <TextField
        label="End Date"
        variant="outlined"
        type="date"
        {...register('endDate', {
          required: 'End date is required', // Required validation
          validate: (value) => validateEndDate(value, watch('startDate')), // Validate if end date is after start date
        })}
        error={!!errors.endDate}
        helperText={errors.endDate?.message} // Display error message if validation fails
        InputLabelProps={{ shrink: true }}
      />

      {/* Price input field */}
      <TextField
        label="Price"
        variant="outlined"
        type="number"
        {...register('price', {
          required: 'Price is required', // Required validation
          validate: {
            positive: (value) => value >= 0 || 'Price cannot be negative', // Validate that price is not negative
            max: (value) => value <= 10000 || 'Price cannot exceed 10,000', // Validate that price is less than 10,000
          },
        })}
        error={!!errors.price}
        helperText={errors.price?.message} // Display error message if validation fails
      />

      {/* Image upload field */}
      <InputLabel htmlFor="image-upload">Image</InputLabel>
      <Input
        id="image-upload"
        type="file"
        inputProps={{ accept: 'image/*' }} // Restrict file input to images
        {...register('image')} // Register the file input field
        error={!!errors.image?.message} // Display error if file validation fails
        required
      />

      {/* Submit button with turquoise styling */}
      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{
          marginTop: 3,
          backgroundColor: '#0097a7', // Turquoise color
          '&:hover': {
            backgroundColor: '#007c8c', // Darker turquoise on hover
          },
        }}
      >
        Add Vacation
      </Button>

      {/* Back button with turquoise styling */}
      <Button
        variant="outlined"
        color="primary"
        onClick={handleBackClick} // Trigger the back button handler
        sx={{
          marginTop: 2, // Adds spacing between the buttons
          borderColor: '#0097a7', // Turquoise border color
          color: '#0097a7', // Turquoise text color
          '&:hover': {
            borderColor: '#007c8c', // Darker turquoise border color on hover
            color: '#007c8c', // Darker turquoise text color on hover
          },
        }}
      >
        Back
      </Button>

      {/* Dialog to confirm navigation */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure? Your changes will not be saved.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDialogClose(true)} color="primary">
            Yes, Go Back
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
