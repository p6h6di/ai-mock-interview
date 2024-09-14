"use client";

import React from "react";
import { motion } from "framer-motion";
import { SpeakerIcon } from "@/components/Icons";

interface QuestionContentProps {
  question: string;
  isSpeaking: boolean;
  toggleSpeaking: () => void;
}

const QuestionContent = ({
  isSpeaking,
  question,
  toggleSpeaking,
}: QuestionContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      // className="sticky inset-0 bg-white"
    >
      <button onClick={toggleSpeaking} className="mb-1 mt-3">
        <SpeakerIcon isSpeaking={isSpeaking} />
      </button>
      <h2 className="my-4 text-xl font-semibold text-gray-800 sm:text-xl">
        {question}
      </h2>
    </motion.div>
  );
};

export default QuestionContent;
