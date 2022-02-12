import React, { useEffect, useState } from "react";
import { transformCharacterData } from "../../constants";

import "./SelectCharacter.css";

const SelectCharacter = ({
  currentAccount,
  getContractInstance,
  setCharacterNFT,
}) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  // checks and sets the character data
  useEffect(() => {
    const fetchNFTMetadata = async () => {
      console.log("Checking for Character NFT on address:", currentAccount);
      const { contractInstance } = await getContractInstance(window.ethereum);
      if (contractInstance) {
        console.log(contractInstance);
        const txn = await contractInstance.checkIfUserHasNFT();

        if (txn.name) {
          console.log("User has character NFT", txn);
          setCharacterNFT(transformCharacterData(txn));
        } else {
          console.log("No character NFT found");
        }
      }
    };

    if (currentAccount) {
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  useEffect(() => {
    async function fetchData() {
      const { contractInstance } = await getContractInstance(window.ethereum);
      setGameContract(contractInstance); // sets the gaming contract state
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function getDefaultCharacters() {
      try {
        console.log("fetching default characters...");
        const defaultCharacters = await gameContract.getAllDefaultCharacters();
        const chars = defaultCharacters.map((charData) =>
          transformCharacterData(charData)
        );
        setCharacters(chars); // sets the default character from the game contract
      } catch (err) {
        console.log(`Error while fetching the default characters`);
      }
    }

    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId} characterIndex: ${characterIndex}`
      );
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log("CharacterNFT: ", characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
      }
    };

    if (gameContract) {
      getDefaultCharacters();
      gameContract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      console.log("User has character NFT, getting unmounted chil");
      if (gameContract) {
        gameContract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [gameContract]);

  const renderCharacters = () =>
    characters.map((character, index) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img src={character.imageURI} alt={character.name} />
        <button
          type="button"
          className="character-mint-button"
          onClick={mintCharacterNFTAction(index)}
        >
          {<span>Mint</span>}
        </button>
      </div>
    ));

  const mintCharacterNFTAction = (characterId) => async () => {
    try {
      if (gameContract) {
        console.log("Minting character in progress...");
        const mintTxn = await gameContract.mintCharacterNFT(characterId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
    }
  };

  console.log("okil render()", characters);

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
    </div>
  );
};

export default SelectCharacter;
