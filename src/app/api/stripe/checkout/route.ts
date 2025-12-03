import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { stripe } from "@/lib/stripe";
import { SUBSCRIPTION_TIERS, SubscriptionTier } from "@/lib/subscription-tiers";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { tier } = body;

        if (!tier || !SUBSCRIPTION_TIERS[tier as SubscriptionTier]) {
            return new NextResponse("Invalid tier", { status: 400 });
        }

        const selectedTier = SUBSCRIPTION_TIERS[tier as SubscriptionTier];

        // Ensure price ID exists
        if (!selectedTier.stripePriceId) {
            return new NextResponse("Price ID not configured", { status: 500 });
        }

        // Get user from DB to check for existing Stripe Customer ID
        const dbUser = await db.select().from(users).where(eq(users.clerkUserId, userId)).limit(1);

        let stripeCustomerId = dbUser[0]?.stripeCustomerId;

        // Create Stripe Customer if not exists
        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
                metadata: {
                    userId: userId, // Clerk User ID
                }
            });
            stripeCustomerId = customer.id;

            // Save to DB
            await db.update(users).set({ stripeCustomerId }).where(eq(users.clerkUserId, userId));
        }

        // Create Checkout Session
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [
                {
                    price: selectedTier.stripePriceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription?canceled=true`,
            metadata: {
                userId: userId,
                tier: tier,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("[STRIPE_CHECKOUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
