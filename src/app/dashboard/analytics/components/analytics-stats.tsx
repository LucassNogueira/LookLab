"use client";

import React from "react";

// Libraries
import { Shirt, TrendingUp, DollarSign, Sparkles } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    trend?: string;
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
    return (
        <div className="p-6 rounded-xl bg-secondary/20 border border-border">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-background/50 text-primary">
                    {icon}
                </div>
                {trend && (
                    <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-3xl font-bold mb-1">{value}</h3>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-xs text-muted-foreground/60">{description}</p>
        </div>
    );
}

export function AnalyticsStats({
    totalItems,
    totalOutfits,
    mostWornCategory,
    utilizationRate
}: {
    totalItems: number;
    totalOutfits: number;
    mostWornCategory: string;
    utilizationRate: number;
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Items"
                value={totalItems}
                description="Items in your closet"
                icon={<Shirt className="w-5 h-5" />}
            />
            <StatCard
                title="Total Outfits"
                value={totalOutfits}
                description="Generated combinations"
                icon={<Sparkles className="w-5 h-5" />}
            />
            <StatCard
                title="Top Category"
                value={mostWornCategory}
                description="Most frequently worn"
                icon={<TrendingUp className="w-5 h-5" />}
            />
            <StatCard
                title="Utilization"
                value={`${utilizationRate}%`}
                description="Items worn at least once"
                icon={<DollarSign className="w-5 h-5" />}
            />
        </div>
    );
}
