"use client";

import { useRef } from "react";
import { Sparkles, Layers, Shirt, Footprints, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { Slot } from "../../Slot/Slot";
import { useOutfitSlots } from "../../../atoms";
import { searchParamsParsers } from "../../../searchParams";
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
                    <div className="p-4 rounded-xl bg-secondary/20 border border-border space-y-4 min-w-[300px] sticky top-24">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Occasion (e.g. Date Night)"
                                value={occasion}
                                onChange={(e) => setOccasion(e.target.value)}
                                className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
                            />
                            <button
                                onClick={handleTryOn}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                                <Sparkles className="w-4 h-4" />
                                Try On
                            </button>
                        </div>

                        {/* The Mannequin / Slots Layout */}
                        <div
                            ref={previewRef}
                            className="bg-white rounded-lg border border-border p-6 flex flex-col items-center gap-4 shadow-sm"
                        >
                            <div className="flex flex-col gap-4 w-full items-center">
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
                        <p className="text-xs text-center text-muted-foreground">
                            Click items to add to outfit.
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
