"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import useSpeechToText from "react-hook-speech-to-text";
import { createInterviewFeedback } from "@/http/api";

const useTranscription = (questionId: string | null) => {
  const [transcribedText, setTranscribedText] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);

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

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-interview-feedback", questionId],
    mutationFn: (data: { questionId: string; answer: string }) =>
      createInterviewFeedback(data, questionId!),
    onSuccess: () => {
      toast.success("Your answer is saved successfully!");
      setTranscribedText("");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to save the answer, try again later.";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (results.length > 0 && isTranscribing) {
      const latestResult = results[results.length - 1];
      const newTranscript =
        typeof latestResult === "string"
          ? latestResult
          : latestResult.transcript;
      setTranscribedText((prev) => `${prev} ${newTranscript}`.trim());
    }
  }, [results, isTranscribing]);

  const handleRecording = useCallback(() => {
    if (!questionId) {
      toast.error("No question selected");
      return;
    }

    if (isRecording) {
      stopSpeechToText();
      setIsTranscribing(false);
      if (transcribedText.trim()) {
        mutate({ questionId, answer: transcribedText.trim() });
      }
    } else {
      setTranscribedText("");
      setIsTranscribing(true);
      startSpeechToText();
    }
  }, [
    isRecording,
    stopSpeechToText,
    transcribedText,
    questionId,
    mutate,
    startSpeechToText,
  ]);

  return {
    transcribedText,
    interimResult,
    isRecording,
    isPending,
    handleRecording,
  };
};

export default useTranscription;
