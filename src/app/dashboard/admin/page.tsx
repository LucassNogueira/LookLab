"use client";

import { useState, useEffect } from "react";
import { Calculator, TrendingUp, DollarSign, Users, Zap, AlertCircle, Crown, Shield } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { getAllUsers, updateUserRole, updateUserTier } from "@/app/actions/admin-actions";
import { makeCurrentUserAdmin } from "@/app/actions/setup-admin";
import { toast } from "sonner";

export default function AdminPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isSettingUpAdmin, setIsSettingUpAdmin] = useState(false);

    useEffect(() => {
        if (isLoaded && !user) {
            router.push("/dashboard");
        }
        if (isLoaded && user) {
            // Try to load all users for admin management
            getAllUsers()
                .then((users) => {
                    setAllUsers(users);
                    setIsAdmin(true);
                })
                .catch(() => {
                    // Not an admin
                    setIsAdmin(false);
                });
        }
    }, [isLoaded, user, router]);

    const handleMakeAdmin = async () => {
        setIsSettingUpAdmin(true);
        try {
            await makeCurrentUserAdmin();
            toast.success("You are now an admin!");
            // Reload users
            const users = await getAllUsers();
            setAllUsers(users);
            setIsAdmin(true);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSettingUpAdmin(false);
        }
    };

    // Current usage data (based on user's $0.56 spent)
    const [currentSpend, setCurrentSpend] = useState(0.56);

    // Calculator inputs
    const [userCount, setUserCount] = useState(100);
    const [outfitsPerUserPerMonth, setOutfitsPerUserPerMonth] = useState(10);
    const [tryOnsPerUserPerMonth, setTryOnsPerUserPerMonth] = useState(5);

    // ACTUAL Gemini API Pricing (as of Dec 2024) - UPDATED TO MATCH YOUR MODELS
    const PRICING = {
        // gemini-2.0-flash (text generation for outfit selection)
        textInputPer1M: 0.10,
        textOutputPer1M: 0.40,
        // gemini-3-pro-image-preview (image generation for try-on)
        imageGeneration: 0.134, // $0.134 per image (1K-2K resolution)
    };

    // Estimated token usage per operation
    const TOKENS_PER_OPERATION = {
        outfitGeneration: {
            input: 2000,  // Prompt + closet items
            output: 500,  // AI response with reasoning
        },
        tryOn: {
            // Try-on uses Imagen 3, priced per image
            imagesGenerated: 1,
        },
    };

    // Calculate cost per user per month
    const calculateCostPerUser = () => {
        // Text generation cost (outfit selection)
        const outfitInputTokens = outfitsPerUserPerMonth * TOKENS_PER_OPERATION.outfitGeneration.input;
        const outfitOutputTokens = outfitsPerUserPerMonth * TOKENS_PER_OPERATION.outfitGeneration.output;

        const textCost =
            (outfitInputTokens / 1_000_000) * PRICING.textInputPer1M +
            (outfitOutputTokens / 1_000_000) * PRICING.textOutputPer1M;

        // Image generation cost (try-on)
        const imageCost = tryOnsPerUserPerMonth * PRICING.imageGeneration;

        return textCost + imageCost;
    };

    const costPerUser = calculateCostPerUser();
    const totalMonthlyCost = costPerUser * userCount;
    const annualCost = totalMonthlyCost * 12;

    // Estimate current usage based on spend
    const estimatedCurrentImages = Math.round(currentSpend / PRICING.imageGeneration);

    return (
        <div className="max-w-6xl mx-auto space-y-8">

            {/* Admin Dashboard Content */}
            {isAdmin && (
                <>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Calculator className="w-8 h-8 text-blue-400" />
                            Admin Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Usage analytics and cost calculator for LookLab
                        </p>
                    </div>

                    {/* Current Usage Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Total Spend</h3>
                                <DollarSign className="w-5 h-5 text-blue-400" />
                            </div>
                            <p className="text-3xl font-bold">${currentSpend.toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground mt-1">Lifetime API costs</p>
                        </div>

                        <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Est. Images Generated</h3>
                                <Zap className="w-5 h-5 text-green-400" />
                            </div>
                            <p className="text-3xl font-bold">~{estimatedCurrentImages}</p>
                            <p className="text-xs text-muted-foreground mt-1">Try-on images created</p>
                        </div>

                        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-border">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Avg Cost/Image</h3>
                                <TrendingUp className="w-5 h-5 text-purple-400" />
                            </div>
                            <p className="text-3xl font-bold">${PRICING.imageGeneration.toFixed(3)}</p>
                            <p className="text-xs text-muted-foreground mt-1">Imagen 3 pricing</p>
                        </div>
                    </div>

                    {/* Cost Calculator */}
                    <div className="p-8 rounded-xl bg-secondary/20 border border-border space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Users className="w-6 h-6 text-indigo-400" />
                            <h2 className="text-2xl font-bold">Usage Cost Calculator</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* User Count */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Number of Users</label>
                                <input
                                    type="number"
                                    value={userCount}
                                    onChange={(e) => setUserCount(Number(e.target.value))}
                                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-indigo-500 outline-none"
                                    min="1"
                                />
                            </div>

                            {/* Outfits per user */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Outfits/User/Month</label>
                                <input
                                    type="number"
                                    value={outfitsPerUserPerMonth}
                                    onChange={(e) => setOutfitsPerUserPerMonth(Number(e.target.value))}
                                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-indigo-500 outline-none"
                                    min="0"
                                />
                            </div>

                            {/* Try-ons per user */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Try-Ons/User/Month</label>
                                <input
                                    type="number"
                                    value={tryOnsPerUserPerMonth}
                                    onChange={(e) => setTryOnsPerUserPerMonth(Number(e.target.value))}
                                    className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:ring-2 focus:ring-indigo-500 outline-none"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Results */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
                            <div className="text-center p-4 rounded-lg bg-background/50">
                                <p className="text-sm text-muted-foreground mb-1">Cost per User/Month</p>
                                <p className="text-2xl font-bold text-indigo-400">${costPerUser.toFixed(4)}</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-background/50">
                                <p className="text-sm text-muted-foreground mb-1">Total Monthly Cost</p>
                                <p className="text-2xl font-bold text-green-400">${totalMonthlyCost.toFixed(2)}</p>
                            </div>
                            <div className="text-center p-4 rounded-lg bg-background/50">
                                <p className="text-sm text-muted-foreground mb-1">Annual Cost</p>
                                <p className="text-2xl font-bold text-purple-400">${annualCost.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="p-6 rounded-xl bg-secondary/20 border border-border">
                        <h3 className="text-xl font-bold mb-4">API Pricing Breakdown</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-muted-foreground">gemini-2.0-flash (Input)</span>
                                <span className="font-mono font-medium">${PRICING.textInputPer1M}/1M tokens</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-muted-foreground">gemini-2.0-flash (Output)</span>
                                <span className="font-mono font-medium">${PRICING.textOutputPer1M}/1M tokens</span>
                            </div>
                            <div className="flex justify-between items-center p-3 rounded-lg bg-background/50">
                                <span className="text-muted-foreground">gemini-3-pro-image-preview</span>
                                <span className="font-mono font-medium">${PRICING.imageGeneration}/image</span>
                            </div>
                        </div>
                    </div>

                    {/* Usage Assumptions */}
                    <div className="p-6 rounded-xl bg-secondary/20 border border-border">
                        <h3 className="text-xl font-bold mb-4">Calculation Assumptions</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Each outfit generation uses ~{TOKENS_PER_OPERATION.outfitGeneration.input.toLocaleString()} input tokens (closet items + prompt)</li>
                            <li>• Each outfit generation produces ~{TOKENS_PER_OPERATION.outfitGeneration.output.toLocaleString()} output tokens (AI reasoning + selection)</li>
                            <li>• Each try-on generates 1 image using gemini-3-pro-image-preview</li>
                            <li>• Pricing based on actual Gemini API rates as of December 2024</li>
                            <li>• Models used: gemini-2.0-flash (text), gemini-3-pro-image-preview (images)</li>
                        </ul>
                    </div>

                    {/* User Management */}
                    {allUsers.length > 0 && (
                        <div className="p-6 rounded-xl bg-secondary/20 border border-border">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-indigo-400" />
                                User Management
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-border">
                                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Email</th>
                                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Role</th>
                                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Tier</th>
                                            <th className="text-left p-3 text-sm font-medium text-muted-foreground">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allUsers.map((u) => (
                                            <tr key={u.id} className="border-b border-border/50">
                                                <td className="p-3 text-sm">{u.email}</td>
                                                <td className="p-3">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${u.role === "admin"
                                                        ? "bg-yellow-500/20 text-yellow-400"
                                                        : "bg-blue-500/20 text-blue-400"
                                                        }`}>
                                                        {u.role === "admin" && <Crown className="w-3 h-3" />}
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <select
                                                        value={u.subscriptionTier}
                                                        onChange={async (e) => {
                                                            try {
                                                                await updateUserTier(u.id, e.target.value as any);
                                                                toast.success("Tier updated");
                                                                const updated = await getAllUsers();
                                                                setAllUsers(updated);
                                                            } catch (error) {
                                                                toast.error("Failed to update tier");
                                                            }
                                                        }}
                                                        className="px-2 py-1 rounded bg-background border border-border text-sm"
                                                    >
                                                        <option value="free">Free</option>
                                                        <option value="basic">Basic</option>
                                                        <option value="pro">Pro</option>
                                                    </select>
                                                </td>
                                                <td className="p-3">
                                                    <button
                                                        onClick={async () => {
                                                            const newRole = u.role === "admin" ? "user" : "admin";
                                                            try {
                                                                await updateUserRole(u.id, newRole);
                                                                toast.success(`Role updated to ${newRole}`);
                                                                const updated = await getAllUsers();
                                                                setAllUsers(updated);
                                                            } catch (error) {
                                                                toast.error("Failed to update role");
                                                            }
                                                        }}
                                                        className="px-3 py-1 rounded bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30 text-xs font-medium transition-colors"
                                                    >
                                                        {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Scenarios */}
                    <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-border">
                        <h3 className="text-xl font-bold mb-4">Example Scenarios</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-background/50 space-y-2">
                                <h4 className="font-semibold text-indigo-400">Small App (100 users)</h4>
                                <p className="text-sm text-muted-foreground">10 outfits + 5 try-ons per user/month</p>
                                <p className="text-2xl font-bold">${(100 * calculateCostPerUser()).toFixed(2)}/mo</p>
                            </div>
                            <div className="p-4 rounded-lg bg-background/50 space-y-2">
                                <h4 className="font-semibold text-purple-400">Medium App (1,000 users)</h4>
                                <p className="text-sm text-muted-foreground">10 outfits + 5 try-ons per user/month</p>
                                <p className="text-2xl font-bold">${(1000 * calculateCostPerUser()).toFixed(2)}/mo</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
