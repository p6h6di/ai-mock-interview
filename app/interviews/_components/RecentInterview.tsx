"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Icons } from "@/components/Icons";

const RecentInterviews = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 mt-8 flex items-center justify-between border-gray-100"
    >
      <h2 className="font-playfair text-lg font-bold text-gray-800 sm:text-xl">
        Your recent interviews
      </h2>
      <Link
        href="/create"
        className="group flex items-center space-x-2 text-blue-600 transition-colors duration-300 hover:text-blue-600/70"
      >
        <Icons.add_circle className="size-5 text-blue-600 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-blue-600/70" />
        <span className="text-base text-blue-600 transition-all duration-300 group-hover:translate-x-1">
          create
        </span>
      </Link>
    </motion.div>
  );
};

export default RecentInterviews;
