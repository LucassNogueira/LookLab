"use client";

import React from "react";

// Libraries
import { Palette, X } from "lucide-react";
import { useQueryState } from "nuqs";
import { searchParamsParsers } from "../../../searchParams";

// Utils
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Top", "Bottom", "Shoes", "Accessory", "Outerwear"];

export function ClosetControls() {
    const [activeTab, setActiveTab] = useQueryState("activeTab", searchParamsParsers.activeTab);
    const [isBuilderMode, setIsBuilderMode] = useQueryState("isBuilderMode", searchParamsParsers.isBuilderMode);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-40 py-4 border-b border-border transition-all">
            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar p-1">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveTab(category)}
                        className={cn(
                            "relative px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide whitespace-nowrap transition-all z-10 border border-transparent",
                            activeTab === category
                                ? "text-primary border-primary/20 bg-primary/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border-transparent"
                        )}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Builder Toggle */}
            <button
                onClick={() => setIsBuilderMode(!isBuilderMode)}
                className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider transition-all shadow-sm border",
                    isBuilderMode
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 hover:opacity-90"
                        : "bg-card text-foreground border-border hover:bg-secondary/50"
                )}
            >
                {isBuilderMode ? <X className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
                {isBuilderMode ? "Close Builder" : "Create Outfit"}
            </button>
        </div>
    );
}
