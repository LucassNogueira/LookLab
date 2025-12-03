"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import Image from "next/image";
import { User, Loader2, Upload, Trash2 } from "lucide-react";
import { useBodyProfiles, useSaveBodyProfile, useDeleteBodyProfile } from "@/hooks/use-body-profiles";

export default function AccountPage() {
    const [processedFile, setProcessedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const { data: profiles = [], isLoading } = useBodyProfiles();
    const saveProfileMutation = useSaveBodyProfile();
    const deleteProfileMutation = useDeleteBodyProfile();

    const { startUpload, isUploading } = useUploadThing("userBodyPhoto", {
        onClientUploadComplete: async (res) => {
            await saveProfileMutation.mutateAsync({ imageUrl: res[0].url });
            setProcessedFile(null);
        },
        onUploadError: (error: Error) => {
            toast.error(`Upload error: ${error.message}`);
        },
    });

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsConverting(true);
        try {
            let fileToUpload = file;

            // Check if HEIC
            if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
                toast.info("Converting HEIC image...");
                const heic2any = (await import("heic2any")).default;
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.8
                });
                const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                fileToUpload = new File([blob], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
                toast.success("Conversion complete!");
            }

            setProcessedFile(fileToUpload);
        } catch (error) {
            console.error(error);
            toast.error("Failed to process image");
        } finally {
            setIsConverting(false);
        }
    };

    const handleSave = async () => {
        if (!processedFile) return;
        await startUpload([processedFile]);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this profile?")) return;
        await deleteProfileMutation.mutateAsync(id);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Account Management</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your body profiles. You can upload multiple photos or use our default mannequins.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Upload Section */}
                <div className="space-y-6">
                    <div className="p-6 rounded-lg bg-secondary/20 border border-border">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            Add New Profile
                        </h3>

                        <div className="flex flex-col items-center gap-6">
                            {processedFile ? (
                                <div className="relative aspect-[3/4] w-full max-w-xs rounded-lg overflow-hidden border border-border group">
                                    <Image src={URL.createObjectURL(processedFile)} alt="Preview" fill className="object-cover" />
                                    <button
                                        onClick={() => setProcessedFile(null)}
                                        className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full max-w-xs">
                                    <div className="border-2 border-dashed border-border rounded-lg p-8 md:p-12 text-center hover:bg-secondary/20 transition-colors relative">
                                        <input
                                            type="file"
                                            accept="image/*,.heic"
                                            onChange={handleFileSelect}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            {isConverting ? (
                                                <Loader2 className="w-8 h-8 animate-spin" />
                                            ) : (
                                                <Upload className="w-8 h-8" />
                                            )}
                                            <p>{isConverting ? "Processing..." : "Click to upload"}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={handleSave}
                                disabled={!processedFile || saveProfileMutation.isPending || isConverting || isUploading}
                                className="w-full px-6 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {saveProfileMutation.isPending || isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Profile"
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Profiles List */}
                <div className="space-y-6">
                    <h3 className="font-semibold flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Your Profiles
                    </h3>

                    {isLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-4">
                            {profiles.map((profile) => (
                                <div key={profile.id} className="relative group aspect-[3/4] rounded-lg overflow-hidden border border-border bg-secondary/10">
                                    <Image
                                        src={profile.imageUrl || ""}
                                        alt={profile.name || "Profile"}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white truncate">
                                        {profile.name}
                                    </div>
                                    {!profile.isDefault && (
                                        <button
                                            onClick={() => handleDelete(profile.id)}
                                            className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
