import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

/**
 * PayPalCheckout — drop-in PayPal sandbox button component
 *
 * Props:
 *   amount   {number}   Cart total in INR (converted to USD on backend)
 *   token    {string}   Auth Bearer token from localStorage/context
 *   onSuccess {fn}      Called with { paypalOrderId, status } on success
 *   onError   {fn}      Called with error message string on failure
 */
const PayPalCheckout = ({ amount, token, onSuccess, onError }) => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

  // Step 1 — Create a PayPal order on our backend
  const handleCreateOrder = async () => {
    const res = await fetch('http://localhost:5000/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ amount, description: 'Nenrasha Order' }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Could not create PayPal order');
    return data.orderId; // PayPal uses this ID to open the payment popup
  };

  // Step 2 — Capture payment after user approves in PayPal popup
  const handleApprove = async (data) => {
    const res = await fetch(`http://localhost:5000/api/payment/capture/${data.orderID}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const result = await res.json();
    if (result.success) {
      onSuccess({ paypalOrderId: result.paypalOrderId, status: result.status });
    } else {
      onError(result.message || 'Payment capture failed');
    }
  };

  if (!clientId) {
    return <p style={{ color: 'red' }}>PayPal Client ID missing. Check Frontend/.env</p>;
  }

  return (
    <PayPalScriptProvider options={{ 'client-id': clientId, currency: 'USD' }}>
      <PayPalButtons
        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
        createOrder={handleCreateOrder}
        onApprove={handleApprove}
        onError={(err) => onError(err.message || 'PayPal encountered an error')}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalCheckout;
