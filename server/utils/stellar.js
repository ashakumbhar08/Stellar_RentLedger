const StellarSdk = require('@stellar/stellar-sdk');

const server = new StellarSdk.Horizon.Server(
  process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org'
);

/**
 * Verify a transaction on Stellar and return its details
 */
async function verifyTransaction(txHash) {
  try {
    const tx = await server.transactions().transaction(txHash).call();
    const ops = await server.operations().forTransaction(txHash).call();
    const paymentOp = ops.records.find((op) => op.type === 'payment');

    return {
      valid: true,
      from: tx.source_account,
      to: paymentOp?.to || null,
      amount: paymentOp?.amount || null,
      asset: paymentOp?.asset_type === 'native' ? 'XLM' : paymentOp?.asset_code,
      memo: tx.memo,
      ledger: tx.ledger_attr,
      createdAt: tx.created_at,
    };
  } catch (err) {
    return { valid: false, error: err.message };
  }
}

module.exports = { verifyTransaction, server };
