"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/navigation";
import { nftmarketaddress } from "../../../config";
import NFTMarket from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

type NftItem = {
  price: string;
  tokenId: number;
  seller: string;
  owner: string;
  image: string;
  tokenURI: string;
};

export default function MyNFTs() {
  const [nfts, setNfts] = useState<NftItem[]>([]);
  const [loadingState, setLoadingState] = useState<"not-loaded" | "loaded">(
    "not-loaded"
  );
  const router = useRouter();

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    try {
      const web3Modal = new Web3Modal({
        network: "hardhat", // Local testing
        cacheProvider: true,
      });
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection); // ✅ v6
      const signer = await provider.getSigner();

      const marketContract = new ethers.Contract(
        nftmarketaddress,
        NFTMarket.abi,
        signer
      );

      const data = await marketContract.fetchMyNFTs();
      if (data.length === 0) {
        setNfts([]);
        setLoadingState("loaded");
        return;
      }
      const items: NftItem[] = await Promise.all(
        data.map(async (item: any) => {
          // Access struct fields by index (ethers v6 tuple decoding)
          const tokenId = item[2]; // tokenId index 2
          const tokenURI = await marketContract.tokenURI(tokenId);
          const meta = await axios.get(tokenURI);

          const price = ethers.formatEther(item[5]); // price index 5, v6 formatEther

          return {
            price,
            tokenId: Number(tokenId),
            seller: item[3], // seller index 3
            owner: item[4], // owner index 4
            image: meta.data.image,
            tokenURI,
          };
        })
      );

      setNfts(items);
      setLoadingState("loaded");
    } catch (error) {
      console.error("Error loading NFTs:", error);
      setLoadingState("loaded");
    }
  }

  function listNFT(nft: NftItem) {
    // App Router navigation with search params
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }

  if (loadingState === "loaded" && !nfts.length) {
    return <h1 className="py-10 px-20 text-3xl text-center">No NFTs owned</h1>;
  }

  if (loadingState === "not-loaded") {
    return (
      <div className="flex justify-center py-20">
        <p className="text-xl">Loading your NFTs...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img
                src={nft.image}
                alt={nft.tokenId.toString()}
                className="rounded w-full h-48 object-cover"
              />
              <div className="p-4 bg-black">
                <p className="text-2xl font-bold text-white">
                  Price - {nft.price} ETH
                </p>
                <button
                  className="mt-4 w-full bg-pink-500 text-white font-bold py-2 px-12 rounded hover:bg-pink-600"
                  onClick={() => listNFT(nft)}
                >
                  List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
