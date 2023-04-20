import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useState,useEffect } from 'react';
import GroupCard from '../comp/GroupCard';
import Search from '../comp/Search';

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
  const [allGroups, setAllGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);

  const isLoggedIn = props.isLoggedIn;
  const loggedInID = props.loggedInID;
  const isSeller = props.isSeller;

  function handleGroupsFilter(newValue) {
    if (newValue === "") {
      setFilteredGroups(allGroups)
    }
    else {
      setFilteredGroups(allGroups.filter(group => group.item_name.toLowerCase().includes(newValue.toLowerCase())));
    }

  }

  useEffect(() => {
    axios.get('http://localhost:5000/group/all')
      .then(response => {
        setAllGroups(JSON.parse(response.data));
        setFilteredGroups(JSON.parse(response.data))
      })
      .catch(error => {
        console.log(error);
      });
  }, [isLoggedIn]);

  return (
    <div>
      <CssBaseline />
      <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
        display: 'flex',
        justifyContent: 'center' 
      }}
    >
        <Search onSearch={handleGroupsFilter} />
    </Box>

      <Container sx={{ py: 7 }} maxWidth="xl">
        <Grid container spacing={10}>
          {filteredGroups.map((group) => (
            <Grid item key={group} xs={12} sm={5} md={6} lg={3}>
              <GroupCard
                Group={group}
                isLoggedIn={isLoggedIn}
                loggedInID={loggedInID}
                isSeller={isSeller}>
              </GroupCard>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
        </Typography>
      </Box>
    </div>
  );
}