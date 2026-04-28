import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { createProperty, getLandlordProperties } from '../utils/api';
import { getBalance } from '../utils/stellar';
import './Dashboard.css';

export default function Dashboard() {
  const { publicKey, connect, connecting } = useWallet();
  const [tab, setTab] = useState('landlord');
  const [properties, setProperties] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', rentAmount: '', description: '' });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [copiedLink, setCopiedLink] = useState(null);
  const [backendError, setBackendError] = useState(false);

  useEffect(() => {
    if (publicKey) {
      fetchProperties();
      fetchBalance();
    }
  }, [publicKey]);

  async function fetchProperties() {
    try {
      const res = await getLandlordProperties(publicKey);
      setProperties(Array.isArray(res.data) ? res.data : []);
      setBackendError(false);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setProperties([]);
      if (err.code === 'ERR_NETWORK' || err.message.includes('Network Error')) {
        setBackendError(true);
      }
    }
  }

  async function fetchBalance() {
    const bal = await getBalance(publicKey);
    setBalance(bal);
  }

  async function handleCreateProperty(e) {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!form.name || !form.address || !form.rentAmount) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await createProperty({ ...form, landlordWallet: publicKey });
      setFormSuccess('Property created successfully!');
      setForm({ name: '', address: '', rentAmount: '', description: '' });
      fetchProperties();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  }

  function copyLink(link) {
    const url = `${window.location.origin}/pay/${link}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  }

  if (!publicKey) {
    return (
      <div className="dashboard-connect">
        <div className="connect-box">
          <div className="connect-icon">🔗</div>
          <h2>Connect Your Wallet</h2>
          <p>Connect your Freighter wallet to access the dashboard.</p>
          <button className="btn-primary" onClick={connect} disabled={connecting}>
            {connecting ? 'Connecting...' : 'Connect Freighter'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {backendError && (
        <div className="alert alert-error" style={{ margin: '1rem 2rem' }}>
          ⚠️ Backend server is not running. Property management features require the backend API. 
          Please start the server with: <code>cd server && npm run dev</code>
        </div>
      )}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p className="wallet-info">
            <span className="mono">{publicKey}</span>
          </p>
        </div>
        {balance !== null && (
          <div className="balance-badge">
            <span className="balance-label">Balance</span>
            <span className="balance-value">{balance} XLM</span>
          </div>
        )}
      </div>

      <div className="tab-bar">
        <button
          className={`tab-btn ${tab === 'landlord' ? 'active' : ''}`}
          onClick={() => setTab('landlord')}
        >
          🏠 Landlord
        </button>
        <button
          className={`tab-btn ${tab === 'tenant' ? 'active' : ''}`}
          onClick={() => setTab('tenant')}
        >
          👤 Tenant
        </button>
      </div>

      {tab === 'landlord' && (
        <div className="landlord-section">
          <div className="section-grid">
            {/* Create Property Form */}
            <div className="card">
              <h2>Add Property</h2>
              <form onSubmit={handleCreateProperty} className="property-form">
                <div className="form-group">
                  <label>Property Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Sunset Apartments Unit 4B"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    placeholder="123 Main St, City"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Monthly Rent (XLM) *</label>
                  <input
                    type="number"
                    placeholder="e.g. 500"
                    min="1"
                    step="0.01"
                    value={form.rentAmount}
                    onChange={(e) => setForm({ ...form, rentAmount: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Optional notes..."
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                {formError && <div className="alert alert-error">{formError}</div>}
                {formSuccess && <div className="alert alert-success">{formSuccess}</div>}
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Property'}
                </button>
              </form>
            </div>

            {/* Properties List */}
            <div className="card">
              <h2>Your Properties ({Array.isArray(properties) ? properties.length : 0})</h2>
              {!Array.isArray(properties) || properties.length === 0 ? (
                <p className="empty-state">No properties yet. Create one to get started.</p>
              ) : (
                <div className="properties-list">
                  {properties.map((p) => (
                    <div key={p._id} className="property-item">
                      <div className="property-info">
                        <h4>{p.name}</h4>
                        <p>{p.address}</p>
                        <span className="rent-badge">{p.rentAmount} XLM/mo</span>
                      </div>
                      <button
                        className={`btn-copy ${copiedLink === p.paymentLink ? 'copied' : ''}`}
                        onClick={() => copyLink(p.paymentLink)}
                      >
                        {copiedLink === p.paymentLink ? '✓ Copied!' : '📋 Copy Link'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === 'tenant' && (
        <div className="tenant-section card">
          <h2>Pay Rent</h2>
          <p className="text-muted">
            Ask your landlord for a payment link, or enter it below to pay rent.
          </p>
          <TenantPayLink />
        </div>
      )}
    </div>
  );
}

function TenantPayLink() {
  const [link, setLink] = useState('');
  const [go, setGo] = useState(false);

  if (go && link) {
    window.location.href = `/pay/${link}`;
    return null;
  }

  return (
    <div className="pay-link-form">
      <div className="form-group">
        <label>Payment Link or Code</label>
        <input
          type="text"
          placeholder="Paste payment link or UUID code"
          value={link}
          onChange={(e) => {
            // Extract UUID from full URL if pasted
            const match = e.target.value.match(/pay\/([a-f0-9-]{36})/);
            setLink(match ? match[1] : e.target.value.trim());
          }}
        />
      </div>
      <button className="btn-primary" onClick={() => setGo(true)} disabled={!link}>
        Open Payment Page →
      </button>
    </div>
  );
}
