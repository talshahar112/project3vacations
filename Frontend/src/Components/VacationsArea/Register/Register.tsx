import { useForm } from 'react-hook-form';
import { UserModel } from '../../../Models/UserModel';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../../Services/UserService';
import { notify } from '../../../Utils/Notify';
import { TextField, Button, Box, Typography, Container, Link } from '@mui/material';

export function Register(): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<UserModel>();
  const navigate = useNavigate();

  // Validate if the email is already registered
  async function validateEmail(email: string) {
    const isRegistered = await userService.isEmailRegistered(email);
    if (isRegistered) {
      return 'Email is already registered'; // Return an error message if email is registered
    }
    return true; // Return true if email is available
  }

  // Handle form submission for registration
  async function send(user: UserModel) {
    try {
      await userService.register(user); // Send registration request
      notify.success('Welcome ' + user.firstName); // Notify successful registration
      navigate('/list'); // Redirect to the list page after successful registration
    } catch (err: any) {
      notify.error(err); // Notify error if registration fails
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
        {/* Title for the registration page */}
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit(send)} sx={{ mt: 3 }}>
          {/* First Name input field with validation */}
          <TextField
            fullWidth
            label="First Name"
            margin="normal"
            {...register('firstName', {
              required: 'First name is required', // Required validation
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters',
              },
            })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message} // Display error message if validation fails
          />
          {/* Last Name input field with validation */}
          <TextField
            fullWidth
            label="Last Name"
            margin="normal"
            {...register('lastName', {
              required: 'Last name is required', // Required validation
              minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters',
              },
            })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message} // Display error message if validation fails
          />
          {/* Email input field with validation for format and availability */}
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            {...register('email', {
              required: 'Email is required', // Required validation
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Email format validation
                message: 'Please enter a valid email address',
              },
              validate: validateEmail, // Asynchronous validation to check if email is already registered
            })}
            error={!!errors.email}
            helperText={errors.email?.message} // Display error message if validation fails
          />
          {/* Password input field with validation */}
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            {...register('password', {
              required: 'Password is required', // Required validation
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters long',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/, // Password complexity validation
                message: 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character',
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message} // Display error message if validation fails
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
            Register
          </Button>

          {/* Link to login page if the user is already registered */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Already a member?{" "}
              <Link href="/login" variant="body2">
                Log in now
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
