import { createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

const rpcUrl = process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC_URL;

export const evmConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  ssr: true,
  transports: {
    [sepolia.id]: http(rpcUrl),
  },
});

export const evmNetwork = {
  chain: sepolia,
  explorerUrl: sepolia.blockExplorers.default.url,
  name: 'Ethereum Sepolia',
} as const;

declare module 'wagmi' {
  interface Register {
    config: typeof evmConfig;
  }
}
