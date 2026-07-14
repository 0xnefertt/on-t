import { render, screen } from '@testing-library/react';

import { Web3PracticePage } from './Web3PracticePage';

jest.mock('./evm/EvmWalletPanel', () => ({
  EvmWalletPanel: () => <div>Ethereum wallet exercise</div>,
}));

jest.mock('./solana/SolanaWalletPanel', () => ({
  SolanaWalletPanel: () => <div>Solana wallet exercise</div>,
}));

describe('Web3PracticePage', () => {
  it('introduces both chains and the testnet safety boundary', () => {
    render(<Web3PracticePage />);

    expect(
      screen.getByRole('heading', { name: /Two chains. Two type systems./i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Ethereum wallet exercise')).toBeInTheDocument();
    expect(screen.getByText('Solana wallet exercise')).toBeInTheDocument();
    expect(screen.getByText(/Testnets only/i)).toBeInTheDocument();
  });
});
