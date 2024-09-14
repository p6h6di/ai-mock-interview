import React from "react";
import InterviewFeedback from "./_components/InterviewFeedback";

const FeedbackPage = ({ params }: { params: { interviewId: string } }) => {
  return <InterviewFeedback interviewId={params.interviewId} />;
};

export default FeedbackPage;
