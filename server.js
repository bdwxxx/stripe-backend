require('dotenv').config();
const express = require('express');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const productPrices = [
        'price_1RqAmICmyfYBnltwSiCDHvBR', // 3.15 AED
        'price_1RqAmaCmyfYBnltwcDy81UGp', // 3.49 AED
        'price_1RprmJCmyfYBnltweq17ZRg6'  // 2.58 AED (старый)
      ];

    const randomIndex = Math.floor(Math.random() * productPrices.length);
    const selectedPrice = productPrices[randomIndex];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: selectedPrice,
        quantity: 1,
      }],
      mode: 'subscription',
      billing_address_collection: 'required',
      success_url: 'https://retroemu.me/?payment=success',
      cancel_url: 'https://retroemu.me/?payment=cancel',
    });
    res.json({ sessionId: session.id });
  } catch (e) {
    console.error("Stripe Error:", e.message);
    res.status(500).send({ error: { message: e.message } });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend server running`));