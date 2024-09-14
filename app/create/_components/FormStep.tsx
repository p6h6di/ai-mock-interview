"use client";

import { InterviewProps } from "@/validator/interview.schema";
import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import FormInput from "./FormInput";
import { motion, AnimatePresence } from "framer-motion";

interface FormStepProps {
  step: number;
  direction: number;
  register: UseFormRegister<InterviewProps>;
  errors: FieldErrors<InterviewProps>;
}

const FormStep = ({ direction, errors, register, step }: FormStepProps) => {
  const renderStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return (
          <FormInput
            id="jobRole"
            label="What is your current job role?"
            register={register}
            errors={errors.jobRole}
          />
        );
      case 2:
        return (
          <FormInput
            id="jobDescription"
            label="Describe the main responsibilities of your role."
            register={register}
            errors={errors.jobDescription}
          />
        );
      case 3:
        return (
          <FormInput
            id="experience"
            label="What's your experience level in this current role?"
            type="number"
            register={register}
            errors={errors.experience}
          />
        );
      case 4:
        return (
          <FormInput
            id="questionRange"
            label="How many questions would you like to receive?"
            type="number"
            register={register}
            errors={errors.questionRange}
          />
        );
      default:
        return null;
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  return (
    <div className="relative h-28 overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={step}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: "tween",
            ease: "easeInOut",
            duration: 0.3,
          }}
          className="absolute w-full"
        >
          {renderStep(step)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FormStep;
