import { useEffect, useState } from "react";
import { ethers } from "ethers";

export const useContract = (
  contractAddress: string | null,
  contractABI: ethers.InterfaceAbi,
  provider: ethers.BrowserProvider | null
): ethers.Contract | null => {
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const initializeContract = async () => {
      if (contractAddress && provider) {
        try {
          const signer = await provider.getSigner();
          const newContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setContract(newContract);
        } catch (err) {
          console.error("Error initializing contract:", err);
        }
      }
    };

    initializeContract();
  }, [contractAddress, contractABI, provider]);

  return contract;
};
