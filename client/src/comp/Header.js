import React from 'react'
import AppBar from '@mui/material/AppBar';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

axios.defaults.withCredentials = true;
let axiosConfig = {
    headers: {
        credentials: "include",
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
    },
};

export const Header = () => {
    const [LoggedinPerson, setName] = React.useState(null);
    const location = useLocation();
    const { state } = location;
    const id = state;

    const handleLogoutClick = (event) => {
        setName(null)
    }

    useEffect(() => {
        handleLoad();
    }, [LoggedinPerson]);

    const handleLoad = (event) => {
        let url = "http://127.0.0.1:5000/user/by_id";
        axios.post(url, JSON.stringify(id), axiosConfig)
            .then((res) => {
                if (res.data["name"] != null) {
                    console.log(res.data["name"])
                    setName("Welcome " + res.data["name"])
                    localStorage.setItem("token", res.data.token);
                }
            });
    }


    return (
        <AppBar position="relative">
            <Toolbar>
                <Button variant="contained" disableElevation >
                    <Link color="inherit" href="/">Home </Link>
                </Button>
                {id !== "" ? <p>{LoggedinPerson}</p> : null}
                <Typography variant="h6" color="inherit" noWrap sx={{ ml: 'auto' }}>
                    {LoggedinPerson === null && <Button variant="contained" disableElevation  >
                        <Link color="inherit" href="/SignIn"> Sign In </Link>
                    </Button>}
                    {LoggedinPerson === null && <Button variant="contained" disableElevation>
                        <Link color="inherit" href="/SignUp"> Sign Up </Link>
                    </Button>}
                    {LoggedinPerson !== null && <Button onClick={handleLogoutClick} variant="contained" disableElevation>Log out</Button>}
                </Typography>
            </Toolbar>
        </AppBar >
    )
}