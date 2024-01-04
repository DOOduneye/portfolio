"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { updateResume } from "@/services/resume";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ResumeButton } from "@/app/(home)/_components/resume-button";

const Upload = () => {
    const [loading, setLoading] = useState(false);

    const handleFileChange = async (uploadedFile: File) => {
        if (!uploadedFile) return;

        const allowedTypes = ['application/pdf'];
        if (!allowedTypes.includes(uploadedFile.type)) {
            toast.error("Please upload a PDF file.");
            return;
        }

        if (uploadedFile.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB.");
            return;
        }

        setLoading(true);
        await updateResume(uploadedFile);
        setLoading(false);

        toast.success("File uploaded successfully!");
    };

    const handleDragOver = async (e: React.DragEvent) => {
        e.preventDefault();

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileChange(droppedFile);
        }

        e.dataTransfer.clearData();
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            handleFileChange(droppedFile);
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="flex flex-col mt-10 gap-5 w-screen h-screen">
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-bold">Upload Resume</h1>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("text-sm font-semibold dark:text-gray-200 dark:hover:text-gray-100 hover:text-gray-500",
                        loading && 'opacity-50 pointer-events-none cursor-not-allowed')}
                    onClick={handleButtonClick}
                >
                    Upload
                </Button>
            </div>
            <div
                className={cn(`flex flex-col items-center justify-center w-full h-96 border-2 
                    border-dashed rounded-md border-gray-900 dark:border-gray-700
                    hover:border-gray-200 dark:hover:border-gray-300 cursor-pointer 
                    duration-500 ease-in-out transition`,
                    loading && 'opacity-50 pointer-events-none cursor-not-allowed')}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleButtonClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (!e.target.files) return;

                        const uploadedFile = e.target.files[0];
                        handleFileChange(uploadedFile);
                    }}
                />
                <p className="text-sm text-gray-500">
                    Drag and drop file here or click to select file
                </p>
                {loading && (
                    <div className="flex flex-col items-center justify-center">
                        <Spinner size="small" />
                    </div>
                )}
            </div>
            <div className="flex flex-row gap-2 justify-between">
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">
                        Note: Only PDF files are allowed
                    </p>
                    <p className="text-sm text-gray-500">
                        File size must be less than 5MB
                    </p>
                </div>
                <div className="flex flex-col gap-2">
                    <ResumeButton>
                        <Button variant="outline" size="sm">
                            View Resume
                        </Button>
                    </ResumeButton>
                </div>

            </div>
        </div>
    );
};

export default Upload;
