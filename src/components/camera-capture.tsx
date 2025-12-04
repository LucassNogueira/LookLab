"use client";

import React, { useState, useRef, useEffect } from "react";

// Libraries
import { toast } from "sonner";
import { Camera, X, RefreshCw, Check } from "lucide-react";

interface CameraCaptureProps {
    onCapture: (file: File) => void;
    onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
    const [capturedImage, setCapturedImage] = useState<string | null>(null);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [facingMode]);

    const startCamera = async () => {
        try {
            stopCamera(); // Stop existing stream if any
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode }
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
                setIsStreaming(true);
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            toast.error("Could not access camera. Please check permissions.");
            onClose();
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsStreaming(false);
        }
    };

    const takePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;

            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext("2d");
            if (context) {
                // Flip horizontally if using front camera
                if (facingMode === "user") {
                    context.translate(canvas.width, 0);
                    context.scale(-1, 1);
                }

                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageUrl = canvas.toDataURL("image/jpeg", 0.8);
                setCapturedImage(imageUrl);
                stopCamera();
            }
        }
    };

    const confirmPhoto = async () => {
        if (capturedImage) {
            try {
                const res = await fetch(capturedImage);
                const blob = await res.blob();
                const file = new File([blob], `camera-capture-${Date.now()}.jpg`, { type: "image/jpeg" });
                onCapture(file);
                onClose();
            } catch (error) {
                console.error("Error processing image:", error);
                toast.error("Failed to process image");
            }
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
        startCamera();
    };

    const switchCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user");
    };

    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
            {/* Header */}
            <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
                <button onClick={onClose} className="text-white p-2 rounded-full bg-black/20 backdrop-blur-md">
                    <X className="w-6 h-6" />
                </button>
                <button onClick={switchCamera} className="text-white p-2 rounded-full bg-black/20 backdrop-blur-md">
                    <RefreshCw className="w-6 h-6" />
                </button>
            </div>

            {/* Viewport */}
            <div className="relative w-full h-full flex items-center justify-center bg-black">
                {capturedImage ? (
                    <img src={capturedImage} alt="Captured" className="max-h-full max-w-full object-contain" />
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className={`max-h-full max-w-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                    />
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 inset-x-0 p-8 flex justify-center items-center gap-8 bg-gradient-to-t from-black/80 to-transparent">
                {capturedImage ? (
                    <>
                        <button
                            onClick={retakePhoto}
                            className="px-6 py-3 rounded-full bg-white/20 backdrop-blur-md text-white font-medium hover:bg-white/30 transition-colors"
                        >
                            Retake
                        </button>
                        <button
                            onClick={confirmPhoto}
                            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Use Photo
                        </button>
                    </>
                ) : (
                    <button
                        onClick={takePhoto}
                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <div className="w-16 h-16 rounded-full bg-white" />
                    </button>
                )}
            </div>
        </div>
    );
}
