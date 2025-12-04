import React from "react";

// Components
import { ClosetView } from "./components/ClosetView/ClosetView";

// Utils
import { getClothingItems } from "@/app/actions";

export default async function ClosetPage() {
    const items = await getClothingItems();

    return (
        <ClosetView items={items} />
    );
}
