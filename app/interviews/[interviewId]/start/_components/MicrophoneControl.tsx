"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/Spinner";
import { MicOnIcon } from "@/components/Icons";
import { MicOffIcon } from "lucide-react";

interface MicrophoneControlProps {
  isRecording: boolean;
  isPending: boolean;
  handleRecording: () => void;
}

const MicrophoneControl = ({
  handleRecording,
  isPending,
  isRecording,
}: MicrophoneControlProps) => {
  return (
    <motion.div className="my-12 flex flex-col items-center justify-center space-y-2">
      <motion.button
        className="rounded-full border p-4"
        onClick={handleRecording}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 1 }}
        disabled={isPending}
      >
        <AnimatePresence mode="wait">
          {isPending ? (
            // <div className="disabled:bg-gray-100">
            <Spinner className="size-5 text-gray-500" />
          ) : // </div>
          isRecording ? (
            <motion.div
              key="mic-on"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MicOnIcon className="size-8" />
            </motion.div>
          ) : (
            <motion.div
              key="mic-off"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MicOffIcon className="size-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
};

export default MicrophoneControl;
