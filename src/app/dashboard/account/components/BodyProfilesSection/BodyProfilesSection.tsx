"use client";

// Libraries
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2, Upload, Trash2, Camera } from "lucide-react";
import { useBodyProfiles, useSaveBodyProfile, useDeleteBodyProfile } from "@/hooks/use-body-profiles";
import type { BodyProfile } from "@/types";

export function BodyProfilesSection() {
    const [processedFile, setProcessedFile] = useState<File | null>(null);
    const [isConverting, setIsConverting] = useState(false);

    const { data: profiles = [], isLoading: isProfilesLoading } = useBodyProfiles();
    const saveProfileMutation = useSaveBodyProfile();
    const deleteProfileMutation = useDeleteBodyProfile();

    const { startUpload, isUploading } = useUploadThing("userBodyPhoto", {
        onClientUploadComplete: async (res) => {
            await saveProfileMutation.mutateAsync({ imageUrl: res[0].url });
            setProcessedFile(null);
            toast.success("Profile photo uploaded successfully!");
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
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-purple-500" />
                    Body Profiles
                </h2>
                <p className="text-sm text-muted-foreground">
                    Upload full-body photos to use in the virtual try-on.
                </p>
            </div>

            <div className="md:col-span-2 space-y-6">
                {/* Upload Card */}
                <div className="p-6 rounded-2xl bg-secondary/20 border border-border border-dashed hover:border-purple-500/50 transition-colors">
                    <h3 className="font-semibold mb-6 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Add New Profile
                    </h3>

                    <div className="flex flex-col items-center gap-6">
                        {processedFile ? (
                            <div className="relative aspect-3/4 w-full max-w-xs rounded-xl overflow-hidden border border-border shadow-lg group">
                                <Image src={URL.createObjectURL(processedFile)} alt="Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        onClick={() => setProcessedFile(null)}
                                        className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors text-sm font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full max-w-xs group cursor-pointer relative">
                                <div className="border-2 border-dashed border-border rounded-xl p-8 md:p-12 text-center bg-background/50 group-hover:bg-secondary/30 transition-all duration-300">
                                    <input
                                        type="file"
                                        accept="image/*,.heic"
                                        onChange={handleFileSelect}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors">
                                        <div className="p-4 rounded-full bg-secondary group-hover:bg-background transition-colors">
                                            {isConverting ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <Upload className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium">{isConverting ? "Processing..." : "Click to upload"}</p>
                                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG, HEIC up to 10MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={!processedFile || saveProfileMutation.isPending || isConverting || isUploading}
                            className="w-full max-w-xs px-6 py-2.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
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

                {/* Profiles Grid */}
                <div>
                    <h3 className="font-semibold mb-4 text-sm text-muted-foreground uppercase tracking-wider">Your Profiles</h3>
                    {isProfilesLoading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : profiles.length === 0 ? (
                        <div className="text-center p-8 rounded-xl bg-secondary/10 border border-border">
                            <p className="text-muted-foreground">No profiles uploaded yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {profiles.map((profile: BodyProfile) => (
                                <div key={profile.id} className="relative group aspect-3/4 rounded-xl overflow-hidden border border-border bg-secondary/10 shadow-sm transition-all hover:shadow-md">
                                    <Image
                                        src={profile.imageUrl || ""}
                                        alt={profile.name || "Profile"}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 pt-8">
                                        <p className="text-xs font-medium text-white truncate">
                                            {profile.name}
                                        </p>
                                    </div>
                                    {profile.isDefault !== "true" && (
                                        <button
                                            onClick={() => handleDelete(profile.id)}
                                            className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white transform translate-y-2 group-hover:translate-y-0"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
