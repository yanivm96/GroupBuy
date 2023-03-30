import * as React from 'react';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';


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

axios.defaults.withCredentials = true;
let axiosConfig = {
    headers: {
        credentials: "include",
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
    },
};

const theme = createTheme();

const validationSchema = Yup.object({
    fname: Yup.string()
        .required('First Name is required')
        .matches(/^[a-zA-Z]+$/, 'First Name must contain only letters'),
    lname: Yup.string()
        .required('Last Name is required')
        .matches(/^[a-zA-Z]+$/, 'Last Name must contain only letters'),
    email: Yup.string()
        .required('Email is required')
        .email('Invalid email format'),
    username: Yup.string()
        .required('username is required')
        .matches(/^[a-zA-Z0-9]+$/, 'username must contain only alphanumeric characters'),
    password: Yup.string()
        .required('Password is required'),
});

export default function SignUp() {
    const navigate = useNavigate();
    const [checked, setChecked] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    async function checkusernameExistence(username) {
        let userUrl = "http://127.0.0.1:5000/user/check_username_existence";
        let sellerUrl = "http://127.0.0.1:5000/seller/check_username_existence";

        try {
            const userRes = await axios.post(userUrl, JSON.stringify({ "username": username }), axiosConfig);
            const sellerRes = await axios.post(sellerUrl, JSON.stringify({ "username": username }), axiosConfig);
            if (userRes.data["exist"] === false && sellerRes.data["exist"] === false) {
                if(checked)
                {
                    localStorage.setItem("token", sellerRes.data.accessToken);
                }
                else
                {
                    localStorage.setItem("token", userRes.data.accessToken);
                }
                setUsernameError(false)
                return false
            } else {
                setUsernameError(true)
                return true
            }
        } catch (error) {
            console.error(error);
        }
    }

    async function checkEmailExistence(email) {
        let userurl = "http://127.0.0.1:5000/user/check_email_existence";
        let sellerUrl = "http://127.0.0.1:5000/seller/check_email_existence";
        
        try {
            const userRes = await axios.post(userurl, JSON.stringify({ "email": email }), axiosConfig);
            const sellerRes = await axios.post(sellerUrl, JSON.stringify({ "email": email }), axiosConfig);
            if (userRes.data["exist"] === false && sellerRes.data["exist"] === false) {
                if(checked)
                {
                    localStorage.setItem("token", sellerRes.data.token);
                }
                else
                {
                    localStorage.setItem("token", userRes.data.token);
                }
                setEmailError(false)
                return false
            } else {
                setEmailError(true)
                return true
            }
        } catch (error) {
            console.error(error);
        }
    }

    const formik = useFormik({
        initialValues: {
            fname: '',
            lname: '',
            email: '',
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            let emailExist = await checkEmailExistence(values.email);
            let usernameExist = await checkusernameExistence(values.username);
            let url;
            console.log(emailExist, usernameExist)
            if (!emailExist && !usernameExist) {
                if (checked === true) {
                    url = "http://127.0.0.1:5000/seller/create";
                } else {
                    url = "http://127.0.0.1:5000/user/create";
                }
                try {
                    const res = await axios.post(url, JSON.stringify(values), axiosConfig);
                    if (res.data) {
                        localStorage.setItem("token", res.data.accessToken);
                        //navigate("/");
                        window.location.reload(false);
                    } else {
                        console.log("error logging");
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        },
    });

    const handleChange = (event) => {
        setChecked(event.target.checked);
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
                    <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="fname"
                                    name="fname"
                                    required
                                    fullWidth
                                    id="fname"
                                    label="First Name"
                                    autoFocus
                                    value={formik.values.fname}
                                    onChange={formik.handleChange}
                                    error={formik.touched.fname && Boolean(formik.errors.fname)}
                                    helperText={formik.touched.fname && formik.errors.fname}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lname"
                                    label="Last Name"
                                    name="lname"
                                    autoComplete="lname"
                                    value={formik.values.lname}
                                    onChange={formik.handleChange}
                                    error={formik.touched.lname && Boolean(formik.errors.lname)}
                                    helperText={formik.touched.lname && formik.errors.lname}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    error={formik.touched.email && Boolean(formik.errors.email)}
                                    helperText={formik.touched.email && formik.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    label="username"
                                    name="username"
                                    autoComplete="username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    error={formik.touched.username && Boolean(formik.errors.username)}
                                    helperText={formik.touched.username && formik.errors.username}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    error={formik.touched.password && Boolean(formik.errors.password)}
                                    helperText={formik.touched.password && formik.errors.password}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Stack direction="row" alignItems="center" justifyContent="center">
                                    <Typography marginRight={2}> Buyer </Typography>
                                    <AntSwitch onChange={handleChange} inputProps={{ 'aria-label': 'ant design' }} />
                                    <Typography marginLeft={2}> Seller</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                        <div> <p></p></div>
                        {usernameError && <Alert variant="filled" severity="error" >
                            username already exist.
                        </Alert>}
                        <div> <p></p></div>
                        {emailError && <Alert variant="filled" severity="error" >
                            email already exist.
                        </Alert>}
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
                                <Link href="#" variant="body2" onClick={() => navigate('/signin')}>
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Box mt={5}>
                    <Copyright />
                </Box>
            </Container>
        </ThemeProvider >
    );
}
