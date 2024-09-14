"use client";

import React, { useRef, useEffect } from "react";

interface TranscriptionDisplayProps {
  transcribedText: string;
  interimResult: string | undefined;
  isRecording: boolean;
}

const TranscriptionDisplay = ({
  transcribedText,
  interimResult,
  isRecording,
}: TranscriptionDisplayProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcribedText, interimResult]);

  return (
    <div className="relative h-full">
      <div
        ref={scrollRef}
        className="h-[calc(100%-64px)] overflow-y-auto scroll-smooth rounded-md border py-4"
      >
        <div className="px-4">
          <p className="mb-3 text-muted-foreground">{transcribedText}</p>
          {isRecording && interimResult && (
            <div>
              <h3 className="mb-2 text-xs font-medium italic">
                Recording your voice...
              </h3>
              <p className="italic text-muted-foreground">{interimResult}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptionDisplay;
