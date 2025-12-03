"use client";

import { useState } from "react";
import { Check, Zap } from "lucide-react";
import { toast } from "sonner";
import { SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers";

interface PricingCardsProps {
    currentTier: string;
}

export function PricingCards({ currentTier }: PricingCardsProps) {
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

    return (
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
                                className={`p-6 rounded-xl border-2 transition-all flex flex-col h-full ${isCurrent
                                    ? "border-purple-500 bg-purple-500/10"
                                    : "border-border bg-secondary/20 hover:border-purple-500/50"
                                    } `}
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

                                <ul className="space-y-3 mb-6 flex-1">
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
                                    className={`w-full py-3 rounded-lg font-medium transition-all mt-auto ${isCurrent
                                        ? "bg-secondary text-muted-foreground cursor-not-allowed"
                                        : isUpgrade
                                            ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90"
                                            : "bg-secondary text-foreground hover:bg-secondary/80"
                                        } `}
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
    );
}
