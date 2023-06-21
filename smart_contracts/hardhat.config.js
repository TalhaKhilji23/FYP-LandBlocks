require("@nomiclabs/hardhat-waffle");
module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "goerli",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/mEat99T3AKXWSOPjrPINi5fiQcAGkFBD",
      accounts: [
        "0x38d8923368e74b451b816c6348667d31edbd17e03a7d5df757a34cc6b2c9f24a",
      ],
    },
  },
};
