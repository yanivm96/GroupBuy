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
    const handleLogout = (event) => {
        let url = "http://127.0.0.1:5000/logout";
        axios.post(url, axiosConfig)
            .then((res) => {
                localStorage.clear();
                navigate("/");
                window.location.reload(false);
            });
    }

    const handleCreateItem = (event) => {

    }

    return (
        <AppBar position="relative">
            <Toolbar>
                <Button variant="contained" disableElevation >
                    <Link color="inherit" href="/">Home </Link>
                </Button>
                {isLoggedIn && isSeller && <CreateGroupe loggedInID={loggedInID} />}
                <Typography variant="h6" color="inherit" noWrap sx={{ ml: 'auto' }}>
                    {!isLoggedIn && <Button variant="contained" disableElevation  >
                        <Link color="inherit" href="/SignIn"> Sign In </Link>
                    </Button>}
                    {!isLoggedIn && <Button variant="contained" disableElevation>
                        <Link color="inherit" href="/SignUp"> Sign Up </Link>
                    </Button>}
                    {isLoggedIn && <Button onClick={handleLogout} variant="contained" disableElevation>Log out</Button>}
                    <ProfileIcon isSeller={isSeller} isLoggedIn={isLoggedIn}></ProfileIcon>
                </Typography>
            </Toolbar>
        </AppBar >
    )
}