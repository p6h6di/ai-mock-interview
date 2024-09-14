import React from "react";
import { AnimatedTooltipPreview } from "./_components/AnimatedTooltipPreview";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-dvh grid-rows-[1fr_auto]">
      <div className="flex items-center justify-center">
        <div className="relative py-3 sm:mx-auto sm:max-w-xl">{children}</div>
      </div>

      <AnimatedTooltipPreview />
    </div>
  );
}
