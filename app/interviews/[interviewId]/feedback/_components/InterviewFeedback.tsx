"use client";

import React, { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { getSingleInterview } from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import Header from "./Header";
import QuestionList from "./QuestionList";

export interface Feedback {
  id: string;
  content: string;
  answer: string;
  rating: number;
}

export interface Question {
  id: string;
  content: string;
  answers: { id: string; content: string }[];
  feedbacks?: Feedback[];
}

export interface Interview {
  id: string;
  questions: Question[];
}

const InterviewFeedback = ({ interviewId }: { interviewId: string }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const {
    data: interview,
    error,
    isLoading,
  } = useQuery<Interview, Error>({
    queryKey: ["interview-feedback", interviewId],
    queryFn: () => getSingleInterview(interviewId),
  });

  const toggleAccordion = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (error) {
    toast.error("Unable to load feedback", {
      description:
        "We're experiencing technical difficulties. Please try again later.",
    });
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center sm:h-[80vh]">
        <Spinner className="size-6 text-orange-500 sm:size-8" />
      </div>
    );
  }

  if (!interview) {
    return redirect("/interviews");
  }

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide sm:h-[80vh]">
      <div className="p-6 sm:p-12">
        <div className="container mx-auto p-4">
          <Header interview={interview} />
          <QuestionList
            questions={interview.questions}
            expandedIndex={expandedIndex}
            toggleAccordion={toggleAccordion}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewFeedback;
