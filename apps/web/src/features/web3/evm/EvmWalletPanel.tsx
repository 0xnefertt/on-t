'use client';

import { useState, type FormEvent } from 'react';
import { formatEther } from 'viem';
import {
  useBalance,
  useConnect,
  useConnection,
  useConnectors,
  useDisconnect,
  useSignMessage,
  useSwitchChain,
} from 'wagmi';

import { getErrorMessage, shortenAddress } from '../utils';
import { evmNetwork } from './config';
import styles from '../Web3PracticePage.module.css';

const defaultMessage = 'I am learning typed Ethereum wallet interactions.';

export function EvmWalletPanel() {
  const connection = useConnection();
  const connectors = useConnectors();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const switchChain = useSwitchChain();
  const signMessage = useSignMessage();
  const [message, setMessage] = useState(defaultMessage);
  const address = connection.address;

  const balance = useBalance({
    address: connection.address,
    chainId: evmNetwork.chain.id,
    query: { enabled: connection.isConnected },
  });

  const isCorrectChain = connection.chainId === evmNetwork.chain.id;
  const error =
    connect.error ??
    disconnect.error ??
    switchChain.error ??
    signMessage.error ??
    balance.error;

  async function handleSignMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signMessage.mutateAsync({ message });
  }

  return (
    <article className={`${styles.chainCard} ${styles.ethereumCard}`}>
      <div className={styles.chainHeader}>
        <div>
          <p className={styles.eyebrow}>EVM / CHAIN ID 11155111</p>
          <h2>Ethereum</h2>
        </div>
        <span className={styles.networkBadge}>{evmNetwork.chain.name}</span>
      </div>

      <p className={styles.chainDescription}>
        Wagmi manages React state while Viem performs typed Ethereum RPC calls.
        This exercise only uses the Sepolia test network.
      </p>

      {!connection.isConnected || !address ? (
        <div className={styles.connectSection}>
          <p>Choose a browser wallet exposed through EIP-1193.</p>
          <div className={styles.buttonRow}>
            {connectors.map((connector) => (
              <button
                className={styles.primaryButton}
                disabled={connect.isPending}
                key={connector.uid}
                onClick={() => connect.mutate({ connector })}
                type="button"
              >
                {connect.isPending
                  ? 'Connecting…'
                  : `Connect ${connector.name}`}
              </button>
            ))}
          </div>
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
              <dd>
                {balance.data ? formatEther(balance.data.value) : '—'} ETH
              </dd>
            </div>
            <div>
              <dt>Wallet</dt>
              <dd>{connection.connector?.name ?? 'Browser wallet'}</dd>
            </div>
          </dl>

          {!isCorrectChain ? (
            <div className={styles.networkWarning} role="status">
              <p>Switch to Sepolia before signing.</p>
              <button
                className={styles.secondaryButton}
                disabled={switchChain.isPending}
                onClick={() =>
                  switchChain.mutate({ chainId: evmNetwork.chain.id })
                }
                type="button"
              >
                Switch network
              </button>
            </div>
          ) : null}

          <form className={styles.signForm} onSubmit={handleSignMessage}>
            <label htmlFor="evm-message">Message to sign</label>
            <textarea
              id="evm-message"
              onChange={(event) => setMessage(event.target.value)}
              rows={3}
              value={message}
            />
            <button
              className={styles.primaryButton}
              disabled={
                signMessage.isPending || !message.trim() || !isCorrectChain
              }
              type="submit"
            >
              {signMessage.isPending ? 'Waiting for wallet…' : 'Sign message'}
            </button>
          </form>

          {signMessage.data ? (
            <div className={styles.resultBox}>
              <strong>Signature</strong>
              <code>{signMessage.data}</code>
            </div>
          ) : null}

          <div className={styles.buttonRow}>
            <a
              className={styles.textLink}
              href={`${evmNetwork.explorerUrl}/address/${address}`}
              rel="noreferrer"
              target="_blank"
            >
              Open in Etherscan ↗
            </a>
            <button
              className={styles.ghostButton}
              disabled={disconnect.isPending}
              onClick={() => disconnect.mutate()}
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
          Start with <code>evm/config.ts</code>, then follow the typed values
          returned by <code>useConnection</code> and <code>useSignMessage</code>
          .
        </p>
      </details>
    </article>
  );
}
