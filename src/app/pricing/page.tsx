"use client";

import React from "react";
import Link from "next/link";
import { Pricing } from "@/components/blocks/pricing";
import { ArrowLeft } from "lucide-react";

import { SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";

const demoPlans = [
    {
        name: SUBSCRIPTION_TIERS.free.name,
        price: SUBSCRIPTION_TIERS.free.price.toString(),
        yearlyPrice: "0",
        period: "per month",
        features: [...SUBSCRIPTION_TIERS.free.features],
        description: SUBSCRIPTION_TIERS.free.description,
        buttonText: "Get Started",
        href: "/sign-up",
        isPopular: false,
    },
    {
        name: SUBSCRIPTION_TIERS.basic.name,
        price: SUBSCRIPTION_TIERS.basic.price.toString(),
        yearlyPrice: (SUBSCRIPTION_TIERS.basic.price * 10).toFixed(0), // approx 2 months free
        period: "per month",
        features: [...SUBSCRIPTION_TIERS.basic.features],
        description: SUBSCRIPTION_TIERS.basic.description,
        buttonText: "Start Basic",
        href: "/sign-up?tier=basic",
        isPopular: true,
    },
    {
        name: SUBSCRIPTION_TIERS.pro.name,
        price: SUBSCRIPTION_TIERS.pro.price.toString(),
        yearlyPrice: (SUBSCRIPTION_TIERS.pro.price * 10).toFixed(0),
        period: "per month",
        features: [...SUBSCRIPTION_TIERS.pro.features],
        description: SUBSCRIPTION_TIERS.pro.description,
        buttonText: "Go Pro",
        href: "/sign-up?tier=pro",
        isPopular: false,
    },
];

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 py-12">
                <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>
                <Pricing
                    plans={demoPlans}
                    title="Invest in Your Style"
                    description="Choose the plan that fits your wardrobe goals. simpler billing, better outfits."
                />
            </div>
        </main>
    );
}
