"use client";

import React, { useState } from "react";

// Libraries
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Upload, X, Camera } from "lucide-react";

// Components
import { CameraCapture } from "@/components/camera-capture";

// Hooks
import { useUploadThing } from "@/lib/uploadthing";

// Utils
import { saveClothingItems } from "@/app/actions";
import { CLOTHING_CATEGORIES, SUBCATEGORIES } from "@/lib/clothing-constants";

// Types
import { ClothingCategory } from "@/lib/clothing-constants";

type DraftItem = {
    id: string;
    file: File;
    previewUrl: string;
    category: ClothingCategory;
    subCategory: string;
    description: string;
};

export function AddItemDialog({ isOpen, onClose, onUploadComplete }: { isOpen: boolean; onClose: () => void; onUploadComplete: () => void }) {
    const [drafts, setDrafts] = useState<DraftItem[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showCamera, setShowCamera] = useState(false);

    const { startUpload } = useUploadThing("clothingImage", {
        onClientUploadComplete: async (res) => {
            try {
                const itemsToSave = res.map((upload, index) => ({
                    imageUrl: upload.url,
                    category: drafts[index].category,
                    subCategory: drafts[index].subCategory,
                    description: drafts[index].description,
                }));

                await saveClothingItems(itemsToSave);
                toast.success(`${itemsToSave.length} items added to closet!`);
                setDrafts([]);
                onUploadComplete();
                onClose();
            } catch (error) {
                toast.error("Failed to save items to database");
                console.error(error);
            } finally {
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
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-4 md:inset-auto md:top-[5%] md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-4xl md:h-[90vh] bg-background rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden border border-border"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-xl font-bold">Add New Items</h2>
                            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            {showCamera ? (
                                <CameraCapture
                                    onCapture={handleCameraCapture}
                                    onClose={() => setShowCamera(false)}
                                />
                            ) : (
                                <>
                                    {/* Upload Area */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/20 transition-colors relative flex flex-col items-center justify-center min-h-[150px]">
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
                                            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:bg-secondary/20 transition-colors flex flex-col items-center justify-center min-h-[150px] text-muted-foreground"
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
                                            <div key={draft.id} className="flex flex-col md:flex-row gap-6 p-4 rounded-lg border border-border bg-secondary/10">
                                                {/* Image Preview */}
                                                <div className="relative w-full md:w-32 aspect-3/4 rounded-md overflow-hidden bg-white/5 flex-shrink-0 border border-border/50">
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
                                                                className="w-full p-2 rounded-md bg-secondary/50 border border-border text-sm"
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
                                                                className="w-full p-2 rounded-md bg-secondary/50 border border-border text-sm"
                                                            >
                                                                <option value="">Select...</option>
                                                                {SUBCATEGORIES[draft.category].map(sc => (
                                                                    <option key={sc} value={sc}>{sc.charAt(0).toUpperCase() + sc.slice(1)}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-sm font-medium">Description</label>
                                                        <textarea
                                                            value={draft.description}
                                                            onChange={(e) => updateDraft(draft.id, { description: e.target.value })}
                                                            placeholder="Optional description..."
                                                            className="w-full p-2 rounded-md bg-secondary/50 border border-border h-16 resize-none text-sm"
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
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-border bg-background flex justify-end gap-4">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                                disabled={isSaving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveAll}
                                disabled={isSaving || drafts.length === 0}
                                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <span>Save {drafts.length > 0 ? `(${drafts.length})` : ""}</span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
