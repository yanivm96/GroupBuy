import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import LoginIcon from '@mui/icons-material/Login';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { createSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { string } from 'yup';


axios.defaults.withCredentials = true;
let axiosConfig = {
  headers: {
    credentials: "include",
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
};

export default function ProfileIcon(props) {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyAccount = () => {
    console.log(props.loggedInID)
    const user_id = props.loggedInID
    const seller_id = props.loggedInID
    setAnchorEl(null);
    if (props.isSeller === true) {
      navigate('/Seller', { state: { seller_id } });
    }
    else
    {
      navigate('/User', { state: { user_id } });
    }
  };

  const handleLogout = () => {
    setAnchorEl(null);
    let url = "http://127.0.0.1:5000/logout";
    axios.post(url, axiosConfig)
      .then((res) => {
        localStorage.clear();
        navigate("/");
        window.location.reload(false);
      });
  };

  const handleLogin = () => {
    setAnchorEl(null);
    navigate("/SignIn");
  };
  const handleSignUp = () => {
    setAnchorEl(null);
    navigate("/SignUp");

  };


  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}></Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {props.isLoggedIn && <MenuItem onClick={handleMyAccount}>
          <Avatar /> My account
        </MenuItem>}
        <Divider />
        {!props.isLoggedIn && <MenuItem onClick={handleLogin}>
          <ListItemIcon>
            <LoginIcon fontSize="small" />
          </ListItemIcon>
          Login
        </MenuItem>}
        {!props.isLoggedIn && <MenuItem onClick={handleSignUp}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Sign Up
        </MenuItem>}
        {props.isLoggedIn && <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>}
      </Menu>
    </React.Fragment>
  );
}