"use client";

import React from "react";

// Libraries
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { ItemCard } from "../../ItemCard/ItemCard";
import { useOutfitSlots } from "../../../atoms";
import { searchParamsParsers } from "../../../searchParams";

// Hooks
import { useDeleteClothingItem } from "@/hooks/use-clothing-items";

// Utils
import { cn } from "@/lib/utils";

// Types
import type { ClothingItem } from "@/types";
import type { OutfitSlots } from "../../../atoms";

const CATEGORIES = ["All", "Top", "Bottom", "Shoes", "Accessory", "Outerwear"];

export function ClosetGrid({ items }: { items: ClothingItem[] }) {
    const [activeTab] = useQueryState("activeTab", searchParamsParsers.activeTab);
    const [isBuilderMode] = useQueryState("isBuilderMode", searchParamsParsers.isBuilderMode);
    const [slots, setSlots] = useOutfitSlots();
    const deleteItemMutation = useDeleteClothingItem();

    const filteredItems = items.filter((item) => {
        if (activeTab === "All") return true;
        return item.category.toLowerCase() === activeTab.toLowerCase();
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        await deleteItemMutation.mutateAsync(id);
    };

    const addToOutfit = (item: ClothingItem) => {
        const category = item.category.toLowerCase();
        let targetSlot: keyof OutfitSlots | null = null;

        if (category === "top") targetSlot = "top";
        else if (category === "bottom") targetSlot = "bottom";
        else if (category === "shoes") targetSlot = "shoes";
        else if (category === "outerwear") targetSlot = "outerwear";
        else if (category === "accessory") targetSlot = "accessory";

        if (targetSlot) {
            setSlots(prev => ({ ...prev, [targetSlot!]: item }));
        } else {
            toast.error("Could not determine slot for this item");
        }
    };

    // Group items by category for the "All" view in Builder Mode
    const groupedItems = isBuilderMode && activeTab === "All"
        ? CATEGORIES.filter(c => c !== "All").reduce((acc, category) => {
            const categoryItems = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
            if (categoryItems.length > 0) {
                acc[category] = categoryItems;
            }
            return acc;
        }, {} as Record<string, ClothingItem[]>)
        : null;

    return (
        <div className="flex-1">
            {isBuilderMode && activeTab === "All" && groupedItems ? (
                // Categorized View for Builder Mode
                <div className="space-y-8">
                    {Object.entries(groupedItems).map(([category, categoryItems]) => (
                        <div key={category} className="space-y-3">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider pl-1">{category}</h3>
                            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                                {categoryItems.map((item) => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        isBuilderMode={true}
                                        onClick={() => addToOutfit(item)}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">No items found in {activeTab}.</p>
                </div>
            ) : (
                // Standard Grid (or Filtered Builder Grid)
                <div className={cn(
                    "grid gap-4 md:gap-6 transition-all",
                    isBuilderMode
                        ? "grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3" // Compact grid
                        : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" // Standard grid
                )}>
                    {filteredItems.map((item) => (
                        <ItemCard
                            key={item.id}
                            item={item}
                            isBuilderMode={isBuilderMode}
                            onClick={() => isBuilderMode && addToOutfit(item)}
                            onDelete={() => handleDelete(item.id)}
                            isDeleting={deleteItemMutation.isPending}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
