"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import Web3Modal from "web3modal";
import { nftaddress, nftmarketaddress } from "../../../config";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import NFTMarket from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function CreateNFT() {
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function listNFTForSale() {
    setLoading(true);
    try {
      // ✅ FAKE IPFS URL - tests contract + MetaMask only
      const url = "https://ipfs.io/ipfs/QmTestMetadata123";

      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.BrowserProvider(connection);
      const signer = await provider.getSigner();

      // Mint NFT
      const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer);
      let transaction = await nftContract.createToken(url);
      const tx = await transaction.wait();

      const tokenId = tx.logs[0]?.args?.tokenId?.toNumber() || 0;
      console.log("✅ Minted tokenId:", tokenId);

      // List on market
      const marketContract = new ethers.Contract(
        nftmarketaddress,
        NFTMarket.abi,
        signer
      );
      const price = ethers.parseEther(formInput.price);
      const listingPrice = await marketContract.getListingPrice();

      transaction = await marketContract.createMarketItem(
        nftaddress,
        tokenId,
        price,
        { value: listingPrice }
      );
      await transaction.wait();

      router.push("/");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          value={formInput.name}
          onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          value={formInput.description}
          onChange={(e) =>
            setFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Eth (e.g. 0.01)"
          className="mt-2 border rounded p-4"
          value={formInput.price}
          onChange={(e) =>
            setFormInput({ ...formInput, price: e.target.value })
          }
        />
        <button
          onClick={listNFTForSale}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg hover:bg-pink-600 disabled:opacity-50"
          disabled={
            !formInput.name ||
            !formInput.description ||
            !formInput.price ||
            loading
          }
        >
          {loading ? "Creating..." : "Create NFT"}
        </button>
      </div>
    </div>
  );
}
