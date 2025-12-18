import React from "react";

// Libraries
import Image from "next/image";
import { Trash2, Layers } from "lucide-react";

// Utils
import { cn } from "@/lib/utils";

// Types
import type { ClothingItem } from "@/types";

interface ItemCardProps {
    item: ClothingItem;
    isBuilderMode: boolean;
    onClick?: () => void;
    onDelete?: () => void;
    isDeleting?: boolean;
}

export function ItemCard({
    item,
    isBuilderMode,
    onClick,
    onDelete,
    isDeleting
}: ItemCardProps) {
    return (
        <div
            className={cn(
                "group relative aspect-square rounded-2xl overflow-hidden border border-border bg-card transition-all duration-300",
                isBuilderMode
                    ? "cursor-pointer hover:border-primary hover:shadow-[0_0_20px_-5px_hsl(var(--primary)/0.3)] hover:-translate-y-1"
                    : "hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            )}
            onClick={onClick}
        >
            <Image
                src={item.imageUrl}
                alt={item.subCategory || item.category}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            {/* Overlay */}
            <div className={cn(
                "absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/90 via-black/50 to-transparent transition-opacity flex items-end justify-between pt-10",
                "opacity-0 group-hover:opacity-100"
            )}>
                {!isBuilderMode && (
                    <div className="w-full flex justify-between items-end gap-2">
                        <div className="min-w-0">
                            <p className="text-white text-sm font-bold capitalize truncate">{item.subCategory || item.category}</p>
                            <p className="text-white/60 text-[10px] uppercase tracking-wider font-semibold">{item.category}</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.();
                            }}
                            disabled={isDeleting}
                            className="p-2 bg-background/20 backdrop-blur-md text-white rounded-full hover:bg-red-500/90 transition-colors disabled:opacity-50 ring-1 ring-white/20"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}
                {isBuilderMode && (
                    <div className="w-full flex justify-center pb-2">
                        <div className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/25 transform scale-0 group-hover:scale-100 transition-transform duration-200 delay-75">
                            <Layers className="w-4 h-4" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
