import * as React from 'react';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import axios from 'axios';
import { useEffect, useState } from 'react';



axios.defaults.withCredentials = true;
let axiosConfig = {
  headers: {
    credentials: "include",
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
};

export default function LikeButton(props) {
  const [likedButton, setLikedButton] = React.useState("")
  const loggedInID = props.loggedInID
  const groupID = props.groupID

  const userInput = {
    userID: loggedInID,
    groupID: groupID.$oid,
  };
  
  useEffect(() => {
    axios.post("http://localhost:5000/group/like", JSON.stringify(userInput), axiosConfig)
      .then(response => {
        if (response.data["like"] === true) {
          setLikedButton("solid");
        } else {
          setLikedButton("");
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, []);


  const handleLikeButton = (event) => {
    axios.put('http://localhost:5000/group/manage_like', {
      userID: loggedInID,
      groupID: groupID.$oid,
    }).then((response) => {
      if (response.data["joined"] == false) {
        setLikedButton("")
      }
      else {
        setLikedButton("solid")
      }
    })
      .catch((error) => {
        console.log(error);
      });

  }





  return (
    <IconButton
      onClick={handleLikeButton}
      aria-label="Like minimal photography"
      size="md"
      variant={likedButton}
      color="danger"
      sx={{
        position: 'absolute',
        zIndex: 2,
        borderRadius: '50%',
        right: '1rem',
        bottom: 520,
        transform: 'translateY(50%)',
      }}
    >
      <Favorite />
    </IconButton>
  );
}