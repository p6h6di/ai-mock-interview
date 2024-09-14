"use client";

import React from "react";
import { contentVariants } from "./QuestionContent";
import { motion } from "framer-motion";

const ExpectedAnswer = ({
  answer,
  index,
}: {
  answer: { content: string };
  index: number;
}) => {
  return (
    <motion.div
      className="mb-4 rounded-md bg-green-50 p-3"
      variants={contentVariants}
      transition={{ delay: index * 0.1 }}
    >
      <span className="font-semibold text-green-600">Correct Answer</span>
      <p className="mt-1 text-green-700">{answer.content}</p>
    </motion.div>
  );
};

export default ExpectedAnswer;
