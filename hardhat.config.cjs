require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337, // Keeps MetaMask compatibility
    },
    localhost: {
      // Explicit localhost for clarity
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    polygonAmoy: {
      url: `https://polygon-amoy.infura.io/v3/${process.env.PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80002,
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.PROJECT_ID}`, // Fixed: was polygon-mainnet
      accounts: [process.env.PRIVATE_KEY],
      chainId: 1, // Fixed: mainnet is 1, not 137
    },
  },
};
