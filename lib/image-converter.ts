import { useImageStore, type ImageFormat, type ImageFile } from "./image-store";
import JSZip from "jszip";

const getMimeType = (format: ImageFormat): string => {
  const mimeTypes: Record<ImageFormat, string> = {
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    avif: "image/avif",
  };
  return mimeTypes[format];
};

const getFileExtension = (format: ImageFormat): string => {
  return format === "jpg" ? "jpg" : format;
};

interface ConversionResult {
  blob: Blob;
  width: number;
  height: number;
}

export const findOptimalQuality = async (
  canvas: HTMLCanvasElement,
  mimeType: string,
  targetBytes: number,
): Promise<{ blob: Blob; quality: number }> => {
  let low = 0.01; // Support even lower quality for strict targets
  let high = 1.0;
  let bestQuality = low; // Default to lowest if even low is too big

  const tryConvert = (q: number): Promise<Blob> => {
    return new Promise((res) => {
      try {
        canvas.toBlob(
          (blob) => {
            res(blob || new Blob());
          },
          mimeType,
          q,
        );
      } catch (e) {
        res(new Blob());
      }
    });
  };

  const initialBlob = await tryConvert(high);
  const secondBlob = await tryConvert(low);

  console.log(
    `[Estimation] Testing support for ${mimeType}: initial=${initialBlob.type} (${initialBlob.size}), second=${secondBlob.type} (${secondBlob.size})`,
  );

  // Check if browser actually supports the quality parameter AND the mimeType
  const isTypeSupported = initialBlob.type === mimeType;
  const isQualitySupported = initialBlob.size !== secondBlob.size;

  if (
    !isTypeSupported ||
    !isQualitySupported ||
    initialBlob.size <= targetBytes
  ) {
    if (initialBlob.size <= targetBytes) {
      console.log(
        `[Estimation] Target met at high quality: ${initialBlob.size} <= ${targetBytes}`,
      );
    } else if (!isTypeSupported) {
      console.log(
        `[Estimation] Browser fallback to ${initialBlob.type} (Expected ${mimeType})`,
      );
    } else {
      console.log(
        `[Estimation] Quality adjustment not supported for ${mimeType}`,
      );
    }
    return { blob: initialBlob, quality: high };
  }

  let bestBlob = secondBlob;
  console.log(
    `[Estimation] Starting search: high=${initialBlob.size}, low=${secondBlob.size}, target=${targetBytes}`,
  );

  // Optimize search: 10 iterations for ~0.1% precision
  for (let i = 0; i < 10; i++) {
    const mid = (low + high) / 2;
    const blob = await tryConvert(mid);

    if (blob.size <= targetBytes) {
      bestBlob = blob;
      bestQuality = mid;
      low = mid;
    } else {
      high = mid;
    }
  }

  return { blob: bestBlob, quality: bestQuality };
};

// Fast convolution-based sharpening
const applySharpenFilter = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  mix: number,
) => {
  const weights = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  const katet = Math.round(Math.sqrt(weights.length));
  const half = (katet * 0.5) | 0;
  const dstData = ctx.createImageData(w, h);
  const dstBuff = dstData.data;
  const srcBuff = ctx.getImageData(0, 0, w, h).data;
  let y = h;

  while (y--) {
    const yk = y;
    let x = w;
    while (x--) {
      const xk = x;
      const srcOff = (y * w + x) * 4;
      const dstOff = (y * w + x) * 4;
      let r = 0,
        g = 0,
        b = 0,
        a = 0;

      for (let cy = 0; cy < katet; cy++) {
        const sy = yk - half + cy;
        const addY = sy * w;
        for (let cx = 0; cx < katet; cx++) {
          const sx = xk - half + cx;
          const sy = y + cy - half;
          const sx2 = x + cx - half;

          if (sy >= 0 && sy < h && sx2 >= 0 && sx2 < w) {
            const scy = sy;
            const scx = sx2;
            const srcOff = (scy * w + scx) * 4;
            const wt = weights[cy * katet + cx];
            r += srcBuff[srcOff] * wt;
            g += srcBuff[srcOff + 1] * wt;
            b += srcBuff[srcOff + 2] * wt;
            a += srcBuff[srcOff + 3] * wt;
          }
        }
      }

      dstBuff[dstOff] = r * mix + srcBuff[srcOff] * (1 - mix);
      dstBuff[dstOff + 1] = g * mix + srcBuff[srcOff + 1] * (1 - mix);
      dstBuff[dstOff + 2] = b * mix + srcBuff[srcOff + 2] * (1 - mix);
      dstBuff[dstOff + 3] = srcBuff[srcOff + 3];
    }
  }

  ctx.putImageData(dstData, 0, 0);
};

