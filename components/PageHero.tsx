import React from "react";

export const PageHero: React.FC<{
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  right?: React.ReactNode;
  compact?: boolean; // ✅ nou
}> = ({ title, subtitle, badge, right, compact }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      {/* textura suau */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.22) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/10 to-black/30" />

      <div
        className={`relative max-w-6xl mx-auto px-4 ${
          compact ? "py-10" : "py-16"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-3xl">
            {badge ? (
              <div className="inline-flex items-center rounded-full bg-white/10 border border-white/10 px-4 py-2 text-xs font-black text-white/90">
                {badge}
              </div>
            ) : null}

            <h1 className="mt-4 text-4xl sm:text-5xl font-black text-white leading-tight">
              {title}
            </h1>

            {subtitle ? (
              <p className="mt-3 text-white/80 font-semibold">{subtitle}</p>
            ) : null}
          </div>

          {right ? <div className="shrink-0">{right}</div> : null}
        </div>
      </div>
    </div>
  );
};
