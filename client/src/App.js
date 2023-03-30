import { BrowserRouter, Routes, Route } from "react-router-dom";
import Album from "./Pages/Album";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import { Header } from "./comp/Header";
import { useState, useEffect, } from 'react';
import axios from 'axios';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false)

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
        .then((response) => setIsLoggedIn(response.data.exists));
    } catch (e) {
      setIsLoggedIn(false);
    }
  };




  return (
    <BrowserRouter>
      <Header isLoggedIn={isLoggedIn}> </Header>
      <Routes>
        <Route path="/" element={<Album />} />
        <Route path="/SignIn" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
