"use client";

import { useEffect, useState } from "react";
import { Users, Image as ImageIcon, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  description: string;
  delay?: number;
}

function StatItem({
  icon: Icon,
  label,
  value,
  description,
  delay = 0,
}: StatItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        "flex flex-col items-center p-6 bg-card border border-border rounded-2xl transition-all duration-700 transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-sm font-medium text-muted-foreground mb-2">
        {label}
      </div>
      <div className="text-xs text-muted-foreground/60 text-center">
        {description}
      </div>
    </div>
  );
}

export function StatsSection() {
  const [visitorCount, setVisitorCount] = useState<number | string>("...");
  const [processedCount, setProcessedCount] = useState<number | string>("...");

  useEffect(() => {
    const fetchStats = async () => {
      const namespace = process.env.NEXT_PUBLIC_STATS_NAMESPACE || "morphimg";
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        // Fetch visitor count
        const vResponse = await fetch(
          `https://api.counterapi.dev/v1/${namespace}/visits/increment`,
          {
            signal: controller.signal,
          },
        );

        // Fetch processed count (just get, don't increment here)
        const pResponse = await fetch(
          `https://api.counterapi.dev/v1/${namespace}/processed`,
          {
            signal: controller.signal,
          },
        );

        clearTimeout(timeoutId);

        if (vResponse.ok) {
          const vData = await vResponse.json();
          if (vData && typeof vData.count === "number") {
            setVisitorCount(vData.count.toLocaleString());
          }
        }

        if (pResponse.ok) {
          const pData = await pResponse.json();
          if (pData && typeof pData.count === "number") {
            setProcessedCount(pData.count.toLocaleString());
          }
        }
      } catch (error) {
        // Fallback to local session storage only if API fails
        // We Use 0 as base for "Real" feeling from the start of tracker
        const storedV = localStorage.getItem("m_v_real") || "0";
        const newV = parseInt(storedV) + 1;
        localStorage.setItem("m_v_real", newV.toString());
        setVisitorCount(newV.toLocaleString());

        const storedP = localStorage.getItem("m_p_real") || "0";
        setProcessedCount(parseInt(storedP).toLocaleString());
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-12 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatItem
            icon={Users}
            label="Total Visitors"
            value={visitorCount}
            description="Real-time visitor count since tracker implementation"
            delay={100}
          />
          <StatItem
            icon={ImageIcon}
            label="Images Processed"
            value={processedCount}
            description="Global count of images converted by our community"
            delay={200}
          />
          <StatItem
            icon={ShieldCheck}
            label="Privacy First"
            value="100% Secure"
            description="Your files never leave your browser. Zero server uploads."
            delay={300}
          />
        </div>
      </div>
    </section>
  );
}
