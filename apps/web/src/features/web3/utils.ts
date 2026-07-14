export function shortenAddress(address: string, visibleCharacters = 6) {
  if (address.length <= visibleCharacters * 2 + 1) {
    return address;
  }

  return `${address.slice(0, visibleCharacters)}…${address.slice(-visibleCharacters)}`;
}

export function formatSolBalance(lamports: bigint | null | undefined) {
  if (lamports === null || lamports === undefined) {
    return '—';
  }

  const sol = Number(lamports) / 1_000_000_000;
  return `${sol.toLocaleString('en-US', { maximumFractionDigits: 4 })} SOL`;
}

export function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join(
    '',
  );
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'An unknown error occurred.';
}
