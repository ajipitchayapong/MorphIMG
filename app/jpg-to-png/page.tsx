import { Metadata } from "next";
import { ConverterPage } from "@/components/converter-page";

export const metadata: Metadata = {
  title: "Free Online JPG to PNG Converter - Privacy Focused | MorphIMG",
  description:
    "Convert JPG to PNG with transparency support. 100% private browser-based conversion. No file uploads, no registration required.",
  keywords:
    "JPG to PNG, JPEG to PNG, add transparency, lossless conversion, image converter",
};

export default function JpgToPngPage() {
  return (
    <ConverterPage
      title="JPG to PNG Converter"
      description="Convert JPG images to PNG format for lossless quality and transparency support. Your images stay private on your device."
      inputFormat="JPG"
      outputFormat="png"
      h1="Free Online JPG to PNG Converter"
    />
  );
}
