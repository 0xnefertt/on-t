'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { SolanaClientConfig } from '@solana/client';
import { SolanaProvider } from '@solana/react-hooks';
import { useState, type ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { evmConfig } from '../features/web3/evm/config';

const solanaConfig: SolanaClientConfig = {
  cluster: 'devnet',
  rpc:
    process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL ??
    'https://api.devnet.solana.com',
  websocket:
    process.env.NEXT_PUBLIC_SOLANA_DEVNET_WEBSOCKET_URL ??
    'wss://api.devnet.solana.com',
};

type ProvidersProps = Readonly<{
  children: ReactNode;
}>;

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={evmConfig}>
      <QueryClientProvider client={queryClient}>
        <SolanaProvider
          config={solanaConfig}
          walletPersistence={{ autoConnect: false }}
        >
          {children}
        </SolanaProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
