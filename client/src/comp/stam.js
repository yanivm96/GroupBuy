import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ItemPurchaseABI from "./ItemPurchase.json"; // Replace this with your contract's ABI

const ItemPurchaseContractAddress = "0x..."; // Replace this with your contract's address
const itemPriceInWei = web3.utils.toWei("0.1", "ether"); // Replace with the actual item price in wei

const BuyItemButton = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  // Initialize Web3 and contract on component mount
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable(); // Request user permission to connect
        setWeb3(web3Instance);

        // Connect to the contract
        const contractInstance = new web3Instance.eth.Contract(ItemPurchaseABI, ItemPurchaseContractAddress);
        setContract(contractInstance);
      }
    };

    initWeb3();
  }, []);

  const handleBuyItemClick = async () => {
    try {
      if (contract) {
        // Send the transaction with value (itemPriceInWei)
        await contract.methods.buyItems("product_key").send({ value: itemPriceInWei });

        // Transaction successful, do something
        console.log("Item purchased successfully!");
      }
    } catch (error) {
      console.error("Error purchasing item:", error);
    }
  };

  return (
    <button onClick={handleBuyItemClick}>Buy Item</button>
  );
};

export default BuyItemButton;