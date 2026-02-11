"use client";

import { Coffee } from "lucide-react";

export function KofiButton() {
  return (
    <a
      href="https://ko-fi.com/ajioh"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[84px] right-6 z-[90] flex items-center justify-center p-[1px] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full w-[160px] shadow-lg transition-all hover:scale-110 active:scale-95 group sm:bottom-[96px] sm:right-8"
    >
      <div className="flex h-[46px] w-full items-center justify-center gap-2 bg-card rounded-full transition-colors group-hover:bg-card/80">
        <Coffee className="w-5 h-5 text-blue-600" />
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Support me
        </span>
      </div>
    </a>
  );
}
