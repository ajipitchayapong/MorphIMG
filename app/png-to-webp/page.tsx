import { Metadata } from 'next'
import { ConverterPage } from '@/components/converter-page'

export const metadata: Metadata = {
  title: 'Free Online PNG to WebP Converter - Privacy Focused | SecurePixel',
  description:
    'Convert PNG to WebP for smaller file sizes and faster websites. 100% private browser-based conversion. No file uploads required.',
  keywords: 'PNG to WebP, image compression, web optimization, smaller images, website speed',
}

export default function PngToWebpPage() {
  return (
    <ConverterPage
      title="PNG to WebP Converter"
      description="Convert PNG images to WebP for up to 80% smaller file sizes. Perfect for web optimization. Your images never leave your device."
      inputFormat="PNG"
      outputFormat="webp"
      h1="Free Online PNG to WebP Converter"
    />
  )
}
