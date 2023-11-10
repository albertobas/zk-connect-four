import { Provider } from 'react-redux';
import { localhost, sepolia } from 'wagmi/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';
import type { PropsWithChildren } from 'react';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { store } from '../state';
import { isInstanceOfNetwork } from '../helpers';

function ReduxProvider({ children }: PropsWithChildren): JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}

function WagmiProvider({ children }: PropsWithChildren): JSX.Element {
  const networkName = process.env.NEXT_PUBLIC_NETWORK_NAME;

  if (!isInstanceOfNetwork(networkName)) {
    throw new Error(
      'Either the network is not defined or it is different to Sepolia or Localhost'
    );
  }

  if (networkName === 'sepolia') {
    const { chains, publicClient, webSocketPublicClient } = configureChains(
      [sepolia],
      [
        jsonRpcProvider({
          rpc: (chain) => ({ http: `/api/${chain.name.toLowerCase()}` })
        })
      ]
    );

    const config = createConfig({
      autoConnect: true,
      connectors: [new MetaMaskConnector({ chains })],
      publicClient,
      webSocketPublicClient
    });
    return <WagmiConfig config={config}>{children}</WagmiConfig>;
  }

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [localhost],
    [publicProvider()]
  );

  const config = createConfig({
    autoConnect: true,
    connectors: [new MetaMaskConnector({ chains })],
    publicClient,
    webSocketPublicClient
  });
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}

export function Providers({ children }: PropsWithChildren): JSX.Element {
  return (
    <ReduxProvider>
      <WagmiProvider>{children}</WagmiProvider>
    </ReduxProvider>
  );
}
