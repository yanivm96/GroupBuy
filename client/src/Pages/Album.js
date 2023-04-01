import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useEffect } from 'react';
import { Header } from '../comp/Header';
import GroupCard from '../comp/GroupCard';

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
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

export default function Album(props) {
  const [groups, setGroups] = useState([]);
  const isLoggedIn = props.isLoggedIn;
  const loggedInID = props.loggedInID;
  const isSeller = props.isSeller;

  useEffect(() => {
    axios.get('http://localhost:5000/group/all')
      .then(response => {
        setGroups(JSON.parse(response.data));
      })
      .catch(error => {
        console.log(error);
      });
  }, [isLoggedIn]);

  return (
    <div>

      <CssBaseline />
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">

          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {groups.map((group) => (
              <Grid item key={group} xs={100} sm={10} md={5}>
                <GroupCard 
                price={group.price} 
                amountOfPeople={group.amount_of_people} 
                itemName={group.item_name} 
                image={group.image}
                description={group.item_description}
                isLoggedIn={isLoggedIn}
                groupID={group._id.$oid}
                loggedInID={loggedInID}
                isSeller={isSeller}>
                </GroupCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
        </Typography>
      </Box>
    </div>
  );
}