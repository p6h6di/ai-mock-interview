"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/Spinner";
import { createInterviewFeedback, getSingleInterview } from "@/http/api";
import { Interview } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "next-auth/react";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Icons, MicOffIcon, MicOnIcon, SpeakerIcon } from "@/components/Icons";
import useSpeechToText from "react-hook-speech-to-text";
import { redirect, useRouter } from "next/navigation";
import Webcam from "react-webcam";

interface Question {
  id: string;
  content: string;
}

interface InterviewWithQuestions extends Interview {
  questions: Question[];
}

export interface InterviewFeedbackProps {
  questionId: string;
  answer: string;
}

const InterviewStartPage = ({
  params,
}: {
  params: { interviewId: string };
}) => {
  const user = useSession();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [transcribedText, setTranscribedText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const router = useRouter();
  const speechSynthesisRef = useRef(window.speechSynthesis);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const webcamRef = useRef(null);

  const toggleWebcam = () => {
    setIsWebcamEnabled(!isWebcamEnabled);
  };

  const {
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const {
    data: interview,
    isError,
    isLoading,
  } = useQuery<InterviewWithQuestions>({
    queryKey: ["single-interview", params.interviewId],
    queryFn: () => getSingleInterview(params.interviewId),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-interview-feedback", params.interviewId],
    mutationFn: (data: InterviewFeedbackProps) =>
      createInterviewFeedback(data, params.interviewId),
    onSuccess: () => {
      toast.success("Your answer is saved successfully!");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save the answer, try again later.";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error("Unable to load interview", {
        description:
          "We're experiencing technical difficulties. Please try again later.",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (results.length > 0) {
      const latestResult = results[results.length - 1];
      const newTranscript =
        typeof latestResult === "string"
          ? latestResult
          : latestResult.transcript;
      setTranscribedText((prev) => `${prev} ${newTranscript}`.trim());
    }
  }, [results]);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const handleRecording = () => {
    if (isRecording) {
      stopSpeechToText();
      if (interview && interview.questions[selectedIndex]) {
        const data: InterviewFeedbackProps = {
          questionId: interview.questions[selectedIndex].id,
          answer: transcribedText,
        };
        mutate(data);
      }
    } else {
      setTranscribedText("");
      startSpeechToText();
    }
  };

  const startSpeaking = (text: string) => {
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesisRef.current.speak(utterance);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
  };

  const stopSpeaking = () => {
    speechSynthesisRef.current.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcribedText, interimResult]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

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

  const nextQuestion = () => {
    stopSpeaking();
    setSelectedIndex((prev) => (prev + 1) % interview.questions.length);
    setTranscribedText("");
  };

  const prevQuestion = () => {
    stopSpeaking();
    setSelectedIndex(
      (prev) =>
        (prev - 1 + interview.questions.length) % interview.questions.length
    );
    setTranscribedText("");
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      startSpeaking(interview.questions[selectedIndex].content);
    }
  };

  return (
    <motion.div
      className="z-50 h-screen overflow-y-auto scroll-smooth scrollbar-hide sm:h-[80vh]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="p-6 sm:p-12">
        <div className="container mx-auto p-4">
          <motion.div
            className="mb-12 flex flex-col items-center justify-between sm:flex-row"
            variants={itemVariants}
          >
            <div className="flex  items-center space-x-6 ">
              <Button
                onClick={() => router.back()}
                variant="ghost"
                size="icon"
                className="hover:bg-white"
              >
                <Icons.right_arrow className="size-8" />
              </Button>
              <h1 className="font-playfair text-2xl font-bold tracking-wide text-black antialiased sm:text-3xl">
                Interview Questions
              </h1>
            </div>
            <Link
              href={`/interviews/${interview.id}/feedback`}
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "text-black border border-gray-300",
              })}
            >
              Get Feedback
            </Link>
          </motion.div>
          <motion.div
            className="grid gap-12 sm:grid-cols-3"
            variants={itemVariants}
          >
            <div className="space-y-6 sm:col-span-2">
              {interview.questions && interview.questions.length > 0 ? (
                <motion.div
                  className="max-h-96 overflow-hidden rounded-md sm:p-1"
                  variants={itemVariants}
                >
                  <div className="rounded-xl bg-white ">
                    <div className="mb-6 flex items-center justify-between">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={prevQuestion}
                        className="rounded-full bg-accent p-2"
                      >
                        <Icons.arrow_left className="size-6 text-gray-500" />
                      </motion.button>
                      <span className="font-playfair text-xl font-bold text-black">
                        Question {selectedIndex + 1} of{" "}
                        {interview.questions.length}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={nextQuestion}
                        className="rounded-full bg-accent p-2"
                      >
                        <Icons.arrow_right className="size-6 text-gray-500" />
                      </motion.button>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <button onClick={toggleSpeaking} className="mb-1 mt-3">
                          <SpeakerIcon isSpeaking={isSpeaking} />
                        </button>
                        <h2 className="my-4 text-xl font-semibold text-gray-800 sm:text-xl">
                          {interview.questions[selectedIndex].content}
                        </h2>
                        <div
                          ref={scrollRef}
                          className="h-72 overflow-y-auto scroll-smooth rounded-md scrollbar-hide"
                        >
                          {transcribedText && (
                            <>
                              <h1 className="mb-1 text-xs font-medium text-black/70">
                                Recorded Answer:
                              </h1>
                              <p className="text-muted-foreground">
                                {transcribedText}
                              </p>
                            </>
                          )}
                          {isRecording && interimResult && (
                            <div className="my-2 rounded-lg border p-3">
                              <h3 className="mb-1 text-xs font-medium italic text-black/70">
                                Recording your voice...
                              </h3>
                              <p className="italic text-muted-foreground">
                                {interimResult}
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <p className="text-center text-sm italic text-gray-500">
                  No questions available for this interview.
                </p>
              )}
            </div>
            <motion.div
              className="flex flex-col space-y-6"
              variants={itemVariants}
            >
              <div className="size-full min-h-80 rounded-lg border border-gray-50 bg-gray-200 sm:min-h-0">
                <div className="flex h-full items-center justify-center">
                  {isWebcamEnabled ? (
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="rounded-md"
                    />
                  ) : (
                    <UserAvatar
                      avatar={user.data?.user?.image}
                      sizes="size-24"
                    />
                  )}
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-black"
                  onClick={toggleWebcam}
                >
                  {isWebcamEnabled ? "Disable Webcam" : "Enable Webcam"}
                </Button>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="my-12 flex flex-col items-center justify-center space-y-2"
            variants={itemVariants}
          >
            <motion.button
              className="rounded-full border p-4"
              onClick={handleRecording}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1 }}
            >
              <AnimatePresence mode="wait">
                {isPending ? (
                  <motion.div
                    key="spinner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="disabled:bg-gray-100"
                  >
                    <Spinner className="size-5 text-gray-500" />
                  </motion.div>
                ) : isRecording ? (
                  <motion.div
                    key="mic-on"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <MicOnIcon className="size-8" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="mic-off"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <MicOffIcon className="size-8" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default InterviewStartPage;
