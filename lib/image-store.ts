import { create } from "zustand";

export type ImageFormat = "jpg" | "png" | "webp" | "avif";

export interface ImageFile {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth?: number;
  originalHeight?: number;
  preview: string;
  status: "pending" | "converting" | "done" | "error";
  convertedBlob?: Blob;
  convertedSize?: number;
  error?: string;
  settings: ConversionSettings; // Individual settings for this file
}

export interface ConversionSettings {
  outputFormat: ImageFormat;
  quality: number;
  resizeMode: "none" | "percentage" | "fixed";
  resizePercentage: number;
  resizeWidth: number;
  resizeHeight: number;
  maintainAspectRatio: boolean;
  targetFileSize: number | null;
  targetFileSizeUnit: "KB" | "MB";
  lockedRatio: number | null;
  resizeFit: "contain" | "cover" | "fill";
}

export const INITIAL_SETTINGS: ConversionSettings = {
  outputFormat: "webp",
  quality: 85,
  resizeMode: "percentage",
  resizePercentage: 100,
  resizeWidth: 1920,
  resizeHeight: 1080,
  maintainAspectRatio: true,
  targetFileSize: null,
  targetFileSizeUnit: "KB",
  lockedRatio: null,
  resizeFit: "cover",
};

interface ImageStore {
  files: ImageFile[];
  settings: ConversionSettings; // Global/Default settings
  selectedFileIds: string[];
  isConverting: boolean;
  isEstimating: boolean;
  isPersistenceEnabled: boolean;
  subProgress: number; // 0-100 progress for the current file being converted
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
  updateFileStatus: (
    id: string,
    status: ImageFile["status"],
    data?: Partial<ImageFile>,
  ) => void;
  updateSettings: (settings: Partial<ConversionSettings>) => void;
  updateFileSettings: (
    id: string,
    settings: Partial<ConversionSettings>,
  ) => void;
  toggleFileSelection: (id: string) => void;
  setSelectedFileIds: (ids: string[]) => void;
  clearSelection: () => void;
  setIsConverting: (isConverting: boolean) => void;
  setIsEstimating: (isEstimating: boolean) => void;
  saveSettingsAsDefault: () => void;
  clearSavedSettings: () => void;
  togglePersistence: (enabled: boolean) => void;
  resetToDefault: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const SUPPORTED_INPUT_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
  "image/avif",
  "image/tiff",
  "image/bmp",
];

