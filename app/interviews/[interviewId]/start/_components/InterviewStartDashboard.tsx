"use client";

import { Icons } from "@/components/Icons";
import { Spinner } from "@/components/Spinner";
import { Button, buttonVariants } from "@/components/ui/button";
import { getSingleInterview } from "@/http/api";
import { Interview } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import QuestionDisplay from "./QuestionDisplay";
import WebcamControl from "./WebcamControl";
import MicrophoneControl from "./MicrophoneControl";
import useTranscription from "@/hooks/use-transcription";

interface Question {
  id: string;
  content: string;
}
interface InterviewWithQuestions extends Interview {
  questions: Question[];
}

const InterviewStartDashboard = ({ interviewId }: { interviewId: string }) => {
  const user = useSession();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const router = useRouter();

  const {
    data: interview,
    isError,
    isLoading,
  } = useQuery<InterviewWithQuestions>({
    queryKey: ["single-interview", interviewId],
    queryFn: () => getSingleInterview(interviewId),
  });

  const currentQuestionId = useMemo(() => {
    return interview?.questions[selectedIndex]?.id ?? null;
  }, [interview, selectedIndex]);

  const { isPending, isRecording, handleRecording } =
    useTranscription(currentQuestionId);

  useEffect(() => {
    if (isError) {
      toast.error("Unable to load interview", {
        description:
          "We're experiencing technical difficulties. Please try again later.",
      });
    }
  }, [isError]);

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
    <motion.div className="h-screen overflow-y-auto scroll-smooth scrollbar-hide sm:h-[80vh] sm:overflow-y-hidden">
      <div className="p-6 sm:p-12">
        <div className="container mx-auto p-4">
          <motion.div className="mb-12 flex items-center justify-between">
            <div className="flex items-center space-x-6 leading-none">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="icon"
                className="hover:bg-white"
              >
                <Icons.right_arrow className="size-8" />
              </Button>
              <h1 className="font-playfair text-3xl font-bold">
                Interview Questions
              </h1>
            </div>
            <Link
              href={`/interviews/${interview.id}/feedback`}
              className={buttonVariants({ variant: "outline" })}
            >
              Get Feedback
            </Link>
          </motion.div>

          <motion.div className="grid gap-x-10 gap-y-6 border sm:grid-cols-3">
            <div className="space-y-6 sm:col-span-2">
              <QuestionDisplay
                questions={interview.questions}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
              />
            </div>

            <WebcamControl userAvatar={user.data?.user?.image} />
          </motion.div>

          <MicrophoneControl
            handleRecording={handleRecording}
            isPending={isPending}
            isRecording={isRecording}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewStartDashboard;
