import { Provider } from 'react-redux';
import { localhost, sepolia } from 'wagmi/chains';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { publicProvider } from 'wagmi/providers/public';
import type { PropsWithChildren } from 'react';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { store } from '../state';

function ReduxProvider({ children }: PropsWithChildren): JSX.Element {
  return <Provider store={store}>{children}</Provider>;
}

function WagmiProvider({ children }: PropsWithChildren): JSX.Element {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [sepolia, localhost],
    [
      jsonRpcProvider({
        rpc: (chain) => {
          if (chain.id === sepolia.id) {
            return { http: `/api/sepolia` };
          }
          return null;
        }
      }),
      publicProvider()
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

export function Providers({ children }: PropsWithChildren): JSX.Element {
  return (
    <ReduxProvider>
      <WagmiProvider>{children}</WagmiProvider>
    </ReduxProvider>
  );
}
