import React from "react";
import { FileText, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms of Service | MorphIMG",
  description: "Read the rules and conditions for using MorphIMG.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-3xl mx-auto mb-8">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="text-muted-foreground hover:text-blue-500 transition-colors"
        >
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </Button>
      </div>
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Terms of Service
          </h1>
          <p className="text-muted-foreground text-lg">
            Last updated: February 10, 2026
          </p>
        </div>

        <section className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-500" /> 1. Acceptance of
              Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using MorphIMG, you agree to comply with and be
              bound by these Terms of Service. If you do not agree to these
              terms, please do not use our services.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-blue-500" /> 2. Use of
              Service
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              MorphIMG provides browser-based image conversion tools. You may
              use these tools for personal or commercial purposes. You agree not
              to:
            </p>
            <ul className="grid gap-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                • Use the service for any illegal or unauthorized purpose.
              </li>
              <li className="flex items-center gap-2">
                • Attempt to decompile or reverse engineer any part of the
                service.
              </li>
              <li className="flex items-center gap-2">
                • Use the service to distribute malicious software or content.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" /> 3. Disclaimer
              of Warranties
            </h2>
            <p className="text-muted-foreground leading-relaxed bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
              MorphIMG is provided "as is" and "as available" without any
              warranties, express or implied. We do not guarantee that the
              service will be uninterrupted, secure, or error-free. You process
              your files at your own risk.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">4. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall MorphIMG or its developers be liable for any
              indirect, incidental, special, or consequential damages resulting
              from the use or inability to use our services.
            </p>
          </div>
        </section>

        <div className="pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            We reserve the right to modify these terms at any time. Your
            continued use of the site constitutes acceptance of the updated
            terms.
          </p>
        </div>
      </div>
    </div>
  );
}
