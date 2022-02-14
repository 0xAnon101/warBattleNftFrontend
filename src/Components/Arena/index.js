import React, { useEffect, useState } from "react";
import { transformCharacterData } from "../../constants";

import "./progress.scss";
import "./Arena.css";

const Arena = ({ characterNFT, getContractInstance, setCharacterNFT }) => {
  const [gameContract, setGameContract] = useState(null);
  const [boss, setBoss] = useState(null);
  const [attackState, setAttackState] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { contractInstance } = await getContractInstance(window.ethereum);
      setGameContract(contractInstance); // sets the gaming contract state
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchBoss() {
      const bossData = await gameContract.getBoss();
      console.log(bossData, "boss data");
      setBoss(transformCharacterData(bossData));
    }

    const onAttackComplete = (bossHp, playerHp) => {
      console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

      setBoss((prevState) => {
        return { ...prevState, hp: bossHp };
      });

      setCharacterNFT((prevState) => {
        return { ...prevState, hp: playerHp };
      });
    };

    if (gameContract) {
      fetchBoss(); // fetches Boss from contract
      gameContract.on("AttackComplete", onAttackComplete);
    }

    return () => {
      if (gameContract) {
        gameContract.on("AttackComplete", onAttackComplete);
      }
    };
  }, [gameContract]);

  const runAttackAction = async () => {
    try {
      if (gameContract) {
        setAttackState("attacking");
        console.log("Attacking boss...");
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("");
      }
    } catch (error) {
      console.error("Error attacking boss:", error);
      setAttackState("");
    }
  };

  const renderLoader = () => (
    <div class="loader">
      <svg class="circular" viewBox="25 25 50 50">
        <circle
          class="path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="2"
          strokeiterlimit="10"
        />
      </svg>
      <svg class="logo" viewBox="0 0 50 50">
        <path
          class="circle"
          d="M25,9C16.2,9,9,16.2,9,25s7.2,16,16,16s16-7.2,16-16S33.8,9,25,9z"
        />
        <path
          class="swords"
          d="M32.8,31.1l-3-3l1.1-1.1c0.2-0.2,0.2-0.5,0-0.7c-0.2-0.2-0.5-0.2-0.7,0l-1.1,1.1l-2.4-2.4l6.4-6.5v-1.6h-1.6
		L25,23.3l-6.4-6.4H17v1.6l6.4,6.5L21,27.4l-1.1-1.1c-0.2-0.2-0.5-0.2-0.7,0c-0.2,0.2-0.2,0.5,0,0.7l1.1,1.1l-3,3
		c-0.4,0.4-0.4,1.2,0,1.6c0.4,0.4,1.2,0.4,1.6,0l3-3l1.1,1.1c0.2,0.2,0.5,0.2,0.7,0c0.2-0.2,0.2-0.5,0-0.7L22.6,29l2.4-2.4l2.4,2.4
		l-1.1,1.1c-0.2,0.2-0.2,0.5,0,0.7c0.2,0.2,0.5,0.2,0.7,0l1.1-1.1l3,3c0.4,0.4,1.2,0.4,1.6,0C33.3,32.3,33.3,31.6,32.8,31.1z"
        />
      </svg>
    </div>
  );

  return (
    <div className="arena-container">
      {!boss ? (
        renderLoader()
      ) : (
        <>
          <div className="boss-container">
            <div className={`boss-content ${attackState}`}>
              <h2>🔥 {boss.name} 🔥</h2>
              <div className="image-content">
                <img src={boss.imageURI} alt={`Boss ${boss.name}`} />

                <div class="bar-1">
                  <progress
                    class="bar-meter"
                    style={{ width: "100%" }}
                    value={boss.hp}
                    max={boss.maxHp}
                  />
                  <p className="health-text">{`${boss.hp} / ${boss.maxHp} HP`}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="info-container">
            <p>
              This is your only chance to save the world against the might{" "}
              <i>Dragon Pepe</i>. You need to battle him in a CvP mode and
              reduce his HP to 0. If you can't fight alone, join other players
              on the server, form a guild and slay the dragon.
            </p>
            {attackState === "attacking" ? (
              renderLoader()
            ) : (
              <button className="cta-button" onClick={runAttackAction}>
                <a href="#0" class="bttn">
                  {`💥 Attack Boss`}
                </a>
              </button>
            )}
          </div>

          {characterNFT && (
            <div className="players-container">
              <div className="player-content">
                <div className="player">
                  <h2>{characterNFT.name}</h2>
                  <div className="image-content">
                    <img
                      src={characterNFT.imageURI}
                      alt={`Character ${characterNFT.name}`}
                    />
                    <div class="bar-1">
                      <progress
                        class="bar-meter"
                        style={{ width: "100%" }}
                        value={characterNFT.hp}
                        max={characterNFT.maxHp}
                      />
                      <p className="health-text">{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="stats">
                <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Arena;
