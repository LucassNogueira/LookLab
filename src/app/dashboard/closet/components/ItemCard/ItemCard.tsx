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
                "group relative aspect-square rounded-xl overflow-hidden border border-border bg-secondary/20 transition-all bg-background",
                isBuilderMode ? "cursor-pointer hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500/20" : ""
            )}
            onClick={onClick}
        >
            <Image
                src={item.imageUrl}
                alt={item.subCategory || item.category}
                fill
                className="object-cover transition-transform group-hover:scale-105"
            />

            {/* Overlay */}
            <div className={cn(
                "absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent transition-opacity flex items-end justify-between",
                isBuilderMode ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100"
            )}>
                {!isBuilderMode && (
                    <div className="w-full flex justify-between items-end">
                        <div>
                            <p className="text-white text-sm font-medium capitalize truncate max-w-[100px]">{item.subCategory || item.category}</p>
                            <p className="text-white/70 text-xs capitalize">{item.category}</p>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.();
                            }}
                            disabled={isDeleting}
                            className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
                {isBuilderMode && (
                    <div className="w-full flex justify-center">
                        <div className="p-1.5 bg-indigo-500 text-white rounded-full shadow-sm">
                            <Layers className="w-3 h-3" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
