"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Web3Modal from "web3modal";
import { nftmarketaddress } from "../../../config";
import NFTMarket from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function ResellNFT() {
  const [formInput, setFormInput] = useState({ price: "", image: "" });
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id");
  const tokenURI = searchParams.get("tokenURI");
  const { image, price } = formInput;

  useEffect(() => {
    if (tokenURI) {
      fetchNFT();
    }
  }, [tokenURI]);

  async function fetchNFT() {
    if (!tokenURI) return;
    try {
      const meta = await axios.get(tokenURI);
      setFormInput((state) => ({ ...state, image: meta.data.image }));
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
    }
  }

  async function listNFTForSale() {
    if (!price || !id) return;

    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection); // ✅ v6
      const signer = await provider.getSigner();

      const marketContract = new ethers.Contract(
        nftmarketaddress,
        NFTMarket.abi,
        signer
      );

      const priceFormatted = ethers.parseEther(price); // ✅ v6
      const listingPrice = await marketContract.getListingPrice();

      const transaction = await marketContract.resellToken(
        BigInt(id!), // ✅ Convert string id to BigInt
        priceFormatted,
        { value: listingPrice }
      );

      await transaction.wait();
      router.push("/");
    } catch (error) {
      console.error("Error reselling NFT:", error);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12 p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Resell NFT</h1>

        <input
          placeholder="Asset Price in Eth"
          className="mt-2 border rounded p-4 w-full"
          value={price}
          onChange={(e) =>
            setFormInput({ ...formInput, price: e.target.value })
          }
        />

        {image && (
          <img
            className="rounded mt-4 mx-auto"
            width="350"
            src={image}
            alt="NFT Preview"
          />
        )}

        <button
          onClick={listNFTForSale}
          disabled={!price || !id}
          className="font-bold mt-4 w-full bg-pink-500 text-white rounded p-4 shadow-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
