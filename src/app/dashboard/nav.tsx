"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Shirt, Sparkles, LayoutGrid, User, FlaskConical, Calculator } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export function DashboardNav({ userImage }: { userImage?: string | null }) {
    const pathname = usePathname();

    const links = [
        {
            href: "/dashboard",
            label: "My Closet",
            icon: LayoutGrid,
            exact: true
        },
        {
            href: "/dashboard/generator",
            label: "Outfit Generator",
            mobileLabel: "Outfits",
            icon: Sparkles
        },
        {
            href: "/dashboard/upload",
            label: "Add Item",
            mobileLabel: "Add",
            icon: Shirt
        },
        {
            href: "/dashboard/admin",
            label: "Admin",
            mobileLabel: "Admin",
            icon: Calculator
        }
    ];

    const isActive = (path: string, exact = false) => {
        if (exact) return pathname === path;
        return pathname.startsWith(path);
    };

    return (
        <>
            {/* Sidebar (Desktop) */}
            <aside className="w-64 border-r border-border p-6 hidden md:flex flex-col gap-8 h-screen sticky top-0">
                <div className="flex items-center gap-2 font-bold text-xl">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        LookLab
                    </span>
                </div>

                <nav className="flex flex-col gap-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-2 rounded-md transition-colors font-medium",
                                isActive(link.href, link.exact)
                                    ? "bg-secondary/50 text-foreground"
                                    : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                            )}
                        >
                            <link.icon className="w-4 h-4" />
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-auto">
                    <Link
                        href="/dashboard/account"
                        className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-md transition-colors",
                            isActive("/dashboard/account")
                                ? "bg-secondary/50 text-foreground"
                                : "text-muted-foreground hover:bg-secondary/30 hover:text-foreground"
                        )}
                    >
                        <UserButton afterSignOutUrl="/" />
                        <span className="text-sm">My Account</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Top Bar */}
            <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background sticky top-0 z-10">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                        LookLab
                    </span>
                </div>
                <UserButton afterSignOutUrl="/" />
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 inset-x-0 bg-background/80 backdrop-blur-lg border-t border-border flex justify-around p-4 z-50">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex flex-col items-center gap-1 text-xs transition-colors",
                            isActive(link.href, link.exact)
                                ? "text-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <link.icon className="w-5 h-5" />
                        {link.mobileLabel || link.label}
                    </Link>
                ))}

                <Link
                    href="/dashboard/account"
                    className={cn(
                        "flex flex-col items-center gap-1 text-xs transition-colors",
                        isActive("/dashboard/account")
                            ? "text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <div className={cn(
                        "w-6 h-6 rounded-full overflow-hidden border relative",
                        isActive("/dashboard/account") ? "border-foreground" : "border-border"
                    )}>
                        {userImage ? (
                            <Image src={userImage} alt="Me" fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-secondary flex items-center justify-center text-[10px]">Me</div>
                        )}
                    </div>
                    Account
                </Link>
            </nav>
        </>
    );
}
