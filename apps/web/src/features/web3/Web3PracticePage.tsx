import Link from 'next/link';

import { EvmWalletPanel } from './evm/EvmWalletPanel';
import { SolanaWalletPanel } from './solana/SolanaWalletPanel';
import styles from './Web3PracticePage.module.css';

const learningSteps = [
  {
    number: '01',
    title: 'Connect',
    description:
      'Let the wallet expose a public account. Never request a seed phrase.',
  },
  {
    number: '02',
    title: 'Read',
    description:
      'Fetch testnet balances through typed RPC clients and cached hooks.',
  },
  {
    number: '03',
    title: 'Sign',
    description:
      'Ask the wallet to prove account ownership without sending funds.',
  },
] as const;

export function Web3PracticePage() {
  return (
    <main className={styles.page}>
      <header className={styles.siteHeader}>
        <Link
          className={styles.brand}
          href="/"
          aria-label="On T React Lab home"
        >
          ON T <span>/ WEB3 LAB</span>
        </Link>
        <nav aria-label="Web3 practice sections">
          <a href="#chains">Chains</a>
          <a href="#learning-path">Learning path</a>
          <Link href="/">React lab</Link>
          <Link href="/motion">Motion lab</Link>
        </nav>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>NEXT.JS + TYPESCRIPT · PRACTICE 002</p>
          <h1>
            Two chains.
            <br />
            Two type systems.
          </h1>
        </div>
        <div className={styles.heroIntro}>
          <p>
            Connect an Ethereum wallet and a Solana wallet without hiding their
            differences behind one generic interface.
          </p>
          <p className={styles.safetyNote}>
            Testnets only. This page never asks for a private key or seed
            phrase.
          </p>
        </div>
      </section>

      <section className={styles.chainGrid} id="chains">
        <EvmWalletPanel />
        <SolanaWalletPanel />
      </section>

      <section className={styles.learningSection} id="learning-path">
        <div className={styles.sectionHeading}>
          <p className={styles.kicker}>READ THE FLOW</p>
          <h2>Learn the boundary before the transaction.</h2>
          <p>
            Wallets hold signing authority. The application prepares data,
            validates network state, and displays the result.
          </p>
        </div>

        <ol className={styles.stepList}>
          {learningSteps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.compareSection}>
        <div>
          <p className={styles.kicker}>DO NOT OVER-ABSTRACT</p>
          <h2>Shared UI, separate domain types.</h2>
        </div>
        <div className={styles.comparisonGrid}>
          <article>
            <span>Ethereum</span>
            <code>0x… · chainId · wei</code>
            <p>Secp256k1 accounts, EVM networks, and hex-encoded signatures.</p>
          </article>
          <article>
            <span>Solana</span>
            <code>Base58 · cluster · lamports</code>
            <p>Ed25519 accounts, Solana clusters, and byte-array signatures.</p>
          </article>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <strong>ON T / WEB3 LAB</strong>
          <p>Connect. Read. Sign. Keep the private key in the wallet.</p>
        </div>
        <Link href="/">Back to React lab →</Link>
      </footer>
    </main>
  );
}
