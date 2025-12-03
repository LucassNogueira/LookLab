const stripe = require('stripe')('sk_test_51KhG4wFKzemXcREVW3HLtUY7EYxk1Rq6G8aWLNZtjzfVb6IALCEAPm3dgRWNmM6ytpwA9XyO0YocD4x8HCCvLxF100wvdZ7doI');

async function setup() {
    try {
        console.log("Creating Products...");

        // Basic Plan
        const basicProduct = await stripe.products.create({
            name: 'Basic',
            description: 'Great for regular users',
        });
        const basicPrice = await stripe.prices.create({
            product: basicProduct.id,
            unit_amount: 999, // $9.99
            currency: 'usd',
            recurring: { interval: 'month' },
        });
        console.log(`BASIC_PRICE_ID=${basicPrice.id}`);

        // Pro Plan
        const proProduct = await stripe.products.create({
            name: 'Pro',
            description: 'For fashion enthusiasts',
        });
        const proPrice = await stripe.prices.create({
            product: proProduct.id,
            unit_amount: 1999, // $19.99
            currency: 'usd',
            recurring: { interval: 'month' },
        });
        console.log(`PRO_PRICE_ID=${proPrice.id}`);

        // Webhook
        console.log("Creating Webhook...");
        const webhook = await stripe.webhookEndpoints.create({
            url: 'https://looklab-app.vercel.app/api/stripe/webhook',
            enabled_events: [
                'checkout.session.completed',
                'invoice.payment_succeeded',
                'customer.subscription.updated',
                'customer.subscription.deleted',
            ],
        });
        console.log(`WEBHOOK_SECRET=${webhook.secret}`);

    } catch (error) {
        console.error("Error:", error);
    }
}

setup();
