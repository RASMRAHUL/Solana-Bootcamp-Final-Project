import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as web3 from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import { useWallet } from "@solana/wallet-adapter-react";

require("@solana/wallet-adapter-react-ui/styles.css");

const WalletContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const network = useMemo(
    () => web3.clusterApiUrl("devnet") as WalletAdapterNetwork,
    []
  );
  const wallets = useMemo(() => [getPhantomWallet()], []);

  const { wallet, connect } = useWallet();

  const handleConnectMetamask = async () => {
    try {
      // Connect to Metamask
      await connect();
    } catch (error) {
      console.error("Error connecting to Metamask:", error);
    }
  };

  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect={true}>
        <WalletModalProvider>{children}</WalletModalProvider>
        {wallet && wallet.connected ? (
          // Render your app content when Metamask is connected
          <>{children}</>
        ) : (
          // Render a button to connect Metamask
          <button onClick={handleConnectMetamask}>Connect Metamask</button>
        )}
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
