export const SUBSCRIPTION_TIERS = {
    free: {
        name: "Free",
        price: 0,
        generationsPerMonth: 5,
        description: "Perfect for trying out LookLab",
        features: [
            "5 outfit generations per month",
            "Access to all clothing categories",
            "Virtual try-on included",
        ],
    },
    basic: {
        name: "Basic",
        price: 9.99,
        generationsPerMonth: 30,
        description: "Great for regular users",
        features: [
            "30 outfit generations per month",
            "Access to all clothing categories",
            "Virtual try-on included",
            "Priority support",
        ],
    },
    pro: {
        name: "Pro",
        price: 19.99,
        generationsPerMonth: 100,
        description: "For fashion enthusiasts",
        features: [
            "100 outfit generations per month",
            "Access to all clothing categories",
            "Virtual try-on included",
            "Priority support",
            "Early access to new features",
        ],
    },
    admin: {
        name: "Admin",
        price: 0,
        generationsPerMonth: Infinity,
        description: "Unlimited access",
        features: [
            "Unlimited outfit generations",
            "Full admin access",
            "All features included",
        ],
    },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

export function getTierLimits(tier: SubscriptionTier) {
    return SUBSCRIPTION_TIERS[tier];
}

export function canGenerate(tier: SubscriptionTier, currentUsage: number): boolean {
    const limits = getTierLimits(tier);
    return currentUsage < limits.generationsPerMonth;
}

export function getRemainingGenerations(tier: SubscriptionTier, currentUsage: number): number {
    const limits = getTierLimits(tier);
    if (limits.generationsPerMonth === Infinity) return Infinity;
    return Math.max(0, limits.generationsPerMonth - currentUsage);
}
