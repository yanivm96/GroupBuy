import * as React from 'react';
import AspectRatio from '@mui/joy/AspectRatio';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import BookmarkAdd from '@mui/icons-material/BookmarkAddOutlined';
import { Modal } from '@mui/material';
import LikeButton from './LikeButton';
import axios from 'axios';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'rgba(255, 255, 255, 0.9)',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

axios.defaults.withCredentials = true;
let axiosConfig = {
  headers: {
    credentials: "include",
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
};



export default function GroupCard(props) {
  const [amountOfPeople, setAmountOfPeople] = React.useState(props.amountOfPeople)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const loggedInID = props.loggedInID
  const price = props.price
  const itemName = props.itemName
  const image = props.image
  const groupID = props.groupID
  const isSeller = props.isSeller

  

  const handleAmountOfPeopleChange = (newValue) => {
    setAmountOfPeople(newValue)
  };


  return (
    <Card variant="outlined" sx={{ width: 320 }}>
      <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
        {itemName}
      </Typography>
      <Typography level="body2">Amount of people: {amountOfPeople}</Typography>
      <div>
        {props.isLoggedIn && <LikeButton
          onAmountOfPeopleChange={handleAmountOfPeopleChange}
          isSeller={isSeller}
          groupID={groupID}
          loggedInID={props.loggedInID}>
        </LikeButton>}
      </div>
      <AspectRatio minHeight="400px" maxHeight="300px" sx={{ my: 2 }}>
        <img
          src={props.image}
          srcSet={props.image}
          loading="lazy"
          alt=""
        />
      </AspectRatio>
      <Box sx={{ display: 'flex' }}>
        <div>
          <Typography level="body3">Price:</Typography>
          <Typography fontSize="lg" fontWeight="lg">
            ₪{price}
          </Typography>
        </div>

        {props.isLoggedIn && <div sx={{ display: 'flex' }}>
          <Button
            onClick={handleOpen}
            variant="solid"
            size="sm"
            color="primary"
            aria-label="Explore Bahamas Islands"
            disableElevation
            sx={{ ml: 20, fontWeight: 1000 }}
          >
            Details
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {props.description}
            </Box>
          </Modal>
        </div>}
      </Box>
    </Card>
  );
}