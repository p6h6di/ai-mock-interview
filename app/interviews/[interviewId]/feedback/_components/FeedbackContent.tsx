"use client";

import React from "react";
import { contentVariants } from "./QuestionContent";
import { motion } from "framer-motion";
import { Feedback } from "./InterviewFeedback";

const FeedbackContent = ({
  feedback,
  index,
}: {
  feedback: Feedback;
  index: number;
}) => {
  return (
    <motion.div
      className="mb-4 rounded-md bg-yellow-50 p-3"
      variants={contentVariants}
      transition={{ delay: index * 0.1 }}
    >
      <span className="font-semibold text-yellow-600">Feedback</span>
      <p className="mb-2 mt-1 text-yellow-700">{feedback.content}</p>
    </motion.div>
  );
};

export default FeedbackContent;
