"use client";

import React from "react";
import { Question } from "./InterviewFeedback";
import QuestionItem from "./QuestionItem";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionListProps {
  questions: Question[];
  expandedIndex: number | null;
  toggleAccordion: (index: number) => void;
}

const QuestionList = ({
  expandedIndex,
  questions,
  toggleAccordion,
}: QuestionListProps) => {
  // Trim whitespace from question content
  const trimmedQuestions = questions.map((question) => ({
    ...question,
    content: question.content.trim(),
  }));

  return (
    <motion.div
      className="mx-auto space-y-5 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence>
        {trimmedQuestions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <QuestionItem
              question={question}
              index={index}
              isExpanded={expandedIndex === index}
              toggleAccordion={toggleAccordion}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default QuestionList;
