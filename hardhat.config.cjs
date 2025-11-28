// const { mainnet, polygonAmoy } = require("@reown/appkit/networks");

// require("@nomicfoundation/hardhat-toolbox"); // add this
// require("dotenv").config();

// const { privateKey, projectId } = process.env;

// module.exports = {
//   defaultNetwork: "hardhat",
//   networks: {
//     hardhat: {
//       chainId: 1337,
//     },
//     //  unused configuration commented out for now
//     polygonAmoy: {
//       url: "https://polygon-amoy.infura.io/v3/${projectId}",
//       accounts: [privateKey],
//       chainId: 80002,
//     },
//     mainnet: {
//       url: "https://polygon-mainnet.infura.io/v3/${projectId}",
//       accounts: [privateKey],
//       chainId: 137,
//     },
//     solidity: {
//       version: "0.8.20",
//       settings: {
//         optimizer: {
//           enabled: true,
//           runs: 200,
//         },
//       },
//     },
//   },
// };

require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: { chainId: 1337 },
  },
};
