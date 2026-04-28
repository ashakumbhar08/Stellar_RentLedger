import React from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import './Home.css';

export default function Home() {
  const { publicKey, connect, connecting, error } = useWallet();

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-badge">Powered by Stellar Blockchain</div>
        <h1 className="hero-title">
          Rent Payments,<br />
          <span className="gradient-text">Verified Forever</span>
        </h1>
        <p className="hero-subtitle">
          Pay rent with your Stellar wallet. Get instant blockchain receipts.
          No disputes, no paperwork — just transparent, verifiable records.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="hero-actions">
          {publicKey ? (
            <Link to="/dashboard" className="btn-primary">Go to Dashboard →</Link>
          ) : (
            <button className="btn-primary" onClick={connect} disabled={connecting}>
              {connecting ? 'Connecting...' : '🔗 Connect Freighter Wallet'}
            </button>
          )}
          <a
            href="https://www.freighter.app/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
          >
            Get Freighter ↗
          </a>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">🔗</div>
          <h3>Shareable Payment Links</h3>
          <p>Landlords create a property profile and share a unique link with tenants for instant payments.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Instant Stellar Payments</h3>
          <p>Fast, low-cost XLM transfers settled on the Stellar network in seconds.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🧾</div>
          <h3>Blockchain Receipts</h3>
          <p>Every payment generates a verifiable digital receipt backed by an on-chain transaction.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Payment History</h3>
          <p>Both landlords and tenants get a permanent, tamper-proof payment history.</p>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-num">1</div>
            <div>
              <h4>Landlord creates property</h4>
              <p>Add property details and get a unique payment link to share with your tenant.</p>
            </div>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-num">2</div>
            <div>
              <h4>Tenant pays via Stellar</h4>
              <p>Tenant opens the link, connects Freighter, and pays rent in XLM.</p>
            </div>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-num">3</div>
            <div>
              <h4>Receipt generated</h4>
              <p>A digital receipt is instantly created and linked to the on-chain transaction.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
