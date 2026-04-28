import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  isConnected,
  getPublicKey,
  isAllowed,
  setAllowed,
} from '@stellar/freighter-api';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [publicKey, setPublicKey] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connect = useCallback(async () => {
    setConnecting(true);
    setError(null);
    try {
      const connected = await isConnected();
      if (!connected) {
        setError('Freighter wallet not found. Please install the Freighter browser extension.');
        setConnecting(false);
        return;
      }

      const allowed = await isAllowed();
      if (!allowed) {
        await setAllowed();
      }

      const key = await getPublicKey();
      setPublicKey(key);
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setPublicKey(null);
  }, []);

  const shortKey = publicKey
    ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
    : null;

  return (
    <WalletContext.Provider value={{ publicKey, shortKey, connecting, error, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
