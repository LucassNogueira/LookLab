import React from "react";

// Libraries
import Image from "next/image";
import { X, type LucideIcon } from "lucide-react";

// Utils
import { cn } from "@/lib/utils";

// Types
import type { ClothingItem } from "@/types";

interface SlotProps {
    label: string;
    icon: LucideIcon;
    item: ClothingItem | null;
    onClear: () => void;
}

export function Slot({ label, icon: Icon, item, onClear }: SlotProps) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={cn(
                "w-40 h-40 md:w-48 md:h-48 rounded-2xl border-2 border-dashed flex items-center justify-center relative overflow-hidden bg-card/30 transition-all group hover:bg-card/50",
                item
                    ? "border-solid border-primary/50 shadow-lg shadow-primary/5 bg-background"
                    : "border-border hover:border-primary/30 text-muted-foreground/40 hover:text-primary/60"
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
                            className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-md text-foreground rounded-full hover:bg-red-500 hover:text-white transition-colors z-10 border border-border"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Icon className="w-8 h-8 opacity-50 transition-transform group-hover:scale-110 duration-300" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
