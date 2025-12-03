interface UsageHistoryProps {
    generationsUsed: number | undefined;
    remaining: number | undefined;
    generationsLimit: number | undefined;
}

export function UsageHistory({ generationsUsed, remaining, generationsLimit }: UsageHistoryProps) {
    return (
        <div className="p-6 rounded-xl bg-secondary/20 border border-border">
            <h2 className="text-xl font-bold mb-4">This Month's Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground mb-1">Generations Used</p>
                    <p className="text-2xl font-bold">{generationsUsed || 0}</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                    <p className="text-2xl font-bold">
                        {remaining === Infinity
                            ? "∞"
                            : remaining || 0}
                    </p>
                </div>
                <div className="p-4 rounded-lg bg-background/50">
                    <p className="text-sm text-muted-foreground mb-1">Limit</p>
                    <p className="text-2xl font-bold">
                        {generationsLimit === Infinity
                            ? "∞"
                            : generationsLimit || 0}
                    </p>
                </div>
            </div>
        </div>
    );
}
