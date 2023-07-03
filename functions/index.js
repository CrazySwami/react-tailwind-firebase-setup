/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')('sk_test_51NNnwhEKSa4xcy0NdlnjlpLjnVef46tRjl82lH9Up1UcuUKgdAn3IKYlaHvISHx5ClEBOJYn4gookKxwOwkxCr3I00ZmTO046t');
const endpointSecret = 'we_1NNrguEKSa4xcy0NJ2V10ZJs';

admin.initializeApp();

exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Blog Order',
          },
          unit_amount: data.blogCount === 5 ? 1299 : 1499,
        },
        quantity: data.blogCount,
      },
    ],
    mode: 'payment',
    success_url: '/dashboard',
    cancel_url: '/dashboard',
  });

  return { sessionId: session.id };
});

exports.handleStripeWebhook = functions.https.onRequest((request, response) => {
  const sig = request.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.rawBody, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Update payment status in Firestore.
    admin.firestore().collection('blogOrders').doc(session.client_reference_id).update({
      paymentStatus: 'paid'
    });
  }

  response.json({ received: true });
});