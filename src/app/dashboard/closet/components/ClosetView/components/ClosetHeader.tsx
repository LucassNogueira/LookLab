"use client";

import { useQueryState } from "nuqs";
import { searchParamsParsers } from "../../../searchParams";

export function ClosetHeader() {
    const [, setIsAddItemOpen] = useQueryState("isAddItemOpen", searchParamsParsers.isAddItemOpen);

    return (
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Closet</h1>
            <button
                onClick={() => setIsAddItemOpen(true)}
                className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors"
            >
                + Add New Item
            </button>
        </div>
    );
}
