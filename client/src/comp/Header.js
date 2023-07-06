import React from 'react'
import AppBar from '@mui/material/AppBar';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateGroupe from './CreateGroup';
import ProfileIcon from './ProfileIcon';
import HomeIcon from '@mui/icons-material/Home';

axios.defaults.withCredentials = true;
let axiosConfig = {
    headers: {
        credentials: "include",
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
    },
};

export const Header = (props) => {
    const navigate = useNavigate();
    const isLoggedIn = props.isLoggedIn;
    const isSeller = props.isSeller;
    const loggedInID = props.loggedInID;

    const handleHomeClicked = () => {
        navigate('/');
    }

    return (
        <AppBar position="relative" sx={{ backgroundColor: '#2b6777' }}>
            <Toolbar>
                <Button variant="contained" onClick={handleHomeClicked} sx={{ backgroundColor: '#2b6777', '&:hover': { backgroundColor: '#52ab98', }, }}>
                    <HomeIcon />
                </Button>
                {isLoggedIn && isSeller && <CreateGroupe loggedInID={loggedInID} />}
                <Typography variant="h6" color="inherit" noWrap sx={{ ml: 'auto' }}>
                    <ProfileIcon isSeller={isSeller} isLoggedIn={isLoggedIn} loggedInID={loggedInID} />
                </Typography>
            </Toolbar>
        </AppBar>
    )
}