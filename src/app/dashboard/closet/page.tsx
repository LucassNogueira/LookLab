import { getClothingItems } from "@/app/actions";
import { ClosetView } from "./components/ClosetView/ClosetView";

export default async function ClosetPage() {
    const items = await getClothingItems();

    return (
        <ClosetView items={items} />
    );
}
