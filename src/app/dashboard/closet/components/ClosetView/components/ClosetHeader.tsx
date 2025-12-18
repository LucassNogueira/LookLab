"use client";

import React from "react";

// Libraries
import { useQueryState } from "nuqs";
import { searchParamsParsers } from "../../../searchParams";

export function ClosetHeader() {
    const [, setIsAddItemOpen] = useQueryState("isAddItemOpen", searchParamsParsers.isAddItemOpen);

    return (
        <div className="flex items-center justify-between">
            <h1 className="font-display text-4xl font-bold tracking-tight">My Closet</h1>
            <button
                onClick={() => setIsAddItemOpen(true)}
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
            >
                + Add New Item
            </button>
        </div>
    );
}
