import { VacationModel } from '../../../Models/VacationModel';
import { useEffect, useState } from 'react';
import { likeService } from '../../../Services/LikeService';
import { useSelector } from 'react-redux';
import { UserModel } from '../../../Models/UserModel';
import { Role } from '../../../Models/enums';
import { vacationService } from '../../../Services/VacationService';
import { useNavigate } from 'react-router-dom';
import { LikeModel } from '../../../Models/LikeModel';

// MUI Components
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditVacationForm from '../Edit/Edit';

export function VacationCard(props: VacationModel): JSX.Element {
  const navigate = useNavigate();
  const user = useSelector((state: { user: UserModel | null }) => state.user);

  const [likesArray, setLikesArray] = useState<LikeModel[]>([]);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState(props.usersLikes?.length || 0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false); // New state for read more
  const [openDialog, setOpenDialog] = useState(false); // State for dialog visibility

  useEffect(() => {
    const fetchLikes = async () => {
      if (!user) {
        navigate('/Login');
        return;
      }
      if (user && user.roleId === Role.User) {
        const likes = await likeService.getAllLikes();
        setLikesArray(likes);
        const userLiked =
          props.usersLikes?.some((like) => like.userId === user._id) || false;
        setIsLiked(userLiked);
      }
    };

    fetchLikes();
  }, [user, props.usersLikes, navigate]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleLikeButton = async (vacationId: string) => {
    try {
      if (isLiked) {
        const likedVacationIdContainer = likesArray.filter(
          (like) => like.userId === user._id && like.vacationId === vacationId
        );
        const likeVacationId = likedVacationIdContainer[0]._id;
        await likeService.deleteLike(likeVacationId);
        setLikesArray(likesArray.filter((like) => like._id !== likeVacationId));
        setLikesCount((prev) => prev - 1);
        setIsLiked(false);
      } else {
        const like: LikeModel = {
          vacationId,
          userId: user._id,
        };
        const addedLike = await likeService.addLike(like);
        setLikesArray([...likesArray, addedLike]);
        setLikesCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.log('Error handling like:', error);
    }
  };

  const openDeleteDialog = () => {
    setOpenDialog(true); // Open confirmation dialog
  };

  const confirmDelete = async () => {
    try {
      await vacationService.deleteVacation(props._id);
      console.log('Vacation deleted successfully.');
      setOpenDialog(false); // Close dialog after deletion
    } catch (error) {
      console.error('Failed to delete vacation:', error);
      setOpenDialog(false); // Close dialog if there's an error
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false); // Close dialog if user cancels deletion
  };

  const openEditForm = () => {
    setIsEditing(true);
  };

  const closeEditForm = () => {
    setIsEditing(false);
  };

  const imageUrl = typeof props.image === 'string' ? props.image : '';

  const truncateDescription = (description: string, length: number): string => {
    return description.length > length
      ? description.substring(0, length) + '...'
      : description;
  };

  return (
    <Card sx={{ maxWidth: 345, margin: '20px', position: 'relative' }}>
      <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={props.destination}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.destination}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {showMore
            ? props.description
            : truncateDescription(props.description, 100)}
          {props.description.length > 100 && (
            <Button
              size="small"
              onClick={() => setShowMore(!showMore)}
              color="primary"
            >
              {showMore ? 'Read Less' : 'Read More'}
            </Button>
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start Date: {formatDate(props.startDate)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          End Date: {formatDate(props.endDate)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Price: ${props.price}
        </Typography>

        {user && user.roleId === Role.Admin ? (
          <>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#0097a7',
                '&:hover': {
                  backgroundColor: '#007c8c',
                },
                marginRight: '10px',
              }}
              onClick={openEditForm}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: '#0097a7',
                '&:hover': {
                  backgroundColor: '#007c8c',
                },
              }}
              onClick={openDeleteDialog} // Open the dialog
            >
              Delete
            </Button>
          </>
        ) : (
          user && (
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => handleLikeButton(props._id)}>
                {isLiked ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {likesCount}
              </Typography>
            </Box>
          )
        )}
      </CardContent>

      {isEditing && (
        <EditVacationForm vacation={props} onClose={closeEditForm} />
      )}

      {/* Dialog for delete confirmation */}
      <Dialog
        open={openDialog}
        onClose={cancelDelete}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this vacation? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
