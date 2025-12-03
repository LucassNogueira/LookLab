import Image from "next/image";

interface ImageExpansionModalProps {
    imageUrl: string | null;
    onClose: () => void;
}

export function ImageExpansionModal({ imageUrl, onClose }: ImageExpansionModalProps) {
    if (!imageUrl) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div className="relative w-full max-w-4xl h-[90vh] animate-in zoom-in-95 duration-200">
                <Image
                    src={imageUrl}
                    alt="Expanded View"
                    fill
                    className="object-contain"
                    priority
                />
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                    <span className="sr-only">Close</span>
                    ✕
                </button>
            </div>
        </div>
    );
}
