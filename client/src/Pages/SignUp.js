import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import AntSwitch from './AntSwitch';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

axios.defaults.withCredentials = true;
let axiosConfig = {
    headers: {
        credentials: "include",
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
    },
};




export default function SignUp() {
    const navigate = useNavigate();
    const [checked, setChecked] = React.useState(false);
    const [firstNameFiled, setCheckedFirstName] = React.useState(false);
    const [lastNameFiled, setCheckedLastName] = React.useState(false);
    const [emailFiled, setCheckedEmail] = React.useState(false);
    const [usernameFiled, setCheckedUsername] = React.useState(false);
    const [passwordFiled, setCheckedPassword] = React.useState(false);

    const [firstNameError, setFirstNameError] = React.useState(false);
    const [lastNameError, setLastNameError] = React.useState(false);
    const [usernameError, setUsernameError] = React.useState(false);
    const [emailError, setEmailError] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);





    function checkFields() {
        return (firstNameFiled && lastNameFiled && emailFiled && usernameFiled && passwordFiled);
    }

    function manageErrors() {
        if (!firstNameFiled) {
            setFirstNameError(true)
            console.log("entered1")
        }
        if (!lastNameFiled) {
            setLastNameError(true)
            console.log("entered2")
        }
        if (!usernameFiled) {
            setUsernameError(true)
        }
        if (!emailFiled) {
            setEmailError(true)
        }
        if (!passwordFiled) {
            setPasswordError(true)
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!checkFields()) {
            manageErrors();
        }
        else {
            let url;
            const data = new FormData(event.currentTarget);
            const userInput = {
                username: data.get('userName'),
                password: data.get('password'),
                lname: data.get('lastName'),
                fname: data.get('firstName'),
                email: data.get('email'),
            };
            if (checked === true) {
                url = "http://127.0.0.1:5000/seller/create";
            }
            else {
                url = "http://127.0.0.1:5000/user/create";
            }
            axios.post(url, JSON.stringify(userInput), axiosConfig)
                .then((res) => {
                    if (res.data) {
                        localStorage.setItem("token", res.data.token);
                        navigate("/");
                        window.location.reload(false);
                    } else {
                        console.log("error loging");
                    }
                });
        }
    };

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };


    const handleFirstNameFiledChange = (event) => {
        setFirstNameError(false)
        const nameRegex = /^[a-zA-Z]+$/;
        let fName = event.target.value;
        if (fName === "" || !nameRegex.test(fName)) {
            setCheckedFirstName(false);
        }
        else {
            setCheckedFirstName(true);
        }
    };

    const handleLastNameFiledChange = (event) => {
        setLastNameError(false)
        const nameRegex = /^[a-zA-Z]+$/;
        let lName = event.target.value;
        if (lName === "" || !nameRegex.test(lName)) {
            setCheckedLastName(false);
        }
        else {
            setCheckedLastName(true);
        }
    };

    const handleEmailChange = (event) => {
        setEmailError(false)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let email = event.target.value;
        if (email === "" || !emailRegex.test(email)) {
            setCheckedEmail(false);
        }
        else {
            setCheckedEmail(true);
        }
    };

    const handlePasswordChange = (event) => {
        setPasswordError(false)
        if (event.target.value === "") {
            setCheckedPassword(false);
        }
        else {
            setCheckedPassword(true);
        }
    };

    const handleUsernameChange = (event) => {
        setUsernameError(false)
        const usernameRegex = /^[a-zA-Z0-9]+$/;
        let userName = event.target.value
        if (userName === "" || !usernameRegex.test(userName)) {
            setCheckedUsername(false);
        }
        else {
            setCheckedUsername(true);
        }
    };



    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    autoComplete="given-name"
                                    name="firstName"
                                    error={firstNameError}
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    onChange={handleFirstNameFiledChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    error={lastNameError}
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    onChange={handleLastNameFiledChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    error={usernameError}
                                    required
                                    fullWidth
                                    id="userName"
                                    label="Username"
                                    name="userName"
                                    autoComplete="user-name"
                                    onChange={handleUsernameChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    error={emailError}
                                    type="email"
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={handleEmailChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    error={passwordError}
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={handlePasswordChange}
                                />
                            </Grid>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ marginLeft: 15, marginTop: 3, }}>
                                <Typography>Buyer</Typography>
                                <AntSwitch onChange={handleChange} inputProps={{ 'aria-label': 'ant design' }} />
                                <Typography>Seller</Typography>
                            </Stack>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="http://127.0.0.1:3000/SignIn" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}