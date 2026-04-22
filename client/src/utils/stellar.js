import * as StellarSdk from '@stellar/stellar-sdk';
import { signTransaction } from '@stellar/freighter-api';

const HORIZON_URL = 'https://horizon-testnet.stellar.org';
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET;

const server = new StellarSdk.Horizon.Server(HORIZON_URL);

/**
 * Send XLM payment using Freighter wallet
 * @param {string} fromPublicKey - sender's public key
 * @param {string} toPublicKey - recipient's public key
 * @param {string} amount - amount in XLM
 * @param {string} memo - optional memo
 * @returns {string} transaction hash
 */
export async function sendPayment(fromPublicKey, toPublicKey, amount, memo = '') {
  const account = await server.loadAccount(fromPublicKey);

  const txBuilder = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      StellarSdk.Operation.payment({
        destination: toPublicKey,
        asset: StellarSdk.Asset.native(),
        amount: amount.toString(),
      })
    )
    .setTimeout(180);

  if (memo) {
    txBuilder.addMemo(StellarSdk.Memo.text(memo.slice(0, 28)));
  }

  const transaction = txBuilder.build();
  const xdr = transaction.toXDR();

  // Sign with Freighter
  const signedXdr = await signTransaction(xdr, {
    networkPassphrase: NETWORK_PASSPHRASE,
  });

  const signedTx = StellarSdk.TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  const result = await server.submitTransaction(signedTx);

  return result.hash;
}

/**
 * Get XLM balance for a public key
 */
export async function getBalance(publicKey) {
  try {
    const account = await server.loadAccount(publicKey);
    const xlm = account.balances.find((b) => b.asset_type === 'native');
    return xlm ? parseFloat(xlm.balance).toFixed(2) : '0.00';
  } catch {
    return '0.00';
  }
}
