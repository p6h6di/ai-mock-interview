"use client";

import { Feedback, Interview } from "./InterviewFeedback";

export const calculateOverallRating = (interview: Interview): string => {
  let totalRating = 0;
  let ratingCount = 0;
  interview.questions.forEach((question) => {
    if (question.feedbacks && question.feedbacks.length > 0) {
      question.feedbacks.forEach((feedback) => {
        totalRating += feedback.rating;
        ratingCount++;
      });
    }
  });
  return ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : "0";
};

export const getAverageRating = (
  feedbacks: Feedback[] | undefined
): string | null => {
  if (!feedbacks || feedbacks.length === 0) return null;
  const sum = feedbacks.reduce((acc, feedback) => acc + feedback.rating, 0);
  return (sum / feedbacks.length).toFixed(1);
};
