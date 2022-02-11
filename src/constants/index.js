const RINKEBY_CONTRACT_ADDRESS = process.env.REACT_APP_RINKEBY_CONTRACT_ADDRESS;

const transformCharacterData = (characterData, TEST) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp,
    maxHp: characterData.maxHp,
    attackDamage: characterData.attackDamage,
    superAttackDamage: characterData.superAttackDamage,
    defense: characterData.defense,
  };
};

export { RINKEBY_CONTRACT_ADDRESS, transformCharacterData };
