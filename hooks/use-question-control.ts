import React, { useState, useRef, useCallback } from "react";

const useQuestionControl = (
  questions: { id: string; content: string }[],
  selectedIndex: number,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthesisRef = useRef(window.speechSynthesis);

  const startSpeaking = useCallback((text: string) => {
    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesisRef.current.speak(utterance);
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
  }, []);

  const stopSpeaking = useCallback(() => {
    speechSynthesisRef.current.cancel();
    setIsSpeaking(false);
  }, []);

  const toggleSpeaking = useCallback(() => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      startSpeaking(questions[selectedIndex].content);
    }
  }, [isSpeaking, questions, selectedIndex, startSpeaking, stopSpeaking]);

  const nextQuestion = useCallback(() => {
    stopSpeaking();
    setSelectedIndex((prev) => (prev + 1) % questions.length);
  }, [questions.length, setSelectedIndex, stopSpeaking]);

  const prevQuestion = useCallback(() => {
    stopSpeaking();
    setSelectedIndex(
      (prev) => (prev - 1 + questions.length) % questions.length
    );
  }, [questions.length, setSelectedIndex, stopSpeaking]);

  return {
    isSpeaking,
    toggleSpeaking,
    nextQuestion,
    prevQuestion,
  };
};

export default useQuestionControl;
