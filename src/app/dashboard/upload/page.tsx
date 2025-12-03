"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Upload, X, Camera } from "lucide-react";
import { saveClothingItems } from "@/app/actions";
import { CLOTHING_CATEGORIES, SUBCATEGORIES, ClothingCategory } from "@/lib/clothing-constants";
import { CameraCapture } from "@/components/camera-capture";

type DraftItem = {
    id: string;
    file: File;
    previewUrl: string;
    category: ClothingCategory;
    subCategory: string;
    description: string;
};

export default function UploadPage() {
    const router = useRouter();
    const [drafts, setDrafts] = useState<DraftItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showCamera, setShowCamera] = useState(false);

    const { startUpload } = useUploadThing("clothingImage", {
        onClientUploadComplete: async (res) => {
            try {
                // Map uploaded URLs back to drafts based on order
                // Note: This assumes uploadthing returns results in same order as input
                const itemsToSave = res.map((upload, index) => ({
                    imageUrl: upload.url,
                    category: drafts[index].category,
                    subCategory: drafts[index].subCategory,
                    description: drafts[index].description,
                }));

                await saveClothingItems(itemsToSave);
                toast.success(`${itemsToSave.length} items added to closet!`);
                router.push("/dashboard");
            } catch (error) {
                toast.error("Failed to save items to database");
                console.error(error);
                setIsSaving(false);
            }
        },
        onUploadError: (error: Error) => {
            toast.error(`Error: ${error.message}`);
            setIsSaving(false);
        },
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const newDrafts: DraftItem[] = files.map((file) => ({
            id: Math.random().toString(36).substring(7),
            file,
            previewUrl: URL.createObjectURL(file),
            category: "top",
            subCategory: "",
            description: "",
        }));

        setDrafts((prev) => [...prev, ...newDrafts]);
    };

    const handleCameraCapture = (file: File) => {
        const newDraft: DraftItem = {
            id: Math.random().toString(36).substring(7),
            file,
            previewUrl: URL.createObjectURL(file),
            category: "top",
            subCategory: "",
            description: "",
        };
        setDrafts((prev) => [...prev, newDraft]);
        setShowCamera(false);
    };

    const updateDraft = (id: string, updates: Partial<DraftItem>) => {
        setDrafts(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    };

    const removeDraft = (id: string) => {
        setDrafts(prev => prev.filter(d => d.id !== id));
    };

    const handleSaveAll = async () => {
        if (drafts.length === 0) return;

        setIsSaving(true);
        const filesToUpload = drafts.map(d => d.file);
        await startUpload(filesToUpload);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {showCamera && (
                <CameraCapture
                    onCapture={handleCameraCapture}
                    onClose={() => setShowCamera(false)}
                />
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Add New Items</h1>
                    <p className="text-muted-foreground mt-2">Upload multiple photos to your closet.</p>
                </div>
            </div>

            {/* Upload Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/20 transition-colors relative flex flex-col items-center justify-center min-h-[200px]">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Upload className="w-8 h-8" />
                        <p>Select Photos</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowCamera(true)}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/20 transition-colors flex flex-col items-center justify-center min-h-[200px] text-muted-foreground"
                >
                    <div className="flex flex-col items-center gap-2">
                        <Camera className="w-8 h-8" />
                        <p>Take Photo</p>
                    </div>
                </button>
            </div>

            {/* Drafts List */}
            <div className="space-y-6">
                {drafts.map((draft) => (
                    <div key={draft.id} className="flex flex-col md:flex-row gap-6 p-4 rounded-lg border border-border bg-secondary/10 animate-in fade-in slide-in-from-bottom-4">
                        {/* Image Preview */}
                        <div className="relative w-full md:w-48 aspect-[3/4] rounded-md overflow-hidden bg-white/5 flex-shrink-0 border border-border/50">
                            <Image
                                src={draft.previewUrl}
                                alt="Preview"
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* Form Fields */}
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <select
                                        value={draft.category}
                                        onChange={(e) => updateDraft(draft.id, { category: e.target.value as ClothingCategory, subCategory: "" })}
                                        className="w-full p-2 rounded-md bg-secondary/50 border border-border"
                                    >
                                        {CLOTHING_CATEGORIES.map(c => (
                                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Subcategory</label>
                                    <select
                                        value={draft.subCategory}
                                        onChange={(e) => updateDraft(draft.id, { subCategory: e.target.value })}
                                        className="w-full p-2 rounded-md bg-secondary/50 border border-border"
                                    >
                                        <option value="">Select...</option>
                                        {SUBCATEGORIES[draft.category].map(sc => (
                                            <option key={sc} value={sc}>{sc.charAt(0).toUpperCase() + sc.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description (Optional)</label>
                                <textarea
                                    value={draft.description}
                                    onChange={(e) => updateDraft(draft.id, { description: e.target.value })}
                                    placeholder="e.g. Vintage denim jacket, slightly oversized..."
                                    className="w-full p-2 rounded-md bg-secondary/50 border border-border h-20 resize-none"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div>
                            <button
                                onClick={() => removeDraft(draft.id)}
                                className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Actions */}
            {drafts.length > 0 && (
                <div className="fixed bottom-[72px] md:bottom-0 inset-x-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border flex justify-end gap-4 max-w-6xl mx-auto z-40">
                    <button
                        onClick={() => setDrafts([])}
                        className="px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="px-8 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="hidden sm:inline">Saving {drafts.length} items...</span>
                                <span className="sm:hidden">Saving...</span>
                            </>
                        ) : (
                            <>
                                <span className="hidden sm:inline">Save {drafts.length} Items</span>
                                <span className="sm:hidden">Save ({drafts.length})</span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
