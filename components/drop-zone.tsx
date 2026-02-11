"use client";

import React from "react";

import { useCallback, useState, useRef } from "react";
import { Upload, ImageIcon, ShieldCheck, Plus, Sparkles } from "lucide-react";
import { useImageStore } from "@/lib/image-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DropZoneProps {
  compact?: boolean;
}

export function DropZone({ compact = false }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const addFiles = useImageStore((state) => state.addFiles);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter(
        (f) =>
          f.type.startsWith("image/") ||
          f.name.toLowerCase().endsWith(".heic") ||
          f.name.toLowerCase().endsWith(".heif"),
      );
      if (files.length > 0) {
        addFiles(files);
      }
    },
    [addFiles],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const files = Array.from(e.target.files);
        addFiles(files);
        // Reset input so same file can be selected again
        e.target.value = "";
      }
    },
    [addFiles],
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  // Compact version for when files are already added
  if (compact) {
    return (
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-4 transition-all duration-200 cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.heic,.heif"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <Plus className="w-5 h-5" suppressHydrationWarning />
          <span className="font-medium">Add more images</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 md:p-12 lg:p-16 transition-all duration-300 cursor-pointer group",
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.heic,.heif"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex flex-col items-center text-center">
          <div
            className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300",
              isDragOver
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110 shadow-xl shadow-blue-500/30"
                : "bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 group-hover:from-blue-500/20 group-hover:to-indigo-500/20 group-hover:scale-105",
            )}
          >
            <Upload
              className="w-8 h-8 md:w-10 md:h-10"
              suppressHydrationWarning
            />
          </div>

          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-2 text-balance">
            Drop images here to start
          </h2>
          <p className="text-muted-foreground mb-5 max-w-md text-sm md:text-base text-balance">
            or click to browse your files
          </p>

          <Button
            size="lg"
            className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all border-0"
          >
            <Sparkles className="w-4 h-4 mr-2" suppressHydrationWarning />
            Select Images
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ImageIcon
                className="w-4 h-4 text-blue-500"
                suppressHydrationWarning
              />
              <span>Input: HEIC, AVIF, WebP, PNG, JPG</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles
                className="w-4 h-4 text-indigo-500"
                suppressHydrationWarning
              />
              <span>Convert, Resize & Compress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck
                className="w-4 h-4 text-blue-500"
                suppressHydrationWarning
              />
              <span>100% Private (No Uploads)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm">
          <ShieldCheck
            className="w-4 h-4 text-blue-500"
            suppressHydrationWarning
          />
          <span className="text-muted-foreground">
            Files are processed{" "}
            <span className="text-foreground font-medium">
              locally in your browser
            </span>{" "}
            and never uploaded
          </span>
        </div>
      </div>
    </div>
  );
}
