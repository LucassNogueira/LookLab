"use client";

import React, { useState } from "react";

// Libraries
import { Crown } from "lucide-react";
import { toast } from "sonner";

// Components
import { UsageIndicator } from "@/components/usage-indicator";
import { CurrentPlan } from "./components/CurrentPlan/CurrentPlan";
import { UsageHistory } from "./components/UsageHistory/UsageHistory";
import { Pricing } from "@/components/blocks/pricing";

// Hooks
import { useSubscriptionInfo } from "@/hooks/use-user";

// Utils
import { SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";

export default function SubscriptionPage() {
    const { data: subscriptionInfo, isLoading: isLoadingSubscription } = useSubscriptionInfo();
    const [isProcessing, setIsProcessing] = useState(false);

    if (isLoadingSubscription) {
        return (
            <div className="max-w-6xl mx-auto space-y-8 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-12 bg-primary/10 rounded-xl w-1/3" />
                    <div className="h-4 bg-secondary/50 rounded w-1/2" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="h-[400px] bg-secondary/20 rounded-2xl" />
                        <div className="h-[400px] bg-secondary/20 rounded-2xl" />
                        <div className="h-[400px] bg-secondary/20 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    const currentTier = subscriptionInfo?.tier || "free";
    const isAdmin = subscriptionInfo?.role === "admin";

    const handleUpgrade = async (tier: string) => {
        try {
            setIsProcessing(true);
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tier }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            const { url } = await response.json();
            window.location.href = url;
        } catch (error) {
            console.error("Upgrade failed:", error);
            toast.error("Failed to start checkout. Please try again.");
            setIsProcessing(false);
        }
    };

    const plans = [
        {
            name: SUBSCRIPTION_TIERS.free.name,
            price: SUBSCRIPTION_TIERS.free.price.toString(),
            yearlyPrice: "0",
            period: "per month",
            features: [...SUBSCRIPTION_TIERS.free.features],
            description: SUBSCRIPTION_TIERS.free.description,
            buttonText: currentTier === "free" ? "Current Plan" : "Downgrade",
            href: "#",
            isPopular: false,
            disabled: currentTier === "free",
            onClick: () => {
                if (currentTier !== "free") {
                    toast.info("Please use the Manage Subscription button below to manage your plan.");
                }
            },
        },
        {
            name: SUBSCRIPTION_TIERS.basic.name,
            price: SUBSCRIPTION_TIERS.basic.price.toString(),
            yearlyPrice: (SUBSCRIPTION_TIERS.basic.price * 10).toFixed(0),
            period: "per month",
            features: [...SUBSCRIPTION_TIERS.basic.features],
            description: SUBSCRIPTION_TIERS.basic.description,
            buttonText: currentTier === "basic" ? "Current Plan" : (currentTier === "pro" ? "Downgrade" : "Upgrade to Basic"),
            href: "#",
            isPopular: true,
            disabled: currentTier === "basic" || isProcessing,
            onClick: () => {
                if (currentTier === "basic") return;
                if (currentTier === "pro") {
                    toast.info("Please use the Manage Subscription button below to manage your plan.");
                } else {
                    handleUpgrade("basic");
                }
            },
        },
        {
            name: SUBSCRIPTION_TIERS.pro.name,
            price: SUBSCRIPTION_TIERS.pro.price.toString(),
            yearlyPrice: (SUBSCRIPTION_TIERS.pro.price * 10).toFixed(0),
            period: "per month",
            features: [...SUBSCRIPTION_TIERS.pro.features],
            description: SUBSCRIPTION_TIERS.pro.description,
            buttonText: currentTier === "pro" ? "Current Plan" : "Upgrade to Pro",
            href: "#",
            isPopular: false,
            disabled: currentTier === "pro" || isProcessing,
            onClick: () => {
                if (currentTier === "pro") return;
                handleUpgrade("pro");
            },
        },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 relative px-4">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div>
                <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight flex items-center gap-3">
                    {isAdmin && <Crown className="w-10 h-10 text-yellow-400 fill-yellow-400/20" />}
                    Subscription
                </h1>
                <p className="text-muted-foreground text-lg mt-2">
                    Manage your plan and track your outfit generations.
                </p>
            </div>

            {/* Current Usage */}
            {subscriptionInfo && (
                <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl">
                    <UsageIndicator
                        used={subscriptionInfo.generationsUsed}
                        limit={subscriptionInfo.generationsLimit}
                        tier={subscriptionInfo.tierName}
                    />
                </div>
            )}

            {/* Pricing Area */}
            <div className="relative">
                <div className="absolute inset-0 bg-primary/5 blur-3xl -z-10 rounded-full" />
                <Pricing
                    plans={plans}
                    title="Available Plans"
                    description="Upgrade to unlock more generations and premium features."
                />
            </div>

            {/* Current Plan Details */}
            <CurrentPlan
                tierName={subscriptionInfo?.tierName}
                role={subscriptionInfo?.role}
            />

            {/* Usage History */}
            <div className="bg-card border border-border p-6 rounded-2xl">
                <UsageHistory
                    generationsUsed={subscriptionInfo?.generationsUsed}
                    remaining={subscriptionInfo?.remaining}
                    generationsLimit={subscriptionInfo?.generationsLimit}
                />
            </div>
        </div>
    );
}
