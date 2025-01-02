"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Clock, Copy, Mic, Video } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Icons } from "@/components/Icons";

const InterviewPreparation = ({ interviewId }: { interviewId: string }) => {
  const [, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(interviewId);
    setIsCopied(true);
    toast.success("Interview ID copied to clipboard!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.1,
        ease: "easeOut",
        duration: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.4,
      },
    },
  };
  return (
    <motion.div
      className="h-screen overflow-y-auto scrollbar-hide sm:h-[80vh]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="p-4 sm:p-6 md:p-8 lg:p-12">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="mb-6 space-y-2 text-center sm:mb-8"
            variants={itemVariants}
          >
            <h1 className="font-playfair text-3xl font-bold tracking-normal text-black sm:text-4xl md:text-5xl">
              AI Mock Interview
            </h1>
            <p className="text-sm font-normal text-gray-600 sm:text-base md:text-lg">
              Prepare for your next job interview with our AI-powered mock
              interview system
            </p>
          </motion.div>

          <motion.div
            className="mb-4 flex flex-wrap items-center justify-center gap-2 sm:mb-6 sm:gap-3"
            variants={itemVariants}
          >
            {[
              { icon: Clock, text: "30 minutes" },
              { icon: Mic, text: "Audio required" },
              { icon: Video, text: "Video optional" },
            ].map(({ icon: Icon, text }, index) => (
              <motion.div
                key={text}
                variants={itemVariants}
                custom={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  variant="secondary"
                  className="flex items-center rounded-full px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm"
                >
                  <Icon className="mr-1 size-3 sm:mr-1.5 sm:size-4" />
                  {text}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mb-6 space-y-2 text-center sm:mb-8"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Badge
                variant="secondary"
                className="cursor-pointer px-2 py-1 text-sm font-medium sm:px-3 sm:py-1.5 sm:text-base"
                onClick={copyToClipboard}
              >
                {interviewId}
                <Copy className="ml-1.5 size-3 sm:ml-2 sm:size-4" />
              </Badge>
            </motion.div>
            <p className="text-xs font-normal text-gray-500 antialiased sm:text-sm">
              This unique ID will be used to track your interview session
            </p>
          </motion.div>

          <motion.div
            className="mx-auto w-full space-y-2 rounded-md border border-gray-100 bg-white p-3 shadow-sm sm:w-11/12 sm:space-y-2.5 sm:p-4 md:w-4/5"
            variants={itemVariants}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p className="text-sm font-semibold text-gray-700 sm:text-base">
              Before you begin your mock interview, take a moment to prepare:
            </p>
            <ul className="flex flex-col items-start space-y-1.5 text-xs text-gray-600 sm:space-y-2 sm:text-sm">
              {[
                "Find a quiet space where you won't be interrupted.",
                "If your interview involves video or audio, double-check that your microphone and camera are working perfectly.",
                "Take a few deep breaths to relax and clear your mind.",
                "Ensure you have a stable and reliable internet connection for a smooth experience.",
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                >
                  <span className="mr-2 text-green-500">•</span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="mt-6 flex items-center justify-center sm:mt-8"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href={`/interviews/${interviewId}/start`}
                className="inline-flex h-12 w-full touch-none select-none items-center justify-center rounded-md bg-blue-500 px-6 py-3 text-base text-white transition-colors duration-300 hover:bg-blue-500/80"
              >
                <Icons.play className="mr-1.5 size-4 text-white sm:mr-2 sm:size-5" />
                Start Interview
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewPreparation;
