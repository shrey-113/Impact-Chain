// src/components/CreateWalletButton.tsx

import React, { useState } from 'react';
import { IoIosWallet } from "react-icons/io";
import { connectWallet } from '../provider'; // Import the connectWallet function

type CreateWalletButtonProps = {
  onConnect?: (address: string | null) => void; // Optional callback for when the wallet is connected
};

const CreateWalletButton: React.FC<CreateWalletButtonProps> = ({ onConnect }) => {
  const [address, setAddress] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    const connectedAddress = await connectWallet();
    setAddress(connectedAddress);
    if (onConnect) {
      onConnect(connectedAddress); // Pass the connected address back to the parent component (Navbar or App)
    }
  };

  return (
    <div>
      {!address ? (
        <button
  onClick={handleConnectWallet}
  className="flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-200 ease-in-out"
>
  <IoIosWallet className="text-xl mr-2" /> {/* Adjust size and margin */}
  Connect Wallet
</button>
      ) : (
        <div className="text-sm text-gray-500 mt-2">
          Connected: {address}
        </div>
      )}
    </div>
  );
};

export default CreateWalletButton;
