const { mainnet, polygonAmoy } = require("@reown/appkit/networks");

require("@nomiclabs/hardhat-waffle");
const fs = required('fs')
const privateKey = fs.readFileSync(".secret").toString().trim()()
const projectId = '3423df6b2f7f46659b77b598e4398bdc'

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
      chainId: 80002
    },
    mainnet: {
      url: 'https://polygon-mainnet.infura.io/v3/${projectId}',
      accounts: [privateKey],
      chainId: 137
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
};
