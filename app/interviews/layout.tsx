import React from "react";

export default function InterviewsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-gray-100 sm:p-4">
      <div className="relative w-full md:max-w-2xl lg:max-w-3xl xl:max-w-5xl">
        <div className="absolute inset-0 hidden -skew-y-6 bg-gradient-to-r from-purple-400 to-orange-500 shadow-lg sm:block sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl" />
        <div className="relative w-full overflow-hidden bg-white sm:rounded-3xl sm:shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
