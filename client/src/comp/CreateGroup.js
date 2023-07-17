import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddressForm from './AddressForm';
import AddCircleIcon from '@mui/icons-material/AddCircle';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#F5EFE6',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CreateGroupe(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const loggedInID = props.loggedInID;
  const provider= props.provider
  return (
    <div>
      <Button onClick={handleOpen} sx={{
        backgroundColor: '#2b6777',
        '&:hover': {
          backgroundColor: '#52ab98',
        },
      }} variant="contained" >
        <AddCircleIcon></AddCircleIcon></Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddressForm loggedInID={loggedInID} provider={provider}></AddressForm>
        </Box>
      </Modal>
    </div>
  );
}