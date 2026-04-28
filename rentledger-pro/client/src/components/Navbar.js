import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import './Navbar.css';

export default function Navbar() {
  const { publicKey, shortKey, connecting, connect, disconnect } = useWallet();
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/history', label: 'History' },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">🏠</span>
        <span className="brand-name">RentLedger <span className="brand-pro">Pro</span></span>
      </Link>

      <div className="navbar-links">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="navbar-wallet">
        {publicKey ? (
          <div className="wallet-connected">
            <div className="wallet-indicator" />
            <span className="wallet-address">{shortKey}</span>
            <button className="btn-disconnect" onClick={disconnect}>Disconnect</button>
          </div>
        ) : (
          <button className="btn-connect" onClick={connect} disabled={connecting}>
            {connecting ? 'Connecting...' : '🔗 Connect Freighter'}
          </button>
        )}
      </div>
    </nav>
  );
}
