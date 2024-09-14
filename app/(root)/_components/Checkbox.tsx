"use client";

import React from "react";
import { motion } from "framer-motion";

const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <motion.div
      className="relative size-5 cursor-pointer rounded border border-gray-300"
      onClick={onChange}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{
          backgroundColor: checked ? "rgb(000 000 000)" : "rgb(255, 255, 255)",
        }}
        className="absolute inset-0 rounded"
      />
      <motion.svg
        viewBox="0 0 24 24"
        className="absolute inset-0 size-full p-0.5 text-white sm:p-1"
        initial={false}
        animate={{
          opacity: checked ? 1 : 0,
          scale: checked ? 1 : 0.5,
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.path
          d="M4 12.6l5 5L20 6"
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: checked ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </motion.svg>
    </motion.div>
  );
};

export default Checkbox;
