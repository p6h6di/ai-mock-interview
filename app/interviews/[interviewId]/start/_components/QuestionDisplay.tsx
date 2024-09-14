"use client";

import React from "react";
import useQuestionControl from "@/hooks/use-question-control";
import useTranscription from "@/hooks/use-transcription";
import { motion } from "framer-motion";
import QuestionContent from "./QuestionContent";
import QuestionNavigation from "./QuestionNavigation";
import TranscriptionDisplay from "./TranscriptionDisplay";

interface Question {
  id: string;
  content: string;
}

interface QuestionDisplayProps {
  questions: Question[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}

const QuestionDisplay = ({
  questions,
  selectedIndex,
  setSelectedIndex,
}: QuestionDisplayProps) => {
  const { isSpeaking, toggleSpeaking, nextQuestion, prevQuestion } =
    useQuestionControl(questions, selectedIndex, setSelectedIndex);

  const { transcribedText, interimResult, isRecording } = useTranscription(
    questions[selectedIndex].id
  );

  return (
    <>
      <motion.div className="min-h-96 overflow-hidden rounded-md border sm:p-1">
        <div className="rounded-xl bg-white">
          <QuestionNavigation
            currentIndex={selectedIndex}
            totalQuestions={questions.length}
            onPrev={prevQuestion}
            onNext={nextQuestion}
          />
          <QuestionContent
            question={questions[selectedIndex].content}
            isSpeaking={isSpeaking}
            toggleSpeaking={toggleSpeaking}
          />
          <TranscriptionDisplay
            transcribedText={transcribedText}
            interimResult={interimResult}
            isRecording={isRecording}
          />
        </div>
      </motion.div>
    </>
  );
};

export default QuestionDisplay;
