"use client";

import React, { useState, useEffect, useCallback } from "react";

// Libraries
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Shirt, User } from "lucide-react";

// Components
import { UsageIndicator } from "@/components/usage-indicator";
import { ImageExpansionModal } from "./components/ImageExpansionModal/ImageExpansionModal";
import { PastOutfits } from "./components/PastOutfits/PastOutfits";

// Hooks
import { useBodyProfiles } from "@/hooks/use-body-profiles";
import { useOutfits, useGenerateOutfit, useGenerateTryOn, useSaveOutfit, useDeleteOutfit } from "@/hooks/use-outfits";
import { useClothingItems } from "@/hooks/use-clothing-items";
import { useSubscriptionInfo } from "@/hooks/use-user";

// Types
import type { BodyProfile, GenerationResult, ClothingItem } from "@/types";

export default function GeneratorPage() {
    const [occasion, setOccasion] = useState("");
    const [result, setResult] = useState<GenerationResult | null>(null);

    const [selectedProfile, setSelectedProfile] = useState<BodyProfile | null>(null);
    const [tryOnImage, setTryOnImage] = useState<string | null>(null);
    const [tryOnError, setTryOnError] = useState<string | null>(null);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    // Query hooks
    const { data: profiles = [] } = useBodyProfiles();
    const { data: pastOutfits = [] } = useOutfits();
    const { data: allClothingItems = [] } = useClothingItems(); // Fetch all items to match IDs
    const { data: subscriptionInfo, refetch: refetchSubscription } = useSubscriptionInfo();

    const generateOutfitMutation = useGenerateOutfit();
    const generateTryOnMutation = useGenerateTryOn();
    const saveOutfitMutation = useSaveOutfit();
    const deleteOutfitMutation = useDeleteOutfit();
    const searchParams = useSearchParams();

    const handleTryOn = useCallback(async (items: ClothingItem[], profile: BodyProfile, currentOccasion: string) => {
        if (!items || !profile) return;

        setTryOnImage(null);
        setTryOnError(null);

        try {
            const { generatedImageUrl, generationError } = await generateTryOnMutation.mutateAsync({
                items,
                bodyImageUrl: profile.imageUrl
            });

            if (generatedImageUrl) {
                setTryOnImage(generatedImageUrl);

                // Save to history
                await saveOutfitMutation.mutateAsync({
                    occasion: currentOccasion,
                    generatedImageUrl,
                    itemsUsed: items.map(i => i.id)
                });

                // Refresh subscription info to update usage counter
                refetchSubscription();
            }
            if (generationError) {
                setTryOnError(generationError);
                toast.error("Try-on generation had issues");
            }
        } catch (error) {
            console.error(error);
            setTryOnError((error as Error).message);
        }
    }, [generateTryOnMutation, saveOutfitMutation, refetchSubscription]);

    // Handle incoming custom outfit from Closet
    useEffect(() => {
        const itemIds = searchParams.get("items")?.split(",") || [];
        const occasionParam = searchParams.get("occasion");

        if (itemIds.length > 0 && allClothingItems.length > 0) {
            // Case 1: Result not set yet. Set it.
            if (!result) {
                const selectedItems = allClothingItems.filter((item: ClothingItem) => itemIds.includes(item.id));

                if (selectedItems.length > 0) {
                    setOccasion(occasionParam || "Custom Outfit");
                    const newResult = {
                        selection: {
                            selectedItemIds: itemIds,
                            reasoning: "Here is the outfit you selected from your closet. Ready for try-on!"
                        },
                        closetItems: selectedItems
                    };
                    setResult(newResult);
                    toast.success("Custom outfit loaded!");

                    // Try to trigger if profile ready
                    if (selectedProfile) {
                        handleTryOn(selectedItems, selectedProfile, occasionParam || "Custom Outfit");
                    }
                }
            }
            // Case 2: Result is set (presumably by us just now or prev render), but try-on hasn't happened, and profile is now ready.
            else if (selectedProfile && !tryOnImage && !tryOnError && !generateTryOnMutation.isPending && !generateTryOnMutation.isSuccess) {
                // Check if current result matches params to avoid auto-triggering for unrelated states
                const currentIds = result.closetItems.map(i => i.id).sort().join(",");
                const paramIds = itemIds.sort().join(",");

                if (currentIds === paramIds) {
                    handleTryOn(result.closetItems, selectedProfile, occasionParam || "Custom Outfit");
                }
            }
        }
    }, [searchParams, allClothingItems, result, selectedProfile, handleTryOn, tryOnImage, tryOnError, generateTryOnMutation.isPending, generateTryOnMutation.isSuccess]);

    // Select default profile when profiles load
    useEffect(() => {
        if (profiles.length > 0 && !selectedProfile) {
            const defaultProfile = profiles.find((p: BodyProfile) => p.isDefault === "true") || profiles[0];
            if (defaultProfile) setSelectedProfile(defaultProfile);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profiles]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!occasion.trim()) return;

        setResult(null);
        setTryOnImage(null);
        setTryOnError(null);

        try {
            const data = await generateOutfitMutation.mutateAsync({ occasion });
            setResult(data as GenerationResult);
            toast.success("Outfit generated! Select a profile to try it on.");

            // Auto-trigger try-on if a profile is selected
            if (selectedProfile) {
                handleTryOn(data.closetItems, selectedProfile, occasion);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-32 relative">
            {/* Background Decoration */}
            <div className="absolute top-[20%] left-[-100px] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            {/* Image Expansion Modal */}
            <ImageExpansionModal
                imageUrl={expandedImage}
                onClose={() => setExpandedImage(null)}
            />

            <div>
                <h1 className="font-display text-4xl font-bold flex items-center gap-3">
                    <Sparkles className="w-8 h-8 text-primary fill-primary/20" />
                    Outfit Generator
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Describe the occasion, and LookLab will style you from your closet.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Input Section */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Usage Indicator */}
                    {subscriptionInfo && (
                        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl">
                            <UsageIndicator
                                used={subscriptionInfo.generationsUsed}
                                limit={subscriptionInfo.generationsLimit}
                                tier={subscriptionInfo.tierName}
                            />
                        </div>
                    )}

                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">What&apos;s the occasion?</label>
                            <textarea
                                value={occasion}
                                onChange={(e) => setOccasion(e.target.value)}
                                placeholder="e.g. A casual coffee date in autumn, or a formal black-tie wedding..."
                                className="w-full h-40 p-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none transition-all placeholder:text-muted-foreground/50 text-base"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={generateOutfitMutation.isPending || !occasion.trim()}
                            className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-wider rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40"
                        >
                            {generateOutfitMutation.isPending ? (
                                <>
                                    <Sparkles className="w-5 h-5 animate-spin" />
                                    Styling you...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5" />
                                    Generate Outfit
                                </>
                            )}
                        </button>
                    </form>

                    {/* Profile Selection (Visible if profiles exist) */}
                    {profiles.length > 0 && (
                        <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                            <h3 className="font-display font-bold flex items-center gap-2 uppercase tracking-wide">
                                <User className="w-4 h-4 text-primary" />
                                Select Model
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                {profiles.map((profile: BodyProfile) => (
                                    <button
                                        key={profile.id}
                                        onClick={() => {
                                            setSelectedProfile(profile);
                                            if (result) {
                                                handleTryOn(result.closetItems, profile, occasion);
                                            }
                                        }}
                                        className={`relative aspect-3/4 rounded-lg overflow-hidden border-2 transition-all group ${selectedProfile?.id === profile.id
                                            ? "border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                                            : "border-transparent hover:border-primary/50"
                                            }`}
                                    >
                                        <Image
                                            src={profile.imageUrl || ""}
                                            alt={profile.name || "Profile"}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                        {selectedProfile?.id === profile.id && (
                                            <div className="absolute inset-0 bg-primary/10" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-6 rounded-2xl bg-secondary/30 border border-border/50">
                        <h3 className="font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                            <Sparkles className="w-3 h-3 text-primary" />
                            Pro Tips
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                            <li>Be specific about the weather (e.g., &quot;rainy day&quot;)</li>
                            <li>Mention the vibe (e.g., &quot;professional but comfy&quot;)</li>
                            <li>Specify colors if you have a preference</li>
                        </ul>
                    </div>
                </div>

                {/* Result Section */}
                <div className="lg:col-span-8 space-y-12">
                    {result ? (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
                                <h3 className="font-display text-xl font-bold text-primary mb-3 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Stylist&apos;s Choice
                                </h3>
                                <p className="text-foreground/90 leading-relaxed text-lg">
                                    {result.selection.reasoning}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Selected Items Grid */}
                                <div className="space-y-4">
                                    <h4 className="font-bold uppercase tracking-wider text-sm text-muted-foreground">Selected Items</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {result.closetItems.map((item) => (
                                            <div key={item.id} className="aspect-square relative rounded-xl overflow-hidden border border-border bg-card group">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.subCategory || item.category}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                                <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-xs text-white truncate font-medium">
                                                    {item.subCategory || item.category}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Virtual Try-On Result */}
                                <div className="space-y-4">
                                    <h4 className="font-bold uppercase tracking-wider text-sm text-muted-foreground flex items-center justify-between">
                                        <span>Virtual Try-On</span>
                                        {generateTryOnMutation.isPending && <span className="text-xs animate-pulse text-primary font-medium">Generating...</span>}
                                    </h4>

                                    <div
                                        className="aspect-3/4 relative rounded-2xl overflow-hidden border border-border bg-card cursor-pointer hover:border-primary/50 transition-all group shadow-xl"
                                        onClick={() => {
                                            const img = tryOnImage || selectedProfile?.imageUrl;
                                            if (img) setExpandedImage(img);
                                        }}
                                    >
                                        {tryOnImage ? (
                                            <Image
                                                src={tryOnImage}
                                                alt="Virtual Try-On"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : selectedProfile ? (
                                            <Image
                                                src={selectedProfile.imageUrl}
                                                alt="Selected Profile"
                                                fill
                                                className="object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col gap-2">
                                                <User className="w-8 h-8 opacity-50" />
                                                <span>Select a profile</span>
                                            </div>
                                        )}

                                        {generateTryOnMutation.isPending && (
                                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm z-10">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="relative">
                                                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                                                        <Sparkles className="w-10 h-10 text-primary animate-spin relative z-10" />
                                                    </div>
                                                    <span className="font-bold tracking-wide">Trying on...</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-20">
                                            <span className="bg-background/90 text-foreground px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
                                                Click to expand
                                            </span>
                                        </div>
                                    </div>

                                    {tryOnError && (
                                        <div className="p-4 text-sm text-red-400 bg-red-950/20 border border-red-900/50 rounded-xl flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-red-500" />
                                            Error: {tryOnError}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 text-muted-foreground border-2 border-dashed border-border/50 rounded-2xl bg-card/20 hover:bg-card/40 transition-colors">
                            <div className="w-24 h-24 rounded-full bg-secondary/50 mb-6 flex items-center justify-center">
                                <Shirt className="w-12 h-12 opacity-50 text-foreground" />
                            </div>
                            <h3 className="font-display text-2xl font-bold mb-2 text-foreground">Ready to style</h3>
                            <p className="max-w-md text-lg">
                                Your generated outfit suggestions will appear here, tailored to your closet and the occasion.
                            </p>
                        </div>
                    )}

                    {/* Past Outfits Section */}
                    <div className="pt-8 border-t border-border">
                        <h3 className="font-display text-2xl font-bold mb-6 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-muted-foreground" />
                            History
                        </h3>
                        <PastOutfits
                            outfits={pastOutfits}
                            onExpand={setExpandedImage}
                            onDelete={(id) => deleteOutfitMutation.mutate(id)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
