"use client";

import React from "react";
import { Question } from "./InterviewFeedback";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import UserAnswer from "./UserAnswer";
import ExpectedAnswer from "./ExpectedAnswer";
import FeedbackContent from "./FeedbackContent";

const QuestionContent = ({ question }: { question: Question }) => {
  return (
    <motion.div
      initial="collapsed"
      animate="open"
      exit="collapsed"
      variants={{
        open: { opacity: 1, height: "auto" },
        collapsed: { opacity: 0, height: 0 },
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div
        className={cn(
          "p-4",
          question.feedbacks && question.feedbacks.length > 0 ? "" : "bg-accent"
        )}
      >
        {question.feedbacks && question.feedbacks.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={contentVariants}
          >
            <UserAnswer answer={question.feedbacks[0].answer} />
            {question.answers.map((answer, index) => (
              <ExpectedAnswer key={answer.id} answer={answer} index={index} />
            ))}
            {question.feedbacks.map((feedback, index) => (
              <FeedbackContent
                key={feedback.id}
                feedback={feedback}
                index={index + question.answers.length}
              />
            ))}
          </motion.div>
        ) : (
          <motion.p
            className="text-sm font-normal italic tracking-wide text-gray-500"
            variants={contentVariants}
          >
            No feedback available for this question.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default QuestionContent;

export const contentVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
