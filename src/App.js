import React, { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import dotenv from "dotenv";

import GodOfWarNFT from "./utils/GodOfWarBattle.json";
import "./styles/App.css";
dotenv.config();

// Constants
const TWITTER_HANDLE = "anon101";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [wrongChain, setWrongChain] = useState({});
  const sectionRef = useRef();

  const RINKEBY_CONTRACT_ADDRESS =
    process.env.REACT_APP_RINKEBY_CONTRACT_ADDRESS;

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  // checks wallet on first load
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) {
      console.log("Make sure your Metamask is installed!");
    } else {
      checkChain();
      if (!wrongChain.value) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length !== 0) {
          setCurrentAccount(accounts[0]);
        } else {
          console.log("No authorized account found");
        }
      }
    }
  };

  // connects wallet on btn click
  const connectWallet = async () => {
    alert("hi");
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }
      checkChain();
      if (!wrongChain.value) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("Connected with account: ", accounts[0]);
        setCurrentAccount(accounts[0]);
        const { contractInstance } = getContractInstance(ethereum);
        console.log("attacking boss: ", contractInstance.attackBoss());
      }
    } catch (error) {
      console.log(error);
    }
  };

  // check for the chainID
  const checkChain = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });
    const rinkebyChainId = "0x4"; // for rinkeby
    if (chainId !== rinkebyChainId) {
      setWrongChain({ value: true, msg: "Wrong Network!" });
    } else {
      setWrongChain({ value: false, msg: "" });
    }
  };

  // gets you the contract instance to work with
  const getContractInstance = async (ethereum) => {
    const provider = await new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();
    const contractInstance = new ethers.Contract(
      RINKEBY_CONTRACT_ADDRESS,
      GodOfWarNFT.abi,
      signer
    );

    return { provider, signer, contractInstance };
  };

  return (
    <div className="App">
      <div className="container" ref={sectionRef}>
        <div className="content-container"></div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" />
          {renderNotConnectedContainer()}
          <a
            className="footer-text"
            // href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
