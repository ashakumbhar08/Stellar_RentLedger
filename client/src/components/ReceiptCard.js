import React from 'react';
import './ReceiptCard.css';

export default function ReceiptCard({ payment }) {
  const property = payment.propertyId;
  const date = new Date(payment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const explorerUrl = `https://stellar.expert/explorer/testnet/tx/${payment.txHash}`;

  return (
    <div className="receipt-card">
      <div className="receipt-header">
        <div className="receipt-badge">✓ Verified on Stellar</div>
        <div className="receipt-date">{date}</div>
      </div>

      <div className="receipt-body">
        <div className="receipt-property">
          <span className="receipt-label">Property</span>
          <span className="receipt-value">{property?.name || 'N/A'}</span>
        </div>
        <div className="receipt-address">
          <span className="receipt-label">Address</span>
          <span className="receipt-value">{property?.address || 'N/A'}</span>
        </div>
        <div className="receipt-amount">
          <span className="receipt-label">Amount Paid</span>
          <span className="receipt-value amount">{payment.amount} XLM</span>
        </div>
        {payment.month && (
          <div className="receipt-month">
            <span className="receipt-label">For Month</span>
            <span className="receipt-value">{payment.month}</span>
          </div>
        )}
        <div className="receipt-tenant">
          <span className="receipt-label">Tenant</span>
          <span className="receipt-value mono">{payment.tenantWallet}</span>
        </div>
        <div className="receipt-landlord">
          <span className="receipt-label">Landlord</span>
          <span className="receipt-value mono">{payment.landlordWallet}</span>
        </div>
        <div className="receipt-tx">
          <span className="receipt-label">Transaction Hash</span>
          <a href={explorerUrl} target="_blank" rel="noreferrer" className="receipt-tx-link">
            {payment.txHash.slice(0, 16)}...{payment.txHash.slice(-8)}
          </a>
        </div>
      </div>

      <div className="receipt-footer">
        <a href={explorerUrl} target="_blank" rel="noreferrer" className="btn-explorer">
          View on Stellar Explorer ↗
        </a>
      </div>
    </div>
  );
}
