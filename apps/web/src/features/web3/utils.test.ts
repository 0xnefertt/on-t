import {
  bytesToHex,
  formatSolBalance,
  getErrorMessage,
  shortenAddress,
} from './utils';

describe('web3 formatting utilities', () => {
  it('shortens long wallet addresses without changing short values', () => {
    expect(shortenAddress('0x1234567890abcdef')).toBe('0x1234…abcdef');
    expect(shortenAddress('short')).toBe('short');
  });

  it('formats lamports as SOL', () => {
    expect(formatSolBalance(1_250_000_000n)).toBe('1.25 SOL');
    expect(formatSolBalance(null)).toBe('—');
  });

  it('encodes signature bytes as lowercase hexadecimal', () => {
    expect(bytesToHex(new Uint8Array([0, 15, 255]))).toBe('000fff');
  });

  it('normalizes unknown errors for user-facing messages', () => {
    expect(getErrorMessage(new Error('Wallet rejected the request.'))).toBe(
      'Wallet rejected the request.',
    );
    expect(getErrorMessage('rejected')).toBe('An unknown error occurred.');
  });
});
