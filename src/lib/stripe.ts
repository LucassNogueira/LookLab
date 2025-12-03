import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-10-28.acacia" as any, // Using latest or casting to any to avoid type mismatch with installed version
    typescript: true,
});
