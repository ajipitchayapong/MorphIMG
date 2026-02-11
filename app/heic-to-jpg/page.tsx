import { Metadata } from "next";
import { ConverterPage } from "@/components/converter-page";

export const metadata: Metadata = {
  title: "Free Online HEIC to JPG Converter - Privacy Focused | MorphIMG",
  description:
    "Convert HEIC to JPG instantly in your browser. 100% private - no uploads to servers. Perfect for iPhone photos. Unlimited file size, unlimited conversions.",
  keywords:
    "HEIC to JPG, HEIC converter, iPhone photos, Apple photos converter, HEIC to JPEG",
};

export default function HeicToJpgPage() {
  return (
    <ConverterPage
      title="HEIC to JPG Converter"
      description="Convert your iPhone HEIC photos to JPG format instantly. Works offline, 100% private - your photos never leave your device."
      inputFormat="HEIC"
      outputFormat="jpg"
      h1="Free Online HEIC to JPG Converter"
    />
  );
}
