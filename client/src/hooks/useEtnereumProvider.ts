import { useEffect, useState } from 'react';
import { BrowserProvider } from 'ethers';

interface EthereumProviderHook {
  provider: BrowserProvider | null;
  account: string | null;
  error: string | null;
}

export const useEthereumProvider = (): EthereumProviderHook => {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (window.ethereum) {
      const ethersProvider = new BrowserProvider(window.ethereum);
      setProvider(ethersProvider);

      const loadAccount = async () => {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);
        } catch (err) {
          console.error('Failed to connect MetaMask:', err);
          setError('Failed to connect MetaMask. Please try again.');
        }
      };

      loadAccount();

      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    } else {
      console.error('MetaMask is not installed.');
      setError('MetaMask is not installed. Please install it to continue.');
    }
  }, []);

  return { provider, account, error };
};
