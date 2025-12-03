import { getClothingItems } from "@/app/actions";
import Link from "next/link";
import { ClosetTabs } from "./closet-tabs";

export default async function DashboardPage() {
    const items = await getClothingItems();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">My Closet</h1>
                <Link href="/dashboard/upload">
                    <button className="bg-white text-black px-4 py-2 rounded-md font-medium hover:bg-gray-200 transition-colors">
                        + Add New Item
                    </button>
                </Link>
            </div>

            {items.length === 0 ? (
                <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">Your closet is empty.</p>
                    <p className="text-sm text-muted-foreground/60 mt-2">Start by uploading your clothes.</p>
                </div>
            ) : (
                <ClosetTabs items={items} />
            )}
        </div>
    );
}
