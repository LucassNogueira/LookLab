"use client";

import React, { useEffect } from "react";

// Libraries
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";
import { searchParamsParsers } from "../../searchParams";

// Components
import { AddItemDialog } from "@/components/add-item-dialog";
import { ClosetHeader } from "./components/ClosetHeader";
import { ClosetControls } from "./components/ClosetControls";
import { OutfitBuilder } from "./components/OutfitBuilder";
import { ClosetGrid } from "./components/ClosetGrid";

// Types
import type { ClothingItem } from "@/types";

export function ClosetView({ items }: { items: ClothingItem[] }) {
    const [isAddItemOpen, setIsAddItemOpen] = useQueryState("isAddItemOpen", searchParamsParsers.isAddItemOpen);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            setIsAddItemOpen(true);
        }
    }, [searchParams, setIsAddItemOpen]);

    return (
        <div className="space-y-6">
            <AddItemDialog
                isOpen={isAddItemOpen}
                onClose={() => setIsAddItemOpen(false)}
                onUploadComplete={() => {
                    router.refresh();
                }}
            />

            <ClosetHeader />
            <ClosetControls />

            <div className="flex flex-col lg:flex-row gap-8">
                <OutfitBuilder />
                <ClosetGrid items={items} />
            </div>
        </div>
    );
}


