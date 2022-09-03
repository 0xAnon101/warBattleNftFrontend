import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import SelectCharacter from "./Components/SelectCharacter";
import Arena from "./Components/Arena";
import GodOfWarNFT from "./utils/GodOfWarBattle.json";
import { GOERLI_CONTRACT_ADDRESS } from "./constants";
import "./styles/App.css";

// Constants
const TWITTER_HANDLE = "ray_V101";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [wrongChain, setWrongChain] = useState({});
  const [characterNFT, setCharacterNFT] = useState(null);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // Render Methods
  const renderNotConnectedContainer = () => (
    <>
      <div className="info-header">
        <p>
          This is your only chance to save the world against the might{" "}
          <i>Dragon Pepe</i>. You need to battle him in a CvP mode and reduce
          his HP to 0. If you can't fight alone, join other players on the
          server (next update), form a guild and slay the dragon.
        </p>
      </div>
      <button
        className="cta-button connect-wallet-button"
        onClick={connectWallet}
      >
        Connect Wallet To Get Started
      </button>
    </>
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
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }
      checkChain();
      console.log("checking chain");
      if (!wrongChain.value) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log("Connected with account: ", accounts[0]);
        setCurrentAccount(accounts[0]); // setting the current account
      }
    } catch (error) {
      console.log(error);
    }
  };

  // check for the chainID
  const checkChain = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });
    const rinkebyChainId = "0x5"; // for goerli
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
    console.log(provider, signer);
    const contractInstance = new ethers.Contract(
      GOERLI_CONTRACT_ADDRESS,
      GodOfWarNFT.abi,
      signer
    );

    return { provider, signer, contractInstance };
  };

  const setUserCharacterNFT = (value) => {
    setCharacterNFT(value);
  };

  const renderContent = () => {
    if (!currentAccount) {
      return renderNotConnectedContainer();
    } else if (currentAccount && characterNFT) {
      return (
        <Arena
          characterNFT={characterNFT}
          setCharacterNFT={setCharacterNFT}
          getContractInstance={getContractInstance}
        />
      );
    } else if (currentAccount && !characterNFT) {
      return (
        <SelectCharacter
          currentAccount={currentAccount}
          setCharacterNFT={setUserCharacterNFT}
          getContractInstance={getContractInstance}
        />
      );
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">🏹 PepeVerse Slayers 🏹</p>
          {renderContent()}
          <div className="accounts" style={currentAccount ? { top: "7%" } : {}}>
            {currentAccount && wrongChain.value
              ? wrongChain.msg
              : currentAccount || "0x0000000000000000000000000000000000000000"}
          </div>
        </div>
        <div className="footer-container">
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`Built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
