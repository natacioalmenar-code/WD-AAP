import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  right?: React.ReactNode;
  /** "default" = fosc tipus Home, "light" = capçalera clara */
  variant?: "default" | "light";
  /** alçada en px (només variant default) */
  height?: number;
};

export const PageHero: React.FC<Props> = ({
  title,
  subtitle,
  badge,
  right,
  variant = "default",
  height = 280,
}) => {
  const { clubSettings } = useApp();

  const bg = useMemo(() => {
    const anySettings = clubSettings as any;
    return (
      (clubSettings?.appBackgroundUrl || "").trim() ||
      (anySettings?.homeHeroImageUrl || "").trim() ||
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2400&q=70"
    );
  }, [clubSettings]);

  if (variant === "light") {
    return (
      <div className="bg-slate-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              {badge ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 text-yellow-900 border border-yellow-200 px-3 py-1 text-xs font-black">
                  {badge}
                </div>
              ) : null}
              <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
                  {subtitle}
                </p>
              ) : null}
            </div>
            {right ? <div className="shrink-0">{right}</div> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <div
        className="w-full"
        style={{
          height,
          backgroundImage: `url(\"${bg}\")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-[#081428]/90 via-[#0b1730]/70 to-black/90" />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="absolute inset-0 flex items-end">
        <div className="max-w-6xl mx-auto px-4 pb-8 w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="max-w-3xl">
              {badge ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 text-white/90 text-sm font-bold">
                  {badge}
                </div>
              ) : null}

              <h1 className="mt-4 text-white text-3xl sm:text-4xl font-black leading-tight tracking-tight">
                {title}
              </h1>

              {subtitle ? (
                <p className="mt-2 text-white/85 text-sm sm:text-base leading-relaxed">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {right ? <div className="shrink-0">{right}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
};
