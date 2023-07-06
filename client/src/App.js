import { BrowserRouter, Routes, Route } from "react-router-dom";
import Album from "./Pages/Album";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import { Header } from "./comp/Header";
import { useState, useEffect, } from 'react';
import axios from 'axios';
import SellerAccount from "./Pages/SellerAccount"
import SellerLikes from "./Pages/SellerLikes"

import UserAccount from "./Pages/UserAccount"
import UserLikes from "./Pages/UserLikes"


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [loggedInID, setloggedInID] = useState("");
  console.log(isLoggedIn)

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkLogin(token);
    } else return;
  }, []);

  const checkLogin = async (token) => {
    try {
      await axios
        .get("http://localhost:5000/login", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setIsLoggedIn(response.data.exists)
          
          setIsSeller(response.data.isSeller)
          setloggedInID(response.data._id)
        })
    } catch (e) {
      setIsLoggedIn(false);
      setloggedInID("");
      setIsSeller(false);
    }
  };




  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn} isSeller={isSeller} loggedInID={loggedInID}> </Header>
      <Routes>
        <Route path="/" element={<Album isSeller={isSeller} isLoggedIn={isLoggedIn} loggedInID={loggedInID}/>} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Seller" element={<SellerAccount />} />
        <Route path="/User" element={<UserAccount />} />
        <Route path="/User/Likes" element={<UserLikes />} />
        <Route path="/Seller/Likes" element={<SellerLikes />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App;
