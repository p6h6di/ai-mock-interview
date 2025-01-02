"use client";

import React from "react";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { formatTimeToNow } from "@/lib/utils";
import Link from "next/link";
import { Interview } from "@prisma/client";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

const buttonAnimation = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.96,
  },
};

interface InterviewCardProps {
  interview: Interview;
}

const InterviewCard: React.FC<InterviewCardProps> = ({ interview }) => {
  return (
    <motion.div
      variants={cardVariants}
      layout
      className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-2 leading-none">
        <h3 className="line-clamp-1 font-playfair text-2xl font-bold text-gray-800">
          {interview.jobRole}
        </h3>
        <p className="inline text-xs font-medium lowercase text-gray-400 antialiased">
          {formatTimeToNow(interview.createdAt)}
        </p>
      </div>
      <p className="mb-4 line-clamp-2 grow text-sm text-muted-foreground">
        {interview.jobDescription}
      </p>
      <div className="mt-auto flex flex-col items-center space-y-2.5 sm:flex-row sm:space-x-3 sm:space-y-0">
        <motion.div
          variants={buttonAnimation}
          whileHover="hover"
          whileTap="tap"
          className="w-full"
        >
          <Link
            href={`/interviews/${interview.id}/feedback`}
            className={buttonVariants({
              variant: "outline",
              className: "w-full border border-gray-300 text-black/80",
            })}
          >
            Feedback
          </Link>
        </motion.div>
        <motion.div
          variants={buttonAnimation}
          whileHover="hover"
          whileTap="tap"
          className="w-full"
        >
          <Link
            href={`/interviews/${interview.id}`}
            className="inline-flex h-9 w-full touch-none select-none items-center justify-center rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors duration-300 hover:bg-blue-500/80"
          >
            Interview
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default InterviewCard;
