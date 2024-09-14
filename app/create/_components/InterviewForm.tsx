"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { InterviewProps, InterviewSchema } from "@/validator/interview.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonHandler from "./ButtonHandler";
import FormStep from "./FormStep";
import { createInterview } from "@/http/api";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner";

const InterviewForm = () => {
  const [step, setStep] = useState<number>(1);
  const [direction, setDirection] = useState<number>(0);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<InterviewProps>({
    resolver: zodResolver(InterviewSchema),
    mode: "onChange",
  });

  const watchFields = {
    jobRole: watch("jobRole"),
    jobDescription: watch("jobDescription"),
    experience: watch("experience"),
    questionRange: watch("questionRange"),
  };

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-interview"],
    mutationFn: (data: InterviewProps) => createInterview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interviews"] });
      toast.success("Your interview questions are ready to go!");
      router.refresh();
      router.push("/interviews");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to create the interview, try again later.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (values: InterviewProps) => {
    mutate(values);
  };

  const nextStep = () => {
    if (step < 4) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!(watchFields.jobRole && watchFields.jobRole.trim() !== "");
      case 2:
        return !!(
          watchFields.jobDescription && watchFields.jobDescription.trim() !== ""
        );
      case 3:
        return watchFields.experience !== undefined && !errors.experience;
      case 4:
        return watchFields.questionRange !== undefined && !errors.questionRange;
      default:
        return false;
    }
  };

  return (
    <div>
      <div className="relative py-3 sm:mx-auto sm:max-w-xl">
        <div className="absolute inset-0 -skew-y-6 bg-gradient-to-r from-purple-400 to-orange-500 shadow-lg sm:-rotate-6 sm:skew-y-0 sm:rounded-3xl" />
        <div className="relative bg-white px-4 py-10 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="mx-auto max-w-md">
            {isPending ? (
              <div className="flex flex-col items-center justify-center space-y-3 sm:h-60 sm:w-72">
                <Spinner className="size-6 text-orange-500" />
                <span className="text-xs font-medium text-gray-400">
                  Generating questions...
                </span>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="py-6 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7"
                >
                  <h1 className="mb-4 text-center font-playfair text-3xl font-bold leading-9 sm:mb-6">
                    Asking Questions To Improve Your AI Interview
                  </h1>
                  <FormStep
                    step={step}
                    direction={direction}
                    register={register}
                    errors={errors}
                  />
                  <ButtonHandler
                    step={step}
                    isStepValid={isStepValid()}
                    prevStep={prevStep}
                    nextStep={nextStep}
                  />
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewForm;
