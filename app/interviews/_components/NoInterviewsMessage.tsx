"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Icons } from "@/components/Icons";

const NoInterviewsMessage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8 flex h-96  w-full flex-col items-center justify-center px-4 py-8"
    >
      <Icons.no_results className="size-28 text-gray-400" />
      <p className="mt-4 text-center text-sm font-medium text-gray-500 sm:text-base">
        No interviews created yet.{" "}
        <span>
          <Link
            href="/create"
            className="text-blue-500 underline-offset-4 transition duration-300 hover:underline"
          >
            Create one now!
          </Link>
        </span>
      </p>
    </motion.div>
  );
};

export default NoInterviewsMessage;
