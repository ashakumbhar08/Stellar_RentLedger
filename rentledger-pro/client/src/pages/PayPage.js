import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { getPropertyByLink, recordPayment } from '../utils/api';
import { sendPayment, getBalance } from '../utils/stellar';
import ReceiptCard from '../components/ReceiptCard';
import './PayPage.css';

export default function PayPage() {
  const { paymentLink } = useParams();
  const { publicKey, connect, connecting } = useWallet();

  const [property, setProperty] = useState(null);
  const [balance, setBalance] = useState(null);
  const [month, setMonth] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [payError, setPayError] = useState('');
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetchProperty();
  }, [paymentLink]);

  useEffect(() => {
    if (publicKey) getBalance(publicKey).then(setBalance);
  }, [publicKey]);

  async function fetchProperty() {
    try {
      const res = await getPropertyByLink(paymentLink);
      setProperty(res.data);
    } catch {
      setFetchError('Payment link not found or expired.');
    }
  }

  async function handlePay() {
    if (!publicKey) return;
    setPayError('');
    setLoading(true);
    try {
      const txHash = await sendPayment(
        publicKey,
        property.landlordWallet,
        property.rentAmount.toString(),
        memo || `Rent ${month}`
      );

      const res = await recordPayment({
        propertyId: property._id,
        tenantWallet: publicKey,
        txHash,
        memo: memo || `Rent ${month}`,
        month,
      });

      setReceipt(res.data);
    } catch (err) {
      setPayError(err.response?.data?.error || err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  }

  if (fetchError) {
    return (
      <div className="pay-page">
        <div className="pay-error-box">
          <div className="error-icon">⚠️</div>
          <h2>Link Not Found</h2>
          <p>{fetchError}</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pay-page">
        <div className="loading-box">Loading property details...</div>
      </div>
    );
  }

  if (receipt) {
    return (
      <div className="pay-page">
        <div className="receipt-success">
          <div className="success-icon">🎉</div>
          <h2>Payment Successful!</h2>
          <p>Your rent has been paid and recorded on the Stellar blockchain.</p>
          <div className="receipt-wrapper">
            <ReceiptCard payment={receipt} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pay-page">
      <div className="pay-container">
        <div className="pay-header">
          <div className="pay-badge">Secure Stellar Payment</div>
          <h1>Pay Rent</h1>
        </div>

        <div className="property-details">
          <div className="detail-row">
            <span className="detail-label">Property</span>
            <span className="detail-value">{property.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address</span>
            <span className="detail-value">{property.address}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Landlord</span>
            <span className="detail-value mono">{property.landlordWallet.slice(0, 8)}...{property.landlordWallet.slice(-6)}</span>
          </div>
          <div className="detail-row amount-row">
            <span className="detail-label">Amount Due</span>
            <span className="detail-value amount">{property.rentAmount} XLM</span>
          </div>
        </div>

        {publicKey ? (
          <div className="pay-form">
            <div className="wallet-status">
              <div className="wallet-dot" />
              <span>Connected: {publicKey.slice(0, 6)}...{publicKey.slice(-4)}</span>
              {balance && <span className="balance-chip">{balance} XLM</span>}
            </div>

            <div className="form-group">
              <label>Month (optional)</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Memo (optional)</label>
              <input
                type="text"
                placeholder="e.g. January rent"
                maxLength={28}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              />
            </div>

            {payError && <div className="alert alert-error">{payError}</div>}

            <button
              className="btn-pay"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Pay ${property.rentAmount} XLM`}
            </button>

            <p className="pay-note">
              You'll be prompted to sign the transaction in Freighter.
            </p>
          </div>
        ) : (
          <div className="connect-prompt">
            <p>Connect your Freighter wallet to pay rent.</p>
            <button className="btn-connect-pay" onClick={connect} disabled={connecting}>
              {connecting ? 'Connecting...' : '🔗 Connect Freighter'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
