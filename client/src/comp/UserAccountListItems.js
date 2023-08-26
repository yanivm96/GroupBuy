import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';


const UserAccountListItems = (props) => {
  const navigate = useNavigate();

  const [user_id, setUserID] = useState(props.user_id);


  const handleAccountClick = () => {
    navigate('/User', { state: { user_id } });
  };

  const handleOrderClick = () => {

    navigate('/User/Orders', { state: { user_id } });
  };

  const handleLikeClick = () => {
    navigate('/User/Likes', { state: { user_id } });
  };

  return (
    <React.Fragment>
      <ListItemButton onClick={handleAccountClick}>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Account" />
      </ListItemButton>
      <ListItemButton onClick={handleLikeClick}>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Liked Groups" />
      </ListItemButton>
    </React.Fragment>
  );
};

export default UserAccountListItems;
