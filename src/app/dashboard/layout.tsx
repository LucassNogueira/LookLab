import { DashboardNav } from "./nav";
import { currentUser } from "@clerk/nextjs/server";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
            <DashboardNav userImage={user?.imageUrl} />

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto pb-[25rem] md:pb-8">
                {children}
            </main>
        </div>
    );
}
