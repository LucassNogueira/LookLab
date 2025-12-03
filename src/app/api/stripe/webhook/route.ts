import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/lib/subscription-tiers";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as any;

        if (!session?.metadata?.userId) {
            return new NextResponse("User ID is missing in metadata", { status: 400 });
        }

        // Find tier based on price ID
        // Note: In a real app, you might want a more robust mapping
        let tier: SubscriptionTier = "free";
        if (subscription.items.data[0].price.id === process.env.STRIPE_PRICE_ID_BASIC) {
            tier = "basic";
        } else if (subscription.items.data[0].price.id === process.env.STRIPE_PRICE_ID_PRO) {
            tier = "pro";
        }

        await db.update(users).set({
            subscriptionTier: tier,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        }).where(eq(users.clerkUserId, session.metadata.userId));
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as any;

        await db.update(users).set({
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        }).where(eq(users.stripeSubscriptionId, subscription.id));
    }

    // Handle subscription updates/cancellations
    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as any;

        // If canceled
        if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
            await db.update(users).set({
                subscriptionTier: "free",
                stripeCurrentPeriodEnd: null,
            }).where(eq(users.stripeSubscriptionId, subscription.id));
        } else {
            // If updated (e.g. upgraded/downgraded)
            let tier: SubscriptionTier = "free";
            if (subscription.items.data[0].price.id === process.env.STRIPE_PRICE_ID_BASIC) {
                tier = "basic";
            } else if (subscription.items.data[0].price.id === process.env.STRIPE_PRICE_ID_PRO) {
                tier = "pro";
            }

            await db.update(users).set({
                subscriptionTier: tier,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            }).where(eq(users.stripeSubscriptionId, subscription.id));
        }
    }

    return new NextResponse(null, { status: 200 });
}
