"use client";

import React, { useState, useEffect, useCallback } from "react";

// Libraries
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Shirt, User, Trash2 } from "lucide-react";

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
import type { BodyProfile, GenerationResult, ClothingItem, Outfit } from "@/types";

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
        <div className="max-w-6xl mx-auto space-y-12 pb-32">
            {/* Image Expansion Modal */}
            <ImageExpansionModal
                imageUrl={expandedImage}
                onClose={() => setExpandedImage(null)}
            />

            <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                    Outfit Generator
                </h1>
                <p className="text-muted-foreground mt-2">
                    Describe the occasion, and Nano Banana 3 will style you from your closet.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Input Section */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Usage Indicator */}
                    {subscriptionInfo && (
                        <UsageIndicator
                            used={subscriptionInfo.generationsUsed}
                            limit={subscriptionInfo.generationsLimit}
                            tier={subscriptionInfo.tierName}
                        />
                    )}

                    <form onSubmit={handleGenerate} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">What&apos;s the occasion?</label>
                            <textarea
                                value={occasion}
                                onChange={(e) => setOccasion(e.target.value)}
                                placeholder="e.g. A casual coffee date in autumn, or a formal black-tie wedding..."
                                className="w-full h-32 p-4 rounded-lg bg-secondary/50 border border-border focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={generateOutfitMutation.isPending || !occasion.trim()}
                            className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
                        <div className="p-6 rounded-lg bg-secondary/20 border border-border/50 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Select Model
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {profiles.map((profile: BodyProfile) => (
                                    <button
                                        key={profile.id}
                                        onClick={() => {
                                            setSelectedProfile(profile);
                                            if (result) {
                                                handleTryOn(result.closetItems, profile, occasion);
                                            }
                                        }}
                                        className={`relative aspect-[3/4] rounded-md overflow-hidden border-2 transition-all ${selectedProfile?.id === profile.id
                                            ? "border-purple-500 ring-2 ring-purple-500/20"
                                            : "border-transparent hover:border-border"
                                            }`}
                                    >
                                        <Image
                                            src={profile.imageUrl || ""}
                                            alt={profile.name || "Profile"}
                                            fill
                                            className="object-cover"
                                        />
                                        {selectedProfile?.id === profile.id && (
                                            <div className="absolute inset-0 bg-purple-500/20" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-6 rounded-lg bg-secondary/20 border border-border/50">
                        <h3 className="font-semibold mb-2">Tips for best results:</h3>
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
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
                            <div className="p-6 rounded-xl bg-purple-500/10 border border-purple-500/20">
                                <h3 className="text-lg font-semibold text-purple-300 mb-2 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Stylist&apos;s Choice
                                </h3>
                                <p className="text-foreground/90 leading-relaxed">
                                    {result.selection.reasoning}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Selected Items Grid */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-muted-foreground">Selected Items</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        {result.closetItems.map((item) => (
                                            <div key={item.id} className="aspect-square relative rounded-lg overflow-hidden border border-border bg-secondary/20">
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.subCategory || item.category}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-xs text-white truncate">
                                                    {item.subCategory || item.category}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Virtual Try-On Result */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-muted-foreground flex items-center justify-between">
                                        <span>Virtual Try-On</span>
                                        {generateTryOnMutation.isPending && <span className="text-xs animate-pulse text-purple-400">Generating...</span>}
                                    </h4>

                                    <div
                                        className="aspect-[3/4] relative rounded-xl overflow-hidden border border-border bg-secondary/20 cursor-pointer hover:opacity-90 transition-opacity group"
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
                                                className="object-cover opacity-50"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                                Select a profile
                                            </div>
                                        )}

                                        {generateTryOnMutation.isPending && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-10">
                                                <div className="flex flex-col items-center gap-2 text-white">
                                                    <Sparkles className="w-8 h-8 animate-spin" />
                                                    <span>Trying on...</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 z-20">
                                            <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                                                Click to expand
                                            </span>
                                        </div>
                                    </div>

                                    {tryOnError && (
                                        <div className="p-3 text-xs text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg">
                                            Error: {tryOnError}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-6 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                            <div className="w-20 h-20 rounded-full bg-secondary/50 mb-6 flex items-center justify-center">
                                <Shirt className="w-10 h-10 opacity-50" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">Ready to style</h3>
                            <p className="max-w-md">
                                Your generated outfit suggestions will appear here, tailored to your closet and the occasion.
                            </p>
                        </div>
                    )}

                    {/* Past Outfits Section */}
                    <PastOutfits
                        outfits={pastOutfits}
                        onExpand={setExpandedImage}
                        onDelete={(id) => deleteOutfitMutation.mutate(id)}
                    />
                </div>
            </div>
        </div>
    );
}
