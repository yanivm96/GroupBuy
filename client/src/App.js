import { BrowserRouter, Routes, Route } from "react-router-dom";
import Album from "./Pages/Album";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import { Header } from "./comp/Header";
import { useState, useEffect, } from 'react';
import axios from 'axios';
import { ethers } from "ethers"
import { init, useConnectWallet } from '@web3-onboard/react'
import injectedModule from '@web3-onboard/injected-wallets'
import SellerAccount from "./Pages/SellerAccount"
import SellerLikes from "./Pages/SellerLikes"
import UserAccount from "./Pages/UserAccount"
import UserLikes from "./Pages/UserLikes"
import { apiUrl } from './url';

const apiKey = '1730eff0-9d50-4382-a3fe-89f0d34a2070'
const injected = injectedModule()
const infuraKey = '<INFURA_KEY>'
const rpcUrl = 'https://mainnet.infura.io/v3/${infuraKey}'


init({
  apiKey,
  wallets: [injected],
  chains: [
    // {
    //   id: '0x1',
    //   token: 'ETH',
    //   label: 'Ethereum Mainnet',
    //   rpcUrl
    // }
    {
      id: 11155111,
      token: 'ETH',
      label: 'Sepolia',
    },
  ]
})

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [loggedInID, setloggedInID] = useState("");
  const [provider, setProvider] = useState(null);

  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()
  const https = require('https')
  const agent = new https.Agent({
    rejectUnauthorized: false,
  })

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkLogin(token);
      connect()
    } else return;
  }, [wallet]);
  console.log(apiUrl)
  const checkLogin = async (token) => {
    try {
      await axios
        .get(apiUrl + "login", {
          httpsAgent: agent,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {

          if (wallet) {
            let ethersProvider = new ethers.providers.Web3Provider(wallet.provider, 'any')
            setProvider(ethersProvider)
            console.log(ethersProvider)
          }
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
      <Header isLoggedIn={isLoggedIn} isSeller={isSeller} loggedInID={loggedInID} provider={provider}> </Header>
      <Routes>
        <Route path="/" element={<Album isSeller={isSeller} isLoggedIn={isLoggedIn} loggedInID={loggedInID} provider={provider} />} />
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
