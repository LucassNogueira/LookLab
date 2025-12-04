import React from "react";

// Libraries
import Image from "next/image";
import { X } from "lucide-react";

// Utils
import { cn } from "@/lib/utils";

// Types
import type { ClothingItem } from "@/types";

interface SlotProps {
    label: string;
    icon: any; // Using any for Lucide icon component type for simplicity, or could use LucideIcon
    item: ClothingItem | null;
    onClear: () => void;
}

export function Slot({ label, icon: Icon, item, onClear }: SlotProps) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={cn(
                "w-50 h-50 rounded-lg border-2 border-dashed flex items-center justify-center relative overflow-hidden bg-gray-50 transition-all",
                item ? "border-solid border-indigo-200" : "border-border"
            )}>
                {item ? (
                    <>
                        <Image
                            src={item.imageUrl}
                            alt={label}
                            fill
                            className="object-cover"
                        />
                        <button
                            onClick={onClear}
                            className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors z-10"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </>
                ) : (
                    <div className="text-muted-foreground/30 flex flex-col items-center gap-1">
                        <Icon className="w-6 h-6" />
                        <span className="text-[10px] uppercase font-bold">{label}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
