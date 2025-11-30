const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // ✅ YOUR contracts: NFTMarket + NFT (tutorial uses NFTMarketplace)
  const NFTMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFTMarket.deploy();
  await nftMarket.waitForDeployment(); // ✅ ethers v6
  console.log("NFTMarket deployed to:", await nftMarket.getAddress());

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy(await nftMarket.getAddress());
  await nft.waitForDeployment(); // ✅ ethers v6
  console.log("NFT deployed to:", await nft.getAddress());

  const [deployer] = await hre.ethers.getSigners();
  await nft
    .connect(deployer)
    .setApprovalForAll(await nftMarket.getAddress(), true);

  // ✅ Perfect config.js for YOUR frontend
  fs.writeFileSync(
    "./config.js",
    `
export const nftaddress = "${await nft.getAddress()}";
export const nftmarketaddress = "${await nftMarket.getAddress()}";
  `
  );
  console.log("✅ config.js updated!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
