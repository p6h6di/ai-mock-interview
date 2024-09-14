"use client";

import React from "react";
import { motion } from "framer-motion";
import { Icons } from "@/components/Icons";

interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
}

const QuestionNavigation = ({
  currentIndex,
  totalQuestions,
  onPrev,
  onNext,
}: QuestionNavigationProps) => {
  return (
    <div className="sticky inset-0 mb-6 flex w-full items-center justify-between">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onPrev}
        className="rounded-full bg-accent p-2"
      >
        <Icons.arrow_left className="size-6 text-gray-500" />
      </motion.button>
      <span className="font-playfair text-xl font-bold">
        Question {currentIndex + 1} of {totalQuestions}
      </span>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onNext}
        className="rounded-full bg-accent p-2"
      >
        <Icons.arrow_right className="size-6 text-gray-500" />
      </motion.button>
    </div>
  );
};

export default QuestionNavigation;
