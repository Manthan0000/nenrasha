const checkoutSdk = require('@paypal/checkout-server-sdk');

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (process.env.PAYPAL_MODE === 'sandbox') {
    return new checkoutSdk.core.SandboxEnvironment(clientId, clientSecret);
  }
  return new checkoutSdk.core.LiveEnvironment(clientId, clientSecret);
}

function client() {
  return new checkoutSdk.core.PayPalHttpClient(environment());
}

module.exports = { client };
