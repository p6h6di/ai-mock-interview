"use client";

import React from "react";
import { Question } from "./InterviewFeedback";
import { getAverageRating } from "./FeedbackRating";
import { motion, AnimatePresence } from "framer-motion";
import QuestionContent from "./QuestionContent";

interface QuestionItemProps {
  question: Question;
  index: number;
  isExpanded: boolean;
  toggleAccordion: (index: number) => void;
}

const QuestionItem = ({
  index,
  isExpanded,
  question,
  toggleAccordion,
}: QuestionItemProps) => {
  const avgRating = getAverageRating(question.feedbacks);

  const buttonVariants = {
    hover: { scale: 1.02 },
  };
  return (
    <motion.div
      className="overflow-hidden rounded-lg border border-gray-50 shadow"
      initial={false}
      whileHover="hover"
      variants={buttonVariants}
      transition={{ type: "spring", stiffness: 200, damping: 17 }}
    >
      <motion.button
        className="flex w-full items-center gap-5 bg-white p-4"
        onClick={() => toggleAccordion(index)}
      >
        <>
          {avgRating && (
            <div className="flex items-center justify-center rounded-full border border-gray-50 bg-gray-100 p-3">
              <span className="text-sm text-gray-500 ">{avgRating}</span>
            </div>
          )}
        </>
        <div>
          <motion.h2
            className="text-left text-lg font-medium leading-7"
            initial={false}
            animate={{ color: isExpanded ? "#4a5568" : "#1a202c" }}
            transition={{ duration: 0.2 }}
          >
            {question.content}
          </motion.h2>
        </div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isExpanded && <QuestionContent question={question} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionItem;
