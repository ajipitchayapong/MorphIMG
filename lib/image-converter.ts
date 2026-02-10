import { useImageStore, type ImageFormat, type ImageFile } from "./image-store";
import JSZip from "jszip";
//
// HEIC support via heic-to (CDN)

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

  /* console.log(
    `[Estimation] Testing support for ${mimeType}: initial=${initialBlob.type} (${initialBlob.size}), second=${secondBlob.type} (${secondBlob.size})`,
  ); */

  // Check if browser actually supports the quality parameter AND the mimeType
  const isTypeSupported = initialBlob.type === mimeType;
  const isQualitySupported = initialBlob.size !== secondBlob.size;

  if (
    !isTypeSupported ||
    !isQualitySupported ||
    initialBlob.size <= targetBytes
  ) {
    return { blob: initialBlob, quality: high };
  }

  let bestBlob = secondBlob;
  /* console.log(
    `[Estimation] Starting search: high=${initialBlob.size}, low=${secondBlob.size}, target=${targetBytes}`,
  ); */

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
    targetFileSizeUnit: "KB" | "MB";
    resizeFit: "contain" | "cover" | "fill";
  },
): Promise<ConversionResult> => {
  console.log(`[Converter] Starting conversion for ${file.name}`, {
    format: settings.outputFormat,
    mode: settings.resizeMode,
    fit: settings.resizeFit,
    target: `${settings.resizeWidth}x${settings.resizeHeight}`,
    percentage: settings.resizePercentage,
  });
  // Handle HEIC/HEIF conversion first if needed
  let imageSource: string | Blob = file;
  let isHeic = false;

  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.toLowerCase().endsWith(".heic") ||
    file.name.toLowerCase().endsWith(".heif")
  ) {
    try {
      const globalHeicTo = (window as any).HeicTo || (window as any).heicTo;

      if (typeof window !== "undefined" && !globalHeicTo) {
        throw new Error("HEIC conversion library not loaded.");
      }

      const HeicTo = globalHeicTo;
      console.log("Converting HEIC to JPEG for processing:", file.name);

      const convertedBlob = await HeicTo({
        blob: file,
        type: "image/jpeg",
        quality: 1,
      });
      console.log("HEIC to JPEG conversion successful:", file.name);

      // heic2any can return a single blob or an array of blobs
      imageSource = Array.isArray(convertedBlob)
        ? convertedBlob[0]
        : convertedBlob;
      isHeic = true;
    } catch (e) {
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
      console.error("HEIC conversion failed:", errorMessage, e);
      throw new Error(
        "Failed to process HEIC file. Please ensure the file is valid.",
      );
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const objectUrl = URL.createObjectURL(
      imageSource instanceof Blob ? imageSource : file,
    );

    img.onload = async () => {
      // Clean up the object URL if we created one specifically for conversion
      URL.revokeObjectURL(objectUrl);

      let targetWidth = img.width;
      let targetHeight = img.height;

      let drawX = 0;
      let drawY = 0;
      let drawWidth = targetWidth;
      let drawHeight = targetHeight;
      let sourceX = 0;
      let sourceY = 0;
      let sourceWidth = img.width;
      let sourceHeight = img.height;

      // Apply resize settings
      if (settings.resizeMode === "percentage") {
        targetWidth = Math.round(img.width * (settings.resizePercentage / 100));
        targetHeight = Math.round(
          img.height * (settings.resizePercentage / 100),
        );
        drawWidth = targetWidth;
        drawHeight = targetHeight;
      } else if (settings.resizeMode === "fixed") {
        targetWidth = settings.resizeWidth;
        targetHeight = settings.resizeHeight;

        if (settings.resizeFit === "contain") {
          // Keep the target dimensions exactly as specified
          // and fit the image inside while maintaining aspect ratio
          const aspectRatio = img.width / img.height;
          const targetRatio = targetWidth / targetHeight;

          if (targetRatio > aspectRatio) {
            // Target is wider than image -> fit to height
            drawHeight = targetHeight;
            drawWidth = Math.round(targetHeight * aspectRatio);
            drawX = Math.round((targetWidth - drawWidth) / 2);
          } else {
            // Target is taller than image -> fit to width
            drawWidth = targetWidth;
            drawHeight = Math.round(targetWidth / aspectRatio);
            drawY = Math.round((targetHeight - drawHeight) / 2);
          }
        } else if (settings.resizeFit === "cover") {
          // Fill the box, cropping excess
          // Calculate scale to cover
          const scaleX = targetWidth / img.width;
          const scaleY = targetHeight / img.height;
          const scale = Math.max(scaleX, scaleY);

          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;

          // Center crop
          sourceWidth = targetWidth / scale;
          sourceHeight = targetHeight / scale;
          sourceX = (img.width - sourceWidth) / 2;
          sourceY = (img.height - sourceHeight) / 2;

          drawWidth = targetWidth;
          drawHeight = targetHeight;
        } else if (settings.resizeFit === "fill") {
          // Stretch to fill
          drawWidth = targetWidth;
          drawHeight = targetHeight;
        }
      }

      console.log(
        `[Converter] Canvas size for ${file.name}: ${targetWidth}x${targetHeight}`,
      );
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Fill background for JPG/HEIC or whenever using "contain" to provide padding color
      if (
        settings.outputFormat === "jpg" ||
        isHeic ||
        settings.resizeFit === "contain"
      ) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // Higher quality interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        drawX,
        drawY,
        drawWidth,
        drawHeight,
      );

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
        const multiplier =
          settings.targetFileSizeUnit === "MB" ? 1024 * 1024 : 1024;
        const targetBytes = settings.targetFileSize * multiplier;
        const { blob } = await findOptimalQuality(
          canvas,
          mimeType,
          targetBytes,
        );

        resolve({ blob, width: targetWidth, height: targetHeight });
      } else {
        const quality = settings.quality / 100;
        canvas.toBlob(
          (blob) => {
            if (blob) {
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
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = objectUrl;
  });
};

export const convertImages = async (): Promise<void> => {
  const store = useImageStore.getState();
  const { files, updateFileStatus, setIsConverting } = store;

  const pendingFiles = files.filter((f) => f.status === "pending");
  if (pendingFiles.length === 0) return;

  setIsConverting(true);

  const CONCURRENCY_LIMIT = 3;
  const queue = [...pendingFiles];

  // Helper to process a single file from the queue
  const processNext = async () => {
    while (queue.length > 0) {
      const file = queue.shift();
      if (!file) break;

      updateFileStatus(file.id, "converting");

      // Sub-progress simulation
      useImageStore.setState({ subProgress: 0 });
      const simulationInterval = setInterval(() => {
        const current = useImageStore.getState().subProgress;
        if (current < 90) {
          useImageStore.setState({ subProgress: current + Math.random() * 10 });
        }
      }, 200);

      try {
        const result = await convertSingleImage(file.file, file.settings);
        clearInterval(simulationInterval);
        useImageStore.setState({ subProgress: 100 });

        updateFileStatus(file.id, "done", {
          convertedBlob: result.blob,
          convertedSize: result.blob.size,
        });

        // Brief pause to show 100%
        await new Promise((resolve) => setTimeout(resolve, 100));
        useImageStore.setState({ subProgress: 0 });
      } catch (error) {
        clearInterval(simulationInterval);
        updateFileStatus(file.id, "error", {
          error: error instanceof Error ? error.message : "Unknown error",
        });
        useImageStore.setState({ subProgress: 0 });
      }
    }
  };

  // Create a pool of workers
  const workers = Array.from(
    { length: Math.min(CONCURRENCY_LIMIT, pendingFiles.length) },
    () => processNext(),
  );

  await Promise.all(workers);

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
