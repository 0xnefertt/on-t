'use client';

import { useBalance, useWalletConnection } from '@solana/react-hooks';
import { useState, type FormEvent } from 'react';

import {
  bytesToHex,
  formatSolBalance,
  getErrorMessage,
  shortenAddress,
} from '../utils';
import styles from '../Web3PracticePage.module.css';

const defaultMessage = 'I am learning typed Solana wallet interactions.';
const explorerUrl = 'https://explorer.solana.com';

export function SolanaWalletPanel() {
  const {
    connectors,
    connect,
    connecting,
    disconnect,
    error: connectionError,
    isReady,
    wallet,
  } = useWalletConnection();
  const balance = useBalance(wallet?.account.address);
  const [message, setMessage] = useState(defaultMessage);
  const [signature, setSignature] = useState<string>();
  const [signingError, setSigningError] = useState<unknown>();
  const [isSigning, setIsSigning] = useState(false);

  const address = wallet?.account.address.toString();
  const availableConnectors = connectors.filter(
    (connector) => connector.ready !== false,
  );
  const error = connectionError ?? signingError ?? balance.error;

  async function handleSignMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!wallet?.signMessage) {
      setSigningError(
        new Error('This wallet does not support Solana message signing.'),
      );
      return;
    }

    setIsSigning(true);
    setSigningError(undefined);
    setSignature(undefined);

    try {
      const signedBytes = await wallet.signMessage(
        new TextEncoder().encode(message),
      );
      setSignature(bytesToHex(signedBytes));
    } catch (signError) {
      setSigningError(signError);
    } finally {
      setIsSigning(false);
    }
  }

  return (
    <article className={`${styles.chainCard} ${styles.solanaCard}`}>
      <div className={styles.chainHeader}>
        <div>
          <p className={styles.eyebrow}>SVM / DEVNET</p>
          <h2>Solana</h2>
        </div>
        <span className={styles.networkBadge}>Solana Devnet</span>
      </div>

      <p className={styles.chainDescription}>
        Solana Client discovers Wallet Standard providers and React Hooks expose
        wallet state without converting Solana addresses into EVM types.
      </p>

      {!isReady ? (
        <p className={styles.loadingMessage}>Discovering browser wallets…</p>
      ) : !wallet || !address ? (
        <div className={styles.connectSection}>
          <p>Choose an installed Wallet Standard wallet.</p>
          {availableConnectors.length > 0 ? (
            <div className={styles.buttonRow}>
              {availableConnectors.map((connector) => (
                <button
                  className={styles.primaryButton}
                  disabled={connecting}
                  key={connector.id}
                  onClick={() => void connect(connector.id)}
                  type="button"
                >
                  {connecting ? 'Connecting…' : `Connect ${connector.name}`}
                </button>
              ))}
            </div>
          ) : (
            <p className={styles.walletHint}>
              No compatible wallet was found. Install Phantom, Solflare, or
              Backpack, then refresh this page.
            </p>
          )}
        </div>
      ) : (
        <div className={styles.walletDetails}>
          <dl>
            <div>
              <dt>Address</dt>
              <dd title={address}>{shortenAddress(address)}</dd>
            </div>
            <div>
              <dt>Balance</dt>
              <dd>{formatSolBalance(balance.lamports)}</dd>
            </div>
            <div>
              <dt>Wallet</dt>
              <dd>{wallet.connector.name}</dd>
            </div>
          </dl>

          <form className={styles.signForm} onSubmit={handleSignMessage}>
            <label htmlFor="solana-message">Message to sign</label>
            <textarea
              id="solana-message"
              onChange={(event) => setMessage(event.target.value)}
              rows={3}
              value={message}
            />
            <button
              className={styles.primaryButton}
              disabled={isSigning || !message.trim() || !wallet.signMessage}
              type="submit"
            >
              {isSigning ? 'Waiting for wallet…' : 'Sign message'}
            </button>
          </form>

          {signature ? (
            <div className={styles.resultBox}>
              <strong>Signature bytes</strong>
              <code>{signature}</code>
            </div>
          ) : null}

          <div className={styles.buttonRow}>
            <a
              className={styles.textLink}
              href={`${explorerUrl}/address/${address}?cluster=devnet`}
              rel="noreferrer"
              target="_blank"
            >
              Open in Solana Explorer ↗
            </a>
            <button
              className={styles.ghostButton}
              onClick={() => void disconnect()}
              type="button"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {error ? (
        <p className={styles.errorMessage} role="alert">
          {getErrorMessage(error)}
        </p>
      ) : null}

      <details className={styles.sourceNote}>
        <summary>What should I read?</summary>
        <p>
          Follow <code>useWalletConnection</code> into the optional{' '}
          <code>signMessage</code> capability. The capability check is part of
          the type-safe error path.
        </p>
      </details>
    </article>
  );
}
