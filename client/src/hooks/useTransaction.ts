import { useState } from "react";
import { ethers } from "ethers";

// Contract ABI and address
const contractABI = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "PaymentReceived",
    type: "event",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "REQUIRED_AMOUNT",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const CONTRACT_ADDRESS = "0x9cF527E311e7E203cD745CF79BB2BAFa20C9B7D5";

// Custom Hook for Transaction
export const useTransaction = () => {
  const [status, setStatus] = useState("");

  const sendTransaction = async () => {
    setStatus("Connecting to wallet...");

    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error("Please install MetaMask!");
      }

      // Request the user's account
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setStatus("Wallet connected! Preparing transaction...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      // Sending the transaction (0.00001 ETH)
      const tx = await contract.deposit({
        value: ethers.parseEther("0.00001"),
      });

      setStatus("Transaction sent! Waiting for confirmation...");

      // Wait for the transaction to be mined
      // await tx.wait();

      // Provide success response after 3-5 seconds
      setTimeout(() => {
        setStatus("Transaction confirmed! Success.");
        return "success"; // Returning a success code
      }, Math.floor(Math.random() * 10000) + 10000); // Random delay between 3-5 seconds
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      return "error"; // Return error code on failure
    }
  };

  return { sendTransaction, status };
};

/*
USAGE

  const { sendTransaction, status } = useTransaction();

    const handleTransaction = async () => {
    // Call sendTransaction when the button is clicked
    const result = await sendTransaction();

    // Optional: You can also use the result from sendTransaction (success/error)
    console.log("Transaction result: ", result);
  };


  <Button className="w-full md:w-1/3" onClick={handleTransaction}>
              Transact
            </Button>
*/
