import { sdk } from "./sdk";

// Create a provider from the Coinbase Wallet SDK
export const provider = sdk.getProvider();

// You can use the provider to request accounts, send transactions, etc.
export const connectWallet = async (): Promise<string | null> => {
  try {
    // Request accounts from the Coinbase Wallet provider
    const accounts = await provider.request({ method: "eth_requestAccounts" });
    return accounts[0] || null; // Return the first account (if available)
  } catch (error) {
    console.error("Connection failed:", error);
    return null;
  }
};
