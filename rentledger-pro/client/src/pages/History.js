import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { getTenantPayments, getLandlordPayments } from '../utils/api';
import ReceiptCard from '../components/ReceiptCard';
import './History.css';

export default function History() {
  const { publicKey, connect, connecting } = useWallet();
  const [tab, setTab] = useState('tenant');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (publicKey) fetchPayments();
  }, [publicKey, tab]);

  async function fetchPayments() {
    setLoading(true);
    try {
      const res = tab === 'tenant'
        ? await getTenantPayments(publicKey)
        : await getLandlordPayments(publicKey);
      setPayments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  if (!publicKey) {
    return (
      <div className="history-connect">
        <div className="connect-box">
          <div className="connect-icon">📋</div>
          <h2>View Payment History</h2>
          <p>Connect your wallet to see your payment records.</p>
          <button className="btn-primary" onClick={connect} disabled={connecting}>
            {connecting ? 'Connecting...' : 'Connect Freighter'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="history-header">
        <h1>Payment History</h1>
        <p className="subtitle">All transactions are verified on the Stellar blockchain.</p>
      </div>

      <div className="tab-bar">
        <button
          className={`tab-btn ${tab === 'tenant' ? 'active' : ''}`}
          onClick={() => setTab('tenant')}
        >
          👤 As Tenant
        </button>
        <button
          className={`tab-btn ${tab === 'landlord' ? 'active' : ''}`}
          onClick={() => setTab('landlord')}
        >
          🏠 As Landlord
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading payments...</div>
      ) : payments.length === 0 ? (
        <div className="empty-history">
          <div className="empty-icon">🧾</div>
          <p>No payment records found.</p>
          <span>
            {tab === 'tenant'
              ? 'Payments you make will appear here.'
              : 'Payments received from tenants will appear here.'}
          </span>
        </div>
      ) : (
        <div className="receipts-grid">
          {payments.map((p) => (
            <ReceiptCard key={p._id} payment={p} />
          ))}
        </div>
      )}
    </div>
  );
}
