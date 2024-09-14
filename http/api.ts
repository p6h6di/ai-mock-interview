import { InterviewProps } from "@/validator/interview.schema";
import { api } from "./client";
import { InterviewFeedbackProps } from "@/app/interviews/[interviewId]/start/page";

export const createInterview = async (data: InterviewProps) => {
  const response = await api.post("/interviews", data);
  return response.data;
};

export const getAllInterviews = async () => {
  const response = await api.get("/interviews");
  return await response.data;
};

export const getSingleInterview = async (id: string) => {
  const response = await api.get(`/interviews/${id}`);
  return await response.data;
};

export const createInterviewFeedback = async (
  data: InterviewFeedbackProps,
  interviewId: string
) => {
  const response = await api.post(`/interviews/${interviewId}/feedback`, data);
  return response.data;
};
