"use client";

import { Check, Zap, Crown, Loader2 } from "lucide-react";
import { useSubscriptionInfo } from "@/hooks/use-user";
import { SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";
import { UsageIndicator } from "@/components/usage-indicator";
import { useState } from "react";
import { toast } from "sonner";

export default function SubscriptionPage() {
    const { data: subscriptionInfo, isLoading: isLoadingSubscription } = useSubscriptionInfo();
    const [isLoading, setIsLoading] = useState(false);

    const handleUpgrade = async (tier: string) => {
        try {
            setIsLoading(true);
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
            setIsLoading(false);
        }
    };

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
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-border">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold">Current Plan</h2>
                        <p className="text-2xl font-bold text-purple-400 mt-2">
                            {subscriptionInfo?.tierName}
                        </p>
                        {isAdmin && (
                            <p className="text-sm text-muted-foreground mt-1">
                                You have unlimited access as an admin
                            </p>
                        )}
                    </div>
                    {isAdmin && <Crown className="w-12 h-12 text-yellow-400" />}
                </div>
            </div>

            {/* Pricing Cards */}
            <div>
                <h2 className="text-2xl font-bold mb-6">Available Plans</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.entries(SUBSCRIPTION_TIERS)
                        .filter(([key]) => key !== "admin")
                        .map(([key, tier]) => {
                            const isCurrent = currentTier === key;
                            const isUpgrade =
                                (currentTier === "free" && (key === "basic" || key === "pro")) ||
                                (currentTier === "basic" && key === "pro");

                            return (
                                <div
                                    key={key}
                                    className={`p-6 rounded-xl border-2 transition-all ${isCurrent
                                            ? "border-purple-500 bg-purple-500/10"
                                            : "border-border bg-secondary/20 hover:border-purple-500/50"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold">{tier.name}</h3>
                                        {isCurrent && (
                                            <span className="px-3 py-1 rounded-full bg-purple-500 text-white text-xs font-medium">
                                                Current
                                            </span>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">
                                            ${tier.price}
                                        </span>
                                        <span className="text-muted-foreground">/month</span>
                                    </div>

                                    <p className="text-sm text-muted-foreground mb-6">
                                        {tier.description}
                                    </p>

                                    <ul className="space-y-3 mb-6">
                                        {tier.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        disabled={isCurrent || isLoading}
                                        onClick={() => {
                                            if (isUpgrade) {
                                                handleUpgrade(key);
                                            } else {
                                                // Handle downgrade or manage subscription via portal
                                                toast.info("Please use the Manage Subscription button to change plans.");
                                            }
                                        }}
                                        className={`w-full py-3 rounded-lg font-medium transition-all ${isCurrent
                                                ? "bg-secondary text-muted-foreground cursor-not-allowed"
                                                : isUpgrade
                                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
                                                    : "bg-secondary text-foreground hover:bg-secondary/80"
                                            }`}
                                    >
                                        {isCurrent
                                            ? "Current Plan"
                                            : isUpgrade
                                                ? (isLoading ? "Loading..." : "Upgrade")
                                                : "Downgrade"}
                                    </button>
                                </div>
                            );
                        })}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <p className="text-sm text-blue-400">
                        <Zap className="w-4 h-4 inline mr-1" />
                        Payment integration is active! Upgrade to unlock more generations.
                    </p>
                </div>
            </div>

            {/* Usage History */}
            <div className="p-6 rounded-xl bg-secondary/20 border border-border">
                <h2 className="text-xl font-bold mb-4">This Month's Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-background/50">
                        <p className="text-sm text-muted-foreground mb-1">Generations Used</p>
                        <p className="text-2xl font-bold">{subscriptionInfo?.generationsUsed || 0}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50">
                        <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                        <p className="text-2xl font-bold">
                            {subscriptionInfo?.remaining === Infinity
                                ? "∞"
                                : subscriptionInfo?.remaining || 0}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-background/50">
                        <p className="text-sm text-muted-foreground mb-1">Limit</p>
                        <p className="text-2xl font-bold">
                            {subscriptionInfo?.generationsLimit === Infinity
                                ? "∞"
                                : subscriptionInfo?.generationsLimit || 0}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
