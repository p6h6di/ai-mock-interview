"use client";

import React from "react";
import Header from "./Header";
import RecentInterviews from "./RecentInterview";
import { getAllInterviews } from "@/http/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Spinner } from "@/components/Spinner";
import NoInterviewsMessage from "./NoInterviewsMessage";
import InterviewCard from "./InterviewCard";
import { Interview } from "@prisma/client";
import { motion } from "framer-motion";

const InterviewDashboard = () => {
  const {
    data: interviews,
    error,
    isLoading: isPending,
  } = useQuery<Interview[]>({
    queryKey: ["interviews"],
    queryFn: getAllInterviews,
  });

  if (error) {
    toast.error("Unable to load interviews", {
      description:
        "We're experiencing technical difficulties. Please try again later.",
    });
  }

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center sm:h-[80vh]">
        <Spinner className="size-6 text-orange-500 sm:size-8" />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto scrollbar-hide sm:h-[80vh]">
      <div className="p-6 sm:p-12">
        <div className="container mx-auto p-4">
          <Header />
          {(!interviews || interviews.length !== 0) && <RecentInterviews />}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {interviews?.map((interview) => (
              <InterviewCard key={interview.id} interview={interview} />
            ))}
          </motion.div>
          {(!interviews || interviews.length === 0) && <NoInterviewsMessage />}
        </div>
      </div>
    </div>
  );
};

export default InterviewDashboard;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};
