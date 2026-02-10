import { Metadata } from "next";
import { ConverterPage } from "@/components/converter-page";

export const metadata: Metadata = {
  title: "Free Online Image Compressor - Privacy Focused | HushPixel",
  description:
    "Compress images to any target file size. 100% private - no uploads. Supports JPG, PNG, WebP. Perfect for email attachments and web uploads.",
  keywords:
    "image compressor, compress images, reduce image size, image optimization, file size reducer",
};

export default function CompressImagePage() {
  return (
    <ConverterPage
      title="Image Compressor"
      description="Compress images to your target file size instantly. Use our quality slider or set a specific file size target. 100% private."
      inputFormat="Image"
      outputFormat="webp"
      h1="Free Online Image Compressor"
    />
  );
}
