"use client";

import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useDeleteClothingItem } from "@/hooks/use-clothing-items";
import { cn } from "@/lib/utils";

type ClothingItem = {
    id: string;
    imageUrl: string;
    category: string;
    subCategory: string | null;
    description: string | null;
};

const CATEGORIES = ["All", "Top", "Bottom", "Shoes", "Accessory", "Outerwear"];

export function ClosetTabs({ items }: { items: ClothingItem[] }) {
    const [activeTab, setActiveTab] = useState("All");
    const deleteItemMutation = useDeleteClothingItem();

    const filteredItems = items.filter((item) => {
        if (activeTab === "All") return true;
        return item.category.toLowerCase() === activeTab.toLowerCase();
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        await deleteItemMutation.mutateAsync(id);
    };

    return (
        <div className="space-y-6">
            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveTab(category)}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                            activeTab === category
                                ? "bg-foreground text-background"
                                : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Grid */}
            {filteredItems.length === 0 ? (
                <div className="py-20 text-center border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">No items found in {activeTab}.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-secondary/20">
                            <Image
                                src={item.imageUrl}
                                alt={item.subCategory || item.category}
                                fill
                                className="object-cover transition-transform group-hover:scale-105"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between">
                                <div>
                                    <p className="text-white text-sm font-medium capitalize">{item.subCategory || item.category}</p>
                                    <p className="text-white/70 text-xs capitalize">{item.category}</p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item.id);
                                    }}
                                    disabled={deleteItemMutation.isPending}
                                    className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
