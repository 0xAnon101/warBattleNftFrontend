import React, { useEffect, useState } from "react";
import { transformCharacterData } from "../../constants";

import "./Arena.css";

const Arena = ({ characterNFT, getContractInstance }) => {
  const [gameContract, setGameContract] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const { contractInstance } = await getContractInstance(window.ethereum);
      setGameContract(contractInstance); // sets the gaming contract state
    }
    fetchData();
  }, []);

  return (
    <div className="arena-container">
      <p>BOSS GOES HERE</p>
      <p>CHARACTER NFT GOES HERE</p>
    </div>
  );
};

export default Arena;
