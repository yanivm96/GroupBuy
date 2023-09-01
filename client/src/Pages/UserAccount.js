import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import UserAccountListItems from '../comp/UserAccountListItems'
import ProductsList from '../comp/ProductsList'
import axios from 'axios';
import SmartContractABI from SmartContractABI;
import { contractAddress } from "../contractAddress.js"
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const drawerWidth = 240;

let axiosConfig = {
  headers: {
    credentials: "include",
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
};


const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

export default function Dashboard(props) {
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const location = useLocation();
  const [allGroups, setAllGroups] = useState([]);
  const [userDetails, setuserDetails] = useState([]);
  const [like, setLike] = useState(false);
  const [user_id, setUserID] = useState(location.state?.user_id);
  const [update, setUpdate] = useState(0);


  useEffect(() => {
    axios.post('http://localhost:5000/group/user_groups', JSON.stringify({ "user_id": user_id }), axiosConfig)
      .then(response => {
        setAllGroups(JSON.parse(response.data));
      })
      .catch(error => {
        console.log(error);
      });

    axios.post('http://localhost:5000/user/details', JSON.stringify({ "user_id": user_id }), axiosConfig)
      .then(response => {
        setuserDetails(JSON.parse(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  }, [update]);


  function handleDelete(event) {
    axios.put("http://localhost:5000/group/leave", JSON.stringify({
      "group_id": event.$oid,
      "user_id": user_id
    }), axiosConfig)
      .then(async response => {

        let signer = await props.provider.getSigner();
        let contract = new ethers.Contract(
            contractAddress,
            SmartContractABI,
            signer
        );
        
        const tx = await contract.refund(event.$oid);
        await tx.wait();
        console.log(tx)

        if (update < 10) {
          setUpdate(update + 1)
        }
        else {
          setUpdate(0)
        }
      })
      .catch(error => {
      });
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <UserAccountListItems user_id={user_id}/>
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ flexGrow: 1 }}>
                <Paper
                  sx={{
                    p: 2,
                    flexDirection: 'column',
                    height: 200,
                    display: 'flex',
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    User Details
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    <strong>Name:</strong> {userDetails.fname} {userDetails.lname}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    <strong>Username:</strong> {userDetails.username}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 1 }}>
                    <strong>Email:</strong> {userDetails.email}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <ProductsList
                  handleDelete={handleDelete}
                  seller_id={""}
                  products={allGroups}
                  like={like}>
                </ProductsList>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}