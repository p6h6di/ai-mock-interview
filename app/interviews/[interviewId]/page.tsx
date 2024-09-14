import React from "react";
import InterviewPreparation from "./_components/InterviewPreparation";

const InterviewIdPage = ({ params }: { params: { interviewId: string } }) => {
  return <InterviewPreparation interviewId={params.interviewId} />;
};

export default InterviewIdPage;
