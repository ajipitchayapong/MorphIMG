"use client";

import { useImageStore, formatFileSize } from "@/lib/image-store";
import {
  X,
  Loader2,
  Check,
  AlertCircle,
  ArrowRight,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { downloadSingleFile } from "@/lib/image-converter";
import { Progress } from "@/components/ui/progress";

export function FileList() {
  const {
    files,
    removeFile,
    selectedFileIds,
    toggleFileSelection,
    setSelectedFileIds,
  } = useImageStore();

  if (files.length === 0) return null;

  const completedCount = files.filter((f) => f.status === "done").length;
  const totalCount = files.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const allSelected =
    files.length > 0 && selectedFileIds.length === files.length;

  const RATIO_PRESETS = [
    { label: "1:1", ratio: 1 },
    { label: "4:5", ratio: 4 / 5 },
    { label: "16:9", ratio: 16 / 9 },
    { label: "9:16", ratio: 9 / 16 },
    { label: "4:3", ratio: 4 / 3 },
    { label: "3:2", ratio: 3 / 2 },
  ];

  const getRatioLabel = (w: number, h: number) => {
    const ratio = w / h;
    const match = RATIO_PRESETS.find(
      (p) => Math.abs(ratio - p.ratio) < 0.01, // 1% tolerance for slightly off pixels
    );
    return match ? `${match.label} Ratio` : `${w}x${h}`;
  };

  const handleToggleAll = () => {
    if (allSelected) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(files.map((f) => f.id));
    }
  };

  const handleDownloadSingle = (file: (typeof files)[0]) => {
    if (file.convertedBlob) {
      downloadSingleFile(file);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            {totalCount > 1 && (
              <div
                onClick={handleToggleAll}
                className={cn(
                  "w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors",
                  allSelected
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-background border-border hover:border-emerald-500",
                )}
              >
                {allSelected && <Check className="w-3 h-3" strokeWidth={3} />}
              </div>
            )}
            <h3 className="font-medium text-foreground text-sm">
              {selectedFileIds.length > 0 ? (
                <span className="text-emerald-500 font-bold">
                  {selectedFileIds.length} selected
                </span>
              ) : (
                <span>{totalCount} images ready</span>
              )}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => useImageStore.getState().clearFiles()}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" suppressHydrationWarning />
            Clear all
          </Button>
        </div>
        {completedCount > 0 && completedCount < totalCount && (
          <Progress value={progress} className="h-1" />
        )}
      </div>

      <div className="divide-y divide-border max-h-[420px] overflow-y-auto">
        {files.map((file) => {
          const isSelected = selectedFileIds.includes(file.id);
          const savings = file.convertedSize
            ? Math.round((1 - file.convertedSize / file.originalSize) * 100)
            : 0;

          return (
            <div
              key={file.id}
              onClick={() => totalCount > 1 && toggleFileSelection(file.id)}
              className={cn(
                "group relative flex items-center gap-3 p-3 transition-all",
                totalCount > 1 && "cursor-pointer",
                isSelected && totalCount > 1
                  ? "bg-emerald-500/[0.08] dark:bg-emerald-500/[0.12] shadow-inner"
                  : "hover:bg-muted/40",
                file.status === "error" && "bg-destructive/5",
              )}
            >
              {/* Selection Indicator Bar */}
              {isSelected && totalCount > 1 && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1.5 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-r-full shadow-[2px_0_12px_rgba(16,185,129,0.5)] z-10" />
              )}
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative">
                <img
                  src={file.preview || "/placeholder.svg"}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                {file.status === "converting" && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Loader2
                      className="w-5 h-5 animate-spin text-emerald-500"
                      suppressHydrationWarning
                    />
                  </div>
                )}
                {file.status === "done" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <Check
                      className="w-5 h-5 text-emerald-500"
                      suppressHydrationWarning
                    />
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-base truncate">
                  {file.name}
                </p>
                <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-1">
                  <span className="font-mono">
                    {formatFileSize(file.originalSize)}
                  </span>

                  {file.settings.resizeMode !== "none" && (
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.25 rounded flex items-center gap-1">
                      <span className="opacity-70 uppercase tracking-tighter text-[8px]">
                        Scale
                      </span>
                      {file.settings.resizeMode === "percentage"
                        ? `${file.settings.resizePercentage}%`
                        : getRatioLabel(
                            file.settings.resizeWidth,
                            file.settings.resizeHeight,
                          )}
                    </span>
                  )}

                  {file.settings.quality < 100 && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.25 rounded flex items-center gap-1">
                      <span className="opacity-70 uppercase tracking-tighter text-[8px]">
                        Quality
                      </span>
                      {file.settings.quality}%
                    </span>
                  )}

                  <span className="bg-muted px-1.5 py-0.5 rounded uppercase font-extrabold text-[10px] tracking-tight">
                    {file.settings.outputFormat}
                  </span>

                  {file.status === "done" && file.convertedSize && (
                    <div className="flex items-center gap-1">
                      <ArrowRight
                        className="w-3 h-3"
                        suppressHydrationWarning
                      />
                      <span className="font-medium text-foreground">
                        {formatFileSize(file.convertedSize)}
                      </span>
                      {savings > 0 && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          (-{savings}%)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div
                className="flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                {file.status === "done" && file.convertedBlob && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownloadSingle(file)}
                    className="h-8 w-8 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-500/10"
                  >
                    <Download className="w-4 h-4" suppressHydrationWarning />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(file.id)}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4" suppressHydrationWarning />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
