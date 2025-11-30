"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftmarketaddress } from "../../../config";
import NFTMarket from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

type NftItem = {
  price: string;
  tokenId: number;
  seller: string;
  owner: string;
  image: string;
};

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState<NftItem[]>([]);
  const [loadingState, setLoadingState] = useState<"not-loaded" | "loaded">(
    "not-loaded"
  );

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    try {
      const web3Modal = new Web3Modal({
        network: "hardhat",
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();

      const marketContract = new ethers.Contract(
        nftmarketaddress,
        NFTMarket.abi,
        signer
      );

      const data = await marketContract.fetchItemsListed();

      // ✅ Empty check
      if (!data || data.length === 0) {
        setNfts([]);
        setLoadingState("loaded");
        return;
      }

      const items: NftItem[] = await Promise.all(
        data.map(async (item: any, index: number) => {
          try {
            // ✅ Safely access tokenId (index 2)
            const tokenId = item && item[2] ? item[2] : 0;

            // ✅ Check tokenId valid before tokenURI call
            if (!tokenId || tokenId === 0n) {
              console.warn(
                `Skipping invalid tokenId at index ${index}:`,
                tokenId
              );
              return null;
            }

            const tokenURI = await marketContract.tokenURI(tokenId);

            // ✅ Check tokenURI valid
            if (!tokenURI) {
              console.warn(`No tokenURI for tokenId ${tokenId}`);
              return null;
            }

            const meta = await axios.get(tokenURI.toString());
            const price = ethers.formatEther(item[5] || "0");

            return {
              price,
              tokenId: Number(tokenId),
              seller: item[3]?.toString() || "",
              owner: item[4]?.toString() || "",
              image: meta.data.image || "https://via.placeholder.com/300",
            };
          } catch (itemError) {
            console.error(`Error processing item ${index}:`, itemError);
            return null;
          }
        })
      );

      // ✅ Filter out null items
      const validItems = items.filter((item): item is NftItem => item !== null);
      setNfts(validItems);
      setLoadingState("loaded");
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setLoadingState("loaded");
    }
  }

  if (loadingState === "not-loaded") {
    return (
      <div className="flex justify-center py-20">
        <p className="text-xl">Loading your listed items...</p>
      </div>
    );
  }

  if (loadingState === "loaded" && !nfts.length) {
    return <h1 className="py-10 px-20 text-3xl text-center">No NFTs listed</h1>;
  }

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold py-4 text-center">Items Listed</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {nfts.map((nft, i) => (
          <div key={i} className="border shadow rounded-xl overflow-hidden">
            <img
              src={nft.image}
              alt={`NFT ${nft.tokenId}`}
              className="rounded w-full h-48 object-cover"
            />
            <div className="p-4 bg-black">
              <p className="text-2xl font-bold text-white">
                Price - {nft.price} ETH
              </p>
              <p className="text-sm text-gray-300 mt-1">
                Token ID: {nft.tokenId}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
