'use client'

import { Header } from '@/components/header'
import { DropZone } from '@/components/drop-zone'
import { FileList } from '@/components/file-list'
import { ConversionSettings } from '@/components/conversion-settings'
import { ActionBar } from '@/components/action-bar'
import { Footer } from '@/components/footer'
import { useImageStore, type ImageFormat } from '@/lib/image-store'
import { useEffect } from 'react'
import { Shield, Zap, Lock } from 'lucide-react'

interface ConverterPageProps {
  title: string
  description: string
  inputFormat: string
  outputFormat: ImageFormat
  h1: string
}

export function ConverterPage({
  title,
  description,
  inputFormat,
  outputFormat,
  h1,
}: ConverterPageProps) {
  const files = useImageStore((state) => state.files)
  const updateSettings = useImageStore((state) => state.updateSettings)
  const hasFiles = files.length > 0

  useEffect(() => {
    updateSettings({ outputFormat })
  }, [outputFormat, updateSettings])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Privacy First Converter
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4 text-balance">
                {h1}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
                {description}
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <DropZone />

              {hasFiles && (
                <div className="mt-8 space-y-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <FileList />
                    </div>
                    <div className="lg:col-span-1">
                      <ConversionSettings />
                    </div>
                  </div>
                  <ActionBar />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
                Why use our {inputFormat} to {outputFormat.toUpperCase()} converter?
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">100% Private</h3>
                  <p className="text-sm text-muted-foreground">
                    Your {inputFormat} files never leave your device. All conversion happens locally in your browser.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">
                    Convert {inputFormat} to {outputFormat.toUpperCase()} in seconds. No waiting for uploads or downloads.
                  </p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Lock className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">No Limits</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlimited file size. Unlimited conversions. No registration required.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Is {inputFormat} to {outputFormat.toUpperCase()} conversion safe?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Yes! Our converter processes files entirely in your browser. Your {inputFormat} files are never uploaded to any server, ensuring complete privacy and security.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    How do I convert {inputFormat} to {outputFormat.toUpperCase()}?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Simply drag and drop your {inputFormat} files into the drop zone above, adjust the quality settings if needed, and click Convert All. Your converted {outputFormat.toUpperCase()} files will be ready to download instantly.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Can I convert multiple {inputFormat} files at once?
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Yes! You can select and convert multiple {inputFormat} files simultaneously. After conversion, you can download them all at once as a ZIP file.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
