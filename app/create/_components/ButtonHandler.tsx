"use client";

import React from "react";
import { motion } from "framer-motion";
import { Icons } from "@/components/Icons";

interface ButtonHandlerProps {
  step: number;
  isStepValid: boolean;
  prevStep: () => void;
  nextStep: () => void;
}

const ButtonHandler = ({
  isStepValid,
  nextStep,
  prevStep,
  step,
}: ButtonHandlerProps) => {
  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };
  return (
    <div className="flex justify-end">
      {step > 1 && (
        <motion.button
          type="button"
          onClick={prevStep}
          className="mr-4 flex size-12 items-center justify-center rounded-full bg-purple-500"
          whileHover="hover"
          whileTap="tap"
          variants={buttonVariants}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Icons.arrow_left className="size-5 text-white" />
        </motion.button>
      )}
      {step < 4 ? (
        <motion.button
          type="button"
          onClick={nextStep}
          disabled={!isStepValid}
          className={`flex size-12 items-center justify-center rounded-full ${
            isStepValid
              ? "bg-orange-500"
              : "cursor-not-allowed bg-orange-500/50"
          }`}
          whileHover={isStepValid ? "hover" : {}}
          whileTap={isStepValid ? "tap" : {}}
          variants={buttonVariants}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Icons.arrow_right className="size-5 text-white" />
        </motion.button>
      ) : (
        <motion.button
          type="submit"
          disabled={!isStepValid}
          className={`flex size-12 items-center justify-center rounded-full ${
            isStepValid
              ? "bg-orange-500"
              : "cursor-not-allowed bg-orange-500/50"
          }`}
          whileHover={isStepValid ? "hover" : {}}
          whileTap={isStepValid ? "tap" : {}}
          variants={buttonVariants}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Icons.arrow_right className="size-5 text-white" />
        </motion.button>
      )}
    </div>
  );
};

export default ButtonHandler;
