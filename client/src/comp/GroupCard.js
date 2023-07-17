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
import GroupModal from './GroupModal';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  backgroundColor: 'white',
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
  const handleClose = () => {
    setOpen(false)
    props.setModal()
  };

  const provider = props.provider
  const loggedInID = props.loggedInID
  const price = props.Group.price
  const itemName = props.Group.item_name
  const image = props.Group.image
  const groupID = props.Group._id
  const isSeller = props.isSeller


  const handleAmountOfPeopleChange = (newValue) => {
    setAmountOfPeople(newValue)
  };


  return (
    <Card variant="outlined" sx={{ width: 320, backgroundColor: '#ffffff' }}>
      <Typography level="h2" fontSize="md" sx={{ mb: 0.5 }}>
        {itemName}
      </Typography>
      <div>
        {props.isLoggedIn && <LikeButton
          groupID={groupID}
          loggedInID={props.loggedInID}>
        </LikeButton>}
      </div>
      <AspectRatio minHeight="400px" maxHeight="300px" sx={{ my: 2 }}>
        <img
          src={image}
          srcSet={image}
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
            sx={{ ml: 20, fontWeight: 1000,backgroundColor: '#2b6777','&:hover': {
              backgroundColor: '#52ab98',
            }}}>
            Details
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box style={style}>
              <GroupModal group={props.Group} GroupId={groupID} loggedInID={loggedInID} provider={provider}>
              </GroupModal>
            </Box>
          </Modal>
        </div>}
    </Box>
    </Card >
  );
}