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


const SellerAccountListItems = (props) => {
  const navigate = useNavigate();

  const [seller_id, setUserID] = useState(props.seller_id);
  


  const handleAccountClick = () => {
    console.log(props.seller_id)
    navigate('/Seller', { state: { seller_id } });
  };

  const handleOrderClick = () => {

    navigate('/Selller/Orders', { state: { seller_id } });
  };

  const handleLikeClick = () => {
    console.log(props.seller_id)
    navigate('/Seller/Likes', { state: { seller_id } });
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

export default SellerAccountListItems;
