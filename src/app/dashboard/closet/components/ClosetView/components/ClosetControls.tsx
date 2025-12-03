"use client";

import { Palette, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useQueryState } from "nuqs";
import { searchParamsParsers } from "../../../searchParams";

const CATEGORIES = ["All", "Top", "Bottom", "Shoes", "Accessory", "Outerwear"];

export function ClosetControls() {
    const [activeTab, setActiveTab] = useQueryState("activeTab", searchParamsParsers.activeTab);
    const [isBuilderMode, setIsBuilderMode] = useQueryState("isBuilderMode", searchParamsParsers.isBuilderMode);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur z-40 py-4 border-b border-border">
            {/* Tabs Navigation */}
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-1 no-scrollbar bg-secondary/30 p-1 rounded-xl">
                {CATEGORIES.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveTab(category)}
                        className={cn(
                            "relative px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all z-10",
                            activeTab === category
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {activeTab === category && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-background rounded-lg shadow-sm -z-10"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {category}
                    </button>
                ))}
            </div>

            {/* Builder Toggle */}
            <button
                onClick={() => setIsBuilderMode(!isBuilderMode)}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all shadow-sm",
                    isBuilderMode
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-white text-black border border-border hover:bg-gray-50"
                )}
            >
                {isBuilderMode ? <X className="w-4 h-4" /> : <Palette className="w-4 h-4" />}
                {isBuilderMode ? "Close Builder" : "Create Outfit"}
            </button>
        </div>
    );
}
