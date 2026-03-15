const checkoutSdk = require('@paypal/checkout-server-sdk');
const { client } = require('../config/paypal');

const createOrder = async (req, res) => {
  try {
    const { amount, description = 'Nenrasha Order' } = req.body;

    // Validate amount
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    // PayPal sandbox works with USD — convert ₹ → $ (approx 1 USD = 84 INR)
    const amountUSD = (Number(amount) / 84).toFixed(2);

    const request = new checkoutSdk.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description,
          amount: {
            currency_code: 'USD',
            value: amountUSD,
          },
        },
      ],
    });

    const order = await client().execute(request);

    res.status(201).json({
      success: true,
      orderId: order.result.id,       // PayPal order ID — frontend passes this back on capture
      amountUSD,                       // informational
    });
  } catch (err) {
    console.error('PayPal createOrder error:', err?.message || err);
    res.status(500).json({ success: false, message: 'Failed to create PayPal order' });
  }
};

const captureOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const request = new checkoutSdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const capture = await client().execute(request);
    const result = capture.result;

    // result.status === 'COMPLETED' means payment succeeded
    res.status(200).json({
      success: result.status === 'COMPLETED',
      paypalOrderId: result.id,
      status: result.status,
    });
  } catch (err) {
    console.error('PayPal captureOrder error:', err?.message || err);
    res.status(500).json({ success: false, message: 'Failed to capture PayPal payment' });
  }
};

module.exports = { createOrder, captureOrder };
