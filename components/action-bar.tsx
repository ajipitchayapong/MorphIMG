"use client";

import { useImageStore, formatFileSize } from "@/lib/image-store";
import { Button } from "@/components/ui/button";
import { Zap, Download, Loader2, CheckCircle2, Package } from "lucide-react";
import {
  convertImages,
  downloadAllAsZip,
  downloadSingleFile,
} from "@/lib/image-converter";

export function ActionBar() {
  const { files, isConverting, settings } = useImageStore();

  const hasFiles = files.length > 0;
  const pendingFiles = files.filter((f) => f.status === "pending");
  const completedFiles = files.filter((f) => f.status === "done");
  const convertingFiles = files.filter((f) => f.status === "converting");
  const canConvert = pendingFiles.length > 0 && !isConverting;
  const canDownload = completedFiles.length > 0;
  const allDone =
    pendingFiles.length === 0 && completedFiles.length > 0 && !isConverting;

  // Calculate total savings
  const totalOriginal = completedFiles.reduce(
    (sum, f) => sum + f.originalSize,
    0,
  );
  const totalConverted = completedFiles.reduce(
    (sum, f) => sum + (f.convertedSize || f.originalSize),
    0,
  );
  const totalSavings = totalOriginal - totalConverted;
  const savingsPercent =
    totalOriginal > 0 ? Math.round((totalSavings / totalOriginal) * 100) : 0;

  const handleConvert = async () => {
    await convertImages();
  };

  const handleDownload = async () => {
    if (completedFiles.length === 1) {
      const file = completedFiles[0];
      if (file.convertedBlob) {
        downloadSingleFile(file);
      }
    } else {
      await downloadAllAsZip(completedFiles);
    }
  };

  if (!hasFiles) return null;

  return (
    <div className="sticky bottom-4 z-10">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-lg">
        {/* Status */}
        <div className="flex-1 flex items-center gap-3">
          {isConverting && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2
                className="w-4 h-4 animate-spin text-primary"
                suppressHydrationWarning
              />
              <span className="text-muted-foreground">
                Converting{" "}
                {convertingFiles.length > 0
                  ? `${completedFiles.length + 1}/${files.length}`
                  : "..."}
              </span>
            </div>
          )}
          {allDone && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-success">
                <CheckCircle2 className="w-4 h-4" suppressHydrationWarning />
                <span className="text-sm font-medium">Done!</span>
              </div>
              {totalSavings > 0 && (
                <span className="text-xs text-muted-foreground">
                  Saved {formatFileSize(totalSavings)} ({savingsPercent}%)
                </span>
              )}
            </div>
          )}
          {!isConverting && !allDone && pendingFiles.length > 0 && (
            <span className="text-sm text-muted-foreground">
              {pendingFiles.length}{" "}
              {pendingFiles.length === 1 ? "image" : "images"} ready
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {canConvert && (
            <Button
              onClick={handleConvert}
              disabled={!canConvert}
              size="default"
              className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all border-0 font-bold"
            >
              <Zap className="w-4 h-4 mr-2" suppressHydrationWarning />
              Convert to {settings.outputFormat.toUpperCase()}
            </Button>
          )}

          {canDownload && (
            <Button
              variant={allDone ? "default" : "outline"}
              onClick={handleDownload}
              size="default"
              className={
                allDone
                  ? "flex-1 sm:flex-none bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all border-0 font-bold"
                  : "flex-1 sm:flex-none bg-transparent border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
              }
            >
              {completedFiles.length > 1 ? (
                <>
                  <Package className="w-4 h-4 mr-2" suppressHydrationWarning />
                  Download ZIP
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" suppressHydrationWarning />
                  Download
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
