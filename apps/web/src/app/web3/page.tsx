import type { Metadata } from 'next';

import { Web3PracticePage } from '../../features/web3/Web3PracticePage';

export const metadata: Metadata = {
  title: 'On T / Web3 Lab',
  description: 'Learn typed Ethereum and Solana wallet interactions',
};

export default function Web3Page() {
  return <Web3PracticePage />;
}
