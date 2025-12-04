import React from "react";

// Libraries
import Image from "next/image";
import { Trash2 } from "lucide-react";

// Types
import type { Outfit } from "@/types";

interface PastOutfitsProps {
    outfits: Outfit[];
    onExpand: (imageUrl: string) => void;
    onDelete: (id: string) => void;
}

export function PastOutfits({ outfits, onExpand, onDelete }: PastOutfitsProps) {
    if (outfits.length === 0) return null;

    return (
        <div className="space-y-6 pt-8 border-t border-border">
            <h2 className="text-2xl font-bold">Past Outfits</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {outfits.map((outfit: Outfit) => (
                    <div key={outfit.id} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-border bg-secondary/20 cursor-pointer" onClick={() => onExpand(outfit.generatedImageUrl)}>
                        <Image
                            src={outfit.generatedImageUrl}
                            alt={outfit.occasion}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-between">
                            <div className="flex-1 min-w-0 mr-2">
                                <p className="text-white text-sm font-medium line-clamp-2">{outfit.occasion}</p>
                                <p className="text-white/60 text-xs mt-1">
                                    {new Date(outfit.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!confirm("Delete this outfit?")) return;
                                    onDelete(outfit.id);
                                }}
                                className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
