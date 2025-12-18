"use client";

import React from "react";

// Libraries
import { useRef } from "react";
import { Sparkles, Layers, Shirt, Footprints, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { Slot } from "../../Slot/Slot";
import { useOutfitSlots } from "../../../atoms";
import { searchParamsParsers } from "../../../searchParams";

// Types
import type { ClothingItem } from "@/types";
import type { OutfitSlots } from "../../../atoms";

export function OutfitBuilder() {
    const [isBuilderMode] = useQueryState("isBuilderMode", searchParamsParsers.isBuilderMode);
    const [slots, setSlots] = useOutfitSlots();
    const [occasion, setOccasion] = useQueryState("occasion", searchParamsParsers.occasion);
    const router = useRouter();
    const previewRef = useRef<HTMLDivElement>(null);

    const clearSlot = (slot: keyof OutfitSlots) => {
        setSlots(prev => ({ ...prev, [slot]: null }));
    };

    const handleTryOn = () => {
        const usedItems = Object.values(slots).filter(Boolean) as ClothingItem[];
        if (usedItems.length === 0) {
            toast.error("Add at least one item to the outfit");
            return;
        }

        const itemIds = usedItems.map(i => i.id).join(",");
        const occasionParam = occasion.trim() || "Custom Outfit";

        router.push(`/dashboard/generator?items=${itemIds}&occasion=${encodeURIComponent(occasionParam)}`);
    };

    return (
        <AnimatePresence>
            {isBuilderMode && (
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="lg:w-[35%] flex-none flex flex-col gap-4 overflow-hidden"
                >
                    <div className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border space-y-6 min-w-[300px] sticky top-24 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                placeholder="Occasion (e.g. Date Night)"
                                value={occasion}
                                onChange={(e) => setOccasion(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl border border-border bg-secondary/50 focus:bg-background focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm placeholder:text-muted-foreground/50"
                            />
                            <button
                                onClick={handleTryOn}
                                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary/20"
                            >
                                <Sparkles className="w-4 h-4" />
                                Try On
                            </button>
                        </div>

                        {/* The Mannequin / Slots Layout */}
                        <div
                            ref={previewRef}
                            className="bg-secondary/20 rounded-2xl border border-border/50 p-8 flex flex-col items-center gap-4 relative"
                        >
                            <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent rounded-2xl pointer-events-none" />

                            <div className="flex flex-col gap-4 w-full items-center relative z-10">
                                <Slot
                                    label="Outerwear"
                                    icon={Layers}
                                    item={slots.outerwear}
                                    onClear={() => clearSlot("outerwear")}
                                />
                                <Slot
                                    label="Top"
                                    icon={Shirt}
                                    item={slots.top}
                                    onClear={() => clearSlot("top")}
                                />
                                <Slot
                                    label="Bottom"
                                    icon={Layers}
                                    item={slots.bottom}
                                    onClear={() => clearSlot("bottom")}
                                />
                                <Slot
                                    label="Shoes"
                                    icon={Footprints}
                                    item={slots.shoes}
                                    onClear={() => clearSlot("shoes")}
                                />
                                <Slot
                                    label="Accessory"
                                    icon={Palette}
                                    item={slots.accessory}
                                    onClear={() => clearSlot("accessory")}
                                />
                            </div>
                        </div>
                        <p className="text-xs text-center text-muted-foreground font-medium uppercase tracking-widest">
                            Click items in your closet to add to outfit
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
