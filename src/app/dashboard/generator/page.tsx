"use client";

import { useState, useEffect } from "react";
import { Sparkles, Shirt, User, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useBodyProfiles } from "@/hooks/use-body-profiles";
import { useOutfits, useGenerateOutfit, useGenerateTryOn, useSaveOutfit, useDeleteOutfit } from "@/hooks/use-outfits";
import { UsageIndicator } from "@/components/usage-indicator";
import { getSubscriptionInfo } from "@/app/actions/user-actions";

export default function GeneratorPage() {
    const [occasion, setOccasion] = useState("");
    const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);
    const [result, setResult] = useState<{
        selection: {
            reasoning: string;
            selectedItemIds: string[];
        };
        closetItems: any[];
    } | null>(null);

    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [tryOnImage, setTryOnImage] = useState<string | null>(null);
    const [tryOnError, setTryOnError] = useState<string | null>(null);
    const [expandedImage, setExpandedImage] = useState<string | null>(null);

    // Query hooks
    const { data: profiles = [] } = useBodyProfiles();
    const { data: pastOutfits = [] } = useOutfits();
    const generateOutfitMutation = useGenerateOutfit();
    const generateTryOnMutation = useGenerateTryOn();
    const saveOutfitMutation = useSaveOutfit();
    const deleteOutfitMutation = useDeleteOutfit();

    // Select default profile when profiles load
    useEffect(() => {
        if (profiles.length > 0 && !selectedProfile) {
            const defaultProfile = profiles.find((p: any) => p.isDefault) || profiles[0];
            if (defaultProfile) setSelectedProfile(defaultProfile);
        }
    }, [profiles, selectedProfile]);

    // Load subscription info
    useEffect(() => {
        getSubscriptionInfo().then(setSubscriptionInfo);
    }, []);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!occasion.trim()) return;

        setResult(null);
        setTryOnImage(null);
        setTryOnError(null);

        try {
            const data = await generateOutfitMutation.mutateAsync({ occasion });
            setResult(data);
            toast.success("Outfit generated! Select a profile to try it on.");

            // Auto-trigger try-on if a profile is selected
            if (selectedProfile) {
                handleTryOn(data.closetItems, selectedProfile, occasion);
            }
        } catch (error: any) {
            console.error(error);
        }
    };

    const handleTryOn = async (items: any[], profile: any, currentOccasion: string) => {
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
                const updatedInfo = await getSubscriptionInfo();
                setSubscriptionInfo(updatedInfo);
            }
            if (generationError) {
                setTryOnError(generationError);
                toast.error("Try-on generation had issues");
            }
        } catch (error: any) {
            console.error(error);
            setTryOnError(error.message);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-32">
            {/* Image Expansion Modal */}
            {expandedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setExpandedImage(null)}
                >
                    <div className="relative w-full max-w-4xl h-[90vh] animate-in zoom-in-95 duration-200">
                        <Image
                            src={expandedImage}
                            alt="Expanded View"
                            fill
                            className="object-contain"
                            priority
                        />
                        <button
                            onClick={() => setExpandedImage(null)}
                            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <span className="sr-only">Close</span>
                            ✕
                        </button>
                    </div>
                </div>
            )}

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
                            <label className="text-sm font-medium">What's the occasion?</label>
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
                                {profiles.map((profile) => (
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
                            <li>Be specific about the weather (e.g., "rainy day")</li>
                            <li>Mention the vibe (e.g., "professional but comfy")</li>
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
                                    Stylist's Choice
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
                    {pastOutfits.length > 0 && (
                        <div className="space-y-6 pt-8 border-t border-border">
                            <h2 className="text-2xl font-bold">Past Outfits</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {pastOutfits.map((outfit) => (
                                    <div key={outfit.id} className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-border bg-secondary/20 cursor-pointer" onClick={() => setExpandedImage(outfit.generatedImageUrl)}>
                                        <Image
                                            src={outfit.generatedImageUrl}
                                            alt={outfit.occasion}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-between">
                                            <div className="flex-1 min-w-0 mr-2">
                                                <p className="text-white text-sm font-medium line-clamp-2">{outfit.occasion}</p>
                                                <p className="text-white/60 text-xs mt-1">
                                                    {new Date(outfit.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <button
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (!confirm("Delete this outfit?")) return;
                                                    await deleteOutfitMutation.mutateAsync(outfit.id);
                                                }}
                                                className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
