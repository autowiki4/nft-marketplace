const { mainnet, polygonAmoy } = require("@reown/appkit/networks");

require("@nomiclabs/hardhat-waffle");
require("@nomicfoundation/hardhat-toolbox"); // add this
require("dotenv").config(); // add this for .env

const { privateKey, projectId } = process.env;

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    //  unused configuration commented out for now
    polygonAmoy: {
      url: "https://polygon-amoy.infura.io/v3/${projectId}",
      accounts: [privateKey],
      chainId: 80002,
    },
    mainnet: {
      url: "https://polygon-mainnet.infura.io/v3/${projectId}",
      accounts: [privateKey],
      chainId: 137,
    },
    solidity: {
      version: "0.8.4",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
