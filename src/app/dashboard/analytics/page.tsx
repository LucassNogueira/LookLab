"use client";

import React from "react";

// Libraries
import { Loader2, PieChart as PieChartIcon, BarChart3 } from "lucide-react";

// Components
import { AnalyticsStats } from "@/app/dashboard/analytics/components/analytics-stats";
import { CategoryPieChart, UsageBarChart } from "@/app/dashboard/analytics/components/analytics-charts";

// Hooks
import { useClothingItems } from "@/hooks/use-clothing-items";
import { useOutfits } from "@/hooks/use-outfits";

// Types
import type { ClothingItem, Outfit } from "@/types";

export default function AnalyticsPage() {
    const { data: items = [], isLoading: isLoadingItems } = useClothingItems();
    const { data: outfits = [], isLoading: isLoadingOutfits } = useOutfits();

    const isLoading = isLoadingItems || isLoadingOutfits;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    // --- Data Processing ---

    // 1. Category Distribution
    const categoryCount: Record<string, number> = {};
    items.forEach((item: ClothingItem) => {
        const cat = item.category || "Uncategorized";
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    const categoryData = Object.entries(categoryCount).map(([name, value], index) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
        color: "" // Assigned in component
    }));

    // 2. Item Usage (Wear Count)
    const itemUsage: Record<string, number> = {};
    const categoryUsage: Record<string, number> = {};

    outfits.forEach((outfit: Outfit) => {
        outfit.itemsUsed?.forEach((itemId) => {
            itemUsage[itemId] = (itemUsage[itemId] || 0) + 1;

            // Find item to get category
            const item = items.find((i: ClothingItem) => i.id === itemId);
            if (item) {
                const cat = item.category || "Uncategorized";
                categoryUsage[cat] = (categoryUsage[cat] || 0) + 1;
            }
        });
    });

    // 3. Most Worn Items (Top 5)
    const topItems = items
        .map((item: ClothingItem) => ({
            name: item.subCategory || item.category, // Use subcategory as name if available
            wearCount: itemUsage[item.id] || 0
        }))
        .sort((a: any, b: any) => b.wearCount - a.wearCount)
        .slice(0, 5);

    // 4. Stats Calculation
    const totalItems = items.length;
    const totalOutfits = outfits.length;

    // Find most worn category
    let mostWornCategory = "N/A";
    let maxCategoryWear = 0;
    Object.entries(categoryUsage).forEach(([cat, count]) => {
        if (count > maxCategoryWear) {
            maxCategoryWear = count;
            mostWornCategory = cat;
        }
    });
    mostWornCategory = mostWornCategory.charAt(0).toUpperCase() + mostWornCategory.slice(1);

    // Utilization Rate
    const wornItemCount = Object.keys(itemUsage).length;
    const utilizationRate = totalItems > 0 ? Math.round((wornItemCount / totalItems) * 100) : 0;

    // Dust Collectors (Items with 0 wears)
    const dustCollectors = items.filter((item: ClothingItem) => !itemUsage[item.id]).length;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <BarChart3 className="w-8 h-8 text-primary" />
                    Closet Analytics
                </h1>
                <p className="text-muted-foreground mt-2">
                    Gain insights into your wardrobe usage and habits.
                </p>
            </div>

            <AnalyticsStats
                totalItems={totalItems}
                totalOutfits={totalOutfits}
                mostWornCategory={mostWornCategory}
                utilizationRate={utilizationRate}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Category Distribution */}
                <div className="p-6 rounded-xl bg-secondary/10 border border-border">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <PieChartIcon className="w-5 h-5" />
                        Wardrobe Composition
                    </h3>
                    {categoryData.length > 0 ? (
                        <CategoryPieChart data={categoryData} />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            No items in closet
                        </div>
                    )}
                </div>

                {/* Top Worn Items */}
                <div className="p-6 rounded-xl bg-secondary/10 border border-border">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Most Worn Items
                    </h3>
                    {topItems.some((i: any) => i.wearCount > 0) ? (
                        <UsageBarChart data={topItems} />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                            No outfits generated yet
                        </div>
                    )}
                </div>
            </div>

            {/* Insights Section */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-border">
                <h3 className="text-xl font-bold mb-4">💡 Smart Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-purple-400 mb-2">Dust Collectors</h4>
                        <p className="text-sm text-muted-foreground">
                            You have <span className="font-bold text-foreground">{dustCollectors}</span> items that haven't been worn yet.
                            Consider creating outfits with them or donating them!
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-indigo-400 mb-2">Style Persona</h4>
                        <p className="text-sm text-muted-foreground">
                            Your wardrobe is dominated by <span className="font-bold text-foreground">{categoryData.sort((a, b) => b.value - a.value)[0]?.name || "nothing yet"}</span>.
                            {utilizationRate > 50 ? "You're getting great use out of your clothes!" : "Try to mix and match more to increase your utilization."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
