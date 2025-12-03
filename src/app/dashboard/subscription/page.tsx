"use client";

import { Crown } from "lucide-react";
import { useSubscriptionInfo } from "@/hooks/use-user";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { UsageIndicator } from "@/components/usage-indicator";
import { CurrentPlan } from "./components/CurrentPlan/CurrentPlan";
import { PricingCards } from "./components/PricingCards/PricingCards";
import { UsageHistory } from "./components/UsageHistory/UsageHistory";

export default function SubscriptionPage() {
    const { data: subscriptionInfo, isLoading: isLoadingSubscription } = useSubscriptionInfo();

    if (isLoadingSubscription) {
        return (
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-secondary/50 rounded w-1/3" />
                    <div className="h-4 bg-secondary/50 rounded w-1/2" />
                </div>
            </div>
        );
    }

    const currentTier = subscriptionInfo?.tier || "free";
    const isAdmin = subscriptionInfo?.role === "admin";

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    {isAdmin && <Crown className="w-8 h-8 text-yellow-400" />}
                    Subscription
                </h1>
                <p className="text-muted-foreground mt-2">
                    Manage your subscription and usage
                </p>
            </div>

            {/* Current Usage */}
            {subscriptionInfo && (
                <UsageIndicator
                    used={subscriptionInfo.generationsUsed}
                    limit={subscriptionInfo.generationsLimit}
                    tier={subscriptionInfo.tierName}
                />
            )}

            {/* Current Plan */}
            <CurrentPlan
                tierName={subscriptionInfo?.tierName}
                role={subscriptionInfo?.role}
            />

            {/* Pricing Cards */}
            <PricingCards currentTier={currentTier} />

            {/* Usage History */}
            <UsageHistory
                generationsUsed={subscriptionInfo?.generationsUsed}
                remaining={subscriptionInfo?.remaining}
                generationsLimit={subscriptionInfo?.generationsLimit}
            />
        </div>
    );
}
