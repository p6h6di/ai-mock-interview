"use client";

import React from "react";
import { motion } from "framer-motion";
import { contentVariants } from "./QuestionContent";

const UserAnswer = ({ answer }: { answer: string }) => {
  return (
    <motion.div
      className="mb-4 rounded-md bg-sky-50 p-3"
      variants={contentVariants}
    >
      <span className="font-semibold text-sky-600">Your Response</span>
      <p className="mt-1 text-sky-700">{answer}</p>
    </motion.div>
  );
};

export default UserAnswer;
