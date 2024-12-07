import { createCoinbaseWalletSDK } from "@coinbase/wallet-sdk";

// Create and configure the Coinbase Wallet SDK
export const sdk = createCoinbaseWalletSDK({
  appName: "My Vite App", // Your app name
  appChainIds: [1], // Ethereum mainnet (you can also add other chains like Polygon or Optimism)
  preference: {
    options: "all", // Users will see all connection options (EOA, smart wallet)
    attribution: {
      auto: true, // Automatically generate attribution data (only relevant for smart wallets)
    },
  },
});
