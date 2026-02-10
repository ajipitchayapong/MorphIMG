import React from "react";
import { FileText, CheckCircle, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Terms of Service | HushPixel",
  description: "Read the rules and conditions for using HushPixel.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-4">
            <FileText className="w-8 h-8" />
          </div>
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
              <CheckCircle className="w-6 h-6 text-emerald-500" /> 1. Acceptance
              of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using HushPixel, you agree to comply with and be
              bound by these Terms of Service. If you do not agree to these
              terms, please do not use our services.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-emerald-500" /> 2. Use of
              Service
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              HushPixel provides browser-based image conversion tools. You may
              use these tools for personal or commercial purposes. You agree not
              to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                Attempt to disrupt or interfere with the website's security or
                integrity.
              </li>
              <li>Use the service for any illegal or unauthorized purpose.</li>
              <li>
                Automate requests to our service in a way that causes excessive
                load.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" /> 3. Disclaimer
              of Warranties
            </h2>
            <p className="text-muted-foreground leading-relaxed bg-amber-500/5 p-4 rounded-xl border border-amber-500/20">
              HushPixel is provided "as is" and "as available" without any
              warranties, express or implied. We do not guarantee that the
              service will be uninterrupted, secure, or error-free. You process
              your files at your own risk.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">4. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall HushPixel or its developers be liable for any
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