export const useImageStore = create<ImageStore>((set, get) => ({
  files: [],
  settings: {
    outputFormat: "webp",
    quality: 85,
    resizeMode: "percentage",
    resizePercentage: 100,
    resizeWidth: 1920,
    resizeHeight: 1080,
    maintainAspectRatio: true,
    targetFileSize: null,
    targetFileSizeUnit: "KB",
    lockedRatio: null,
    resizeFit: "cover",
  },
  isConverting: false,
  isEstimating: false,
  isPersistenceEnabled: false,
  selectedFileIds: [],
  subProgress: 0,

  addFiles: (newFiles) => {
    const currentSettings = get().settings;
    const validFiles = newFiles.filter(
      (file) =>
        SUPPORTED_INPUT_FORMATS.includes(file.type) ||
        file.name.toLowerCase().endsWith(".heic") ||
        file.name.toLowerCase().endsWith(".heif"),
    );

    const imageFiles: ImageFile[] = validFiles.map((file) => ({
      id: generateId(),
      file,
      name: file.name,
      originalSize: file.size,
      preview: URL.createObjectURL(file),
      status: "pending",
      settings: { ...currentSettings },
    }));

    set((state) => ({
      files: [...state.files, ...imageFiles],
      // Maintain current selection, don't auto-select new ones
      selectedFileIds: state.selectedFileIds,
    }));

    // Asynchronously load dimensions
    imageFiles.forEach(async (imgFile, index) => {
      let src = imgFile.preview;
      let isHeic = false;

      // Handle HEIC preview generation
      if (
        imgFile.file.type === "image/heic" ||
        imgFile.file.type === "image/heif" ||
        imgFile.name.toLowerCase().endsWith(".heic") ||
        imgFile.name.toLowerCase().endsWith(".heif")
      ) {
        try {
          // Detect HEIC conversion library (HeicTo or heicTo)
          const globalHeicTo = (window as any).HeicTo || (window as any).heicTo;

          if (typeof window !== "undefined" && !globalHeicTo) {
            console.error(
              "HEIC Library detection failed. window.HeicTo:",
              (window as any).HeicTo,
              "window.heicTo:",
              (window as any).heicTo,
            );
            throw new Error(
              "HEIC conversion library not found on window object.",
            );
          }

          const HeicTo = globalHeicTo;
          console.log("Starting HEIC preview conversion for:", imgFile.name);

          const convertedBlob = await HeicTo({
            blob: imgFile.file,
            type: "image/jpeg",
            quality: 0.5, // Lower quality for preview is fine
          });
          console.log("HEIC preview conversion successful for:", imgFile.name);

          const blob = Array.isArray(convertedBlob)
            ? convertedBlob[0]
            : convertedBlob;
          src = URL.createObjectURL(blob);
          isHeic = true;

          // Update the preview URL in the store
          get().updateFileStatus(imgFile.id, "pending", {
            preview: src,
          });
        } catch (e) {
          // Inspect the error object for details
          let errorMessage = "Unknown error";
          if (e instanceof Error) {
            errorMessage = e.message;
          } else if (typeof e === "object" && e !== null) {
            try {
              errorMessage = JSON.stringify(e);
            } catch {
              errorMessage = "Unserializable object";
            }
          } else {
            errorMessage = String(e);
          }
          console.error("Failed to generate HEIC preview:", errorMessage, e);
        }
      }

      const img = new Image();
      img.src = src;
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;

        get().updateFileStatus(imgFile.id, "pending", {
          originalWidth: width,
          originalHeight: height,
        });

        get().updateFileSettings(imgFile.id, {
          resizeWidth: width,
          resizeHeight: height,
          lockedRatio: width / height,
        });

        if (
          get().files.length === imageFiles.length &&
          index === 0 &&
          !get().settings.lockedRatio &&
          get().settings.resizeWidth === INITIAL_SETTINGS.resizeWidth &&
          get().settings.resizeHeight === INITIAL_SETTINGS.resizeHeight
        ) {
          get().updateSettings({
            resizeWidth: width,
            resizeHeight: height,
            lockedRatio: width / height,
          });
        }
      };
    });
  },

  removeFile: (id) => {
    set((state) => {
      const file = state.files.find((f) => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      const newFiles = state.files.filter((f) => f.id !== id);
      const newSelections = state.selectedFileIds.filter((sid) => sid !== id);

      if (newFiles.length === 0) {
        get().resetToDefault();
      }

      return {
        files: newFiles,
        selectedFileIds: newSelections,
      };
    });
  },

  clearFiles: () => {
    set((state) => {
      for (const file of state.files) {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      }
      return { files: [], selectedFileIds: [] };
    });
    get().resetToDefault();
  },

  updateFileStatus: (id, status, data) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id ? { ...f, status, ...data } : f,
      ),
    }));
  },

  updateSettings: (newSettings) => {
    const { selectedFileIds, settings: currentGlobalSettings } = get();
    const updatedGlobal = { ...currentGlobalSettings, ...newSettings };

    set((state) => ({
      settings: updatedGlobal,
      files: state.files.map((f) => {
        const isAffected =
          selectedFileIds.length === 0 || selectedFileIds.includes(f.id);

        if (isAffected) {
          return {
            ...f,
            status: f.status === "done" ? "pending" : f.status,
            settings:
              selectedFileIds.length === 0
                ? updatedGlobal
                : { ...f.settings, ...newSettings },
          };
        }
        return f;
      }),
    }));

    if (get().isPersistenceEnabled) {
      get().saveSettingsAsDefault();
    }
  },

  updateFileSettings: (id, newSettings) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.id === id
          ? {
              ...f,
              status: f.status === "done" ? "pending" : f.status,
              settings: { ...f.settings, ...newSettings },
            }
          : f,
      ),
      // If we're updating a file that might be representing the current visible settings, sync it
      settings:
        state.selectedFileIds.includes(id) &&
        state.selectedFileIds.at(-1) === id
          ? { ...state.settings, ...newSettings }
          : state.settings,
    }));
  },

  toggleFileSelection: (id) => {
    set((state) => {
      const isSelected = state.selectedFileIds.includes(id);
      const newIds = isSelected
        ? state.selectedFileIds.filter((sid) => sid !== id)
        : [...state.selectedFileIds, id];

      // Sync active settings panel to the last selected file
      const lastSelectedFile = state.files.find((f) => f.id === newIds.at(-1));

      return {
        selectedFileIds: newIds,
        settings: lastSelectedFile
          ? { ...lastSelectedFile.settings }
          : state.settings,
      };
    });
  },

  setSelectedFileIds: (ids) => {
    const lastFile = get().files.find((f) => f.id === ids.at(-1));
    set({
      selectedFileIds: ids,
      settings: lastFile ? { ...lastFile.settings } : get().settings,
    });
  },

  clearSelection: () => {
    set({ selectedFileIds: [] });
  },

  setIsConverting: (isConverting: boolean) => {
    set({ isConverting });
  },
  setIsEstimating: (isEstimating) => {
    set({ isEstimating });
  },

  saveSettingsAsDefault: () => {
    if (typeof window === "undefined") return;
    const { settings } = get();
    localStorage.setItem("pixel-settings", JSON.stringify(settings));
  },

  clearSavedSettings: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("pixel-settings");
    set({ isPersistenceEnabled: false });
    get().resetToDefault();
  },

  togglePersistence: (enabled: boolean) => {
    if (enabled) {
      get().saveSettingsAsDefault();
      set({ isPersistenceEnabled: true });
    } else {
      get().clearSavedSettings();
    }
  },

  resetToDefault: () => {
    if (typeof window === "undefined") {
      set({ settings: { ...INITIAL_SETTINGS } });
      return;
    }

    const saved = localStorage.getItem("pixel-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        set({
          settings: { ...INITIAL_SETTINGS, ...parsed },
          isPersistenceEnabled: true,
        });
        return;
      } catch (e) {
        console.error("Failed to parse saved settings", e);
      }
    }

    set({ settings: { ...INITIAL_SETTINGS }, isPersistenceEnabled: false });
  },
}));

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
};
