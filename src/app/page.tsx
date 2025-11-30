"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "../../config";
import NFTMarket from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

type NftItem = {
  price: string;
  tokenId: number;
  seller: string;
  owner: string;
  image: string;
  name: string;
  description: string;
};

export default function Home() {
  const [nfts, setNfts] = useState<NftItem[]>([]);
  const [loadingState, setLoadingState] = useState<"not-loaded" | "loaded">(
    "not-loaded"
  );

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    // Generic provider and query for unsold market items
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection);

    // ✅ Check correct network
    const network = await provider.getNetwork();
    if (network.chainId !== 80002n) {
      // Polygon Amoy
      alert("Switch MetaMask to Polygon Amoy (Chain ID 80002)");
      return [];
    }

    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      nftmarketaddress,
      NFTMarket.abi,
      signer
    );

    const data = await contract.fetchMarketItems();

    // Map items and fetch metadata
    const items: NftItem[] = await Promise.all(
      data.map(async (i: any) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);

        const price = ethers.formatUnits(i.price.toString(), "ether"); // v6

        return {
          price,
          tokenId: Number(i.tokenId),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
      })
    );

    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft: NftItem) {
    // User signs tx via wallet
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.BrowserProvider(connection); // v6
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      nftmarketaddress,
      NFTMarket.abi,
      signer
    );

    const price = ethers.parseUnits(nft.price.toString(), "ether"); // v6

    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );

    await transaction.wait();
    loadNFTs();
  }

  if (loadingState === "loaded" && !nfts.length) {
    return <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>;
  }

  return (
    <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} alt={nft.name} />
              <div className="p-4">
                <p
                  style={{ height: "64px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">{nft.price} ETH</p>
                <button
                  className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                  onClick={() => buyNft(nft)}
                >
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