const convertSingleImage = async (
  file: File,
  settings: {
    outputFormat: ImageFormat;
    quality: number;
    resizeMode: "none" | "percentage" | "fixed";
    resizePercentage: number;
    resizeWidth: number;
    resizeHeight: number;
    maintainAspectRatio: boolean;
    targetFileSize: number | null;
  },
): Promise<ConversionResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = async () => {
      let targetWidth = img.width;
      let targetHeight = img.height;

      // Apply resize settings
      if (settings.resizeMode === "percentage") {
        targetWidth = Math.round(img.width * (settings.resizePercentage / 100));
        targetHeight = Math.round(
          img.height * (settings.resizePercentage / 100),
        );
      } else if (settings.resizeMode === "fixed") {
        if (settings.maintainAspectRatio) {
          const aspectRatio = img.width / img.height;
          if (settings.resizeWidth / settings.resizeHeight > aspectRatio) {
            targetHeight = settings.resizeHeight;
            targetWidth = Math.round(targetHeight * aspectRatio);
          } else {
            targetWidth = settings.resizeWidth;
            targetHeight = Math.round(targetWidth / aspectRatio);
          }
        } else {
          targetWidth = settings.resizeWidth;
          targetHeight = settings.resizeHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Fill with white background for JPG (no alpha channel)
      if (settings.outputFormat === "jpg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // Higher quality interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Apply Smart Sharpen if Upscaling
      // We consider it an upscale if the target area is larger than original area
      const originalArea = img.width * img.height;
      const targetArea = targetWidth * targetHeight;

      if (targetArea > originalArea) {
        console.log("Upscaling detected, applying Smart Sharpen...");
        applySharpenFilter(ctx, targetWidth, targetHeight, 0.8); // Increased strength
      }

      const mimeType = getMimeType(settings.outputFormat);

      // If target file size is set, iteratively adjust quality
      if (settings.targetFileSize !== null && settings.outputFormat !== "png") {
        const targetBytes = settings.targetFileSize * 1024;
        const { blob } = await findOptimalQuality(
          canvas,
          mimeType,
          targetBytes,
        );

        // CHECK: Did the browser actually give us AVIF?
        if (settings.outputFormat === "avif" && blob.type !== "image/avif") {
          reject(
            new Error(
              "Browser silently fell back to PNG. AVIF encoding is not supported.",
            ),
          );
          return;
        }

        resolve({ blob, width: targetWidth, height: targetHeight });
      } else {
        const quality = settings.quality / 100;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // CHECK: Did the browser actually give us AVIF?
              if (
                settings.outputFormat === "avif" &&
                blob.type !== "image/avif"
              ) {
                reject(
                  new Error(
                    "Browser silently fell back to PNG. AVIF encoding is not supported.",
                  ),
                );
                return;
              }
              resolve({ blob, width: targetWidth, height: targetHeight });
            } else {
              reject(new Error("Failed to convert image"));
            }
          },
          mimeType,
          settings.outputFormat === "png" ? undefined : quality,
        );
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = URL.createObjectURL(file);
  });
};

export const convertImages = async (): Promise<void> => {
  const store = useImageStore.getState();
  const { files, settings, updateFileStatus, setIsConverting } = store;

  const pendingFiles = files.filter((f) => f.status === "pending");
  if (pendingFiles.length === 0) return;

  setIsConverting(true);

  for (const file of pendingFiles) {
    updateFileStatus(file.id, "converting");

    try {
      const result = await convertSingleImage(file.file, file.settings);
      updateFileStatus(file.id, "done", {
        convertedBlob: result.blob,
        convertedSize: result.blob.size,
      });
    } catch (error) {
      updateFileStatus(file.id, "error", {
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  setIsConverting(false);
};

export const downloadSingleFile = (file: ImageFile): void => {
  if (!file.convertedBlob) return;

  const extension = getFileExtension(file.settings.outputFormat);
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const fileName = `${baseName}.${extension}`;

  const url = URL.createObjectURL(file.convertedBlob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadAllAsZip = async (files: ImageFile[]): Promise<void> => {
  const zip = new JSZip();

  for (const file of files) {
    if (file.convertedBlob) {
      const extension = getFileExtension(file.settings.outputFormat);
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const fileName = `${baseName}.${extension}`;
      zip.file(fileName, file.convertedBlob);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = "converted-images.zip";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
