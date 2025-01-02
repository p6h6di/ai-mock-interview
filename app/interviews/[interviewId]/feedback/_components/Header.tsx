"use client";

import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Icons } from "@/components/Icons";
import { Interview } from "./InterviewFeedback";
import { calculateOverallRating } from "./FeedbackRating";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Header = ({ interview }: { interview: Interview }) => {
  const router = useRouter();
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest * 10) / 10);
  const overallRating = calculateOverallRating(interview);

  React.useEffect(() => {
    const animation = animate(count, parseFloat(overallRating), {
      duration: 2,
    });
    return animation.stop;
  }, [count, overallRating]);

  return (
    <div className="mb-12 flex flex-col items-center justify-between sm:mx-4 sm:flex-row">
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
          Interview Feedback
        </h1>
      </div>
      <div className="inline-flex items-center space-x-2.5 rounded-lg border border-gray-200 px-4 py-2 leading-none">
        <Icons.star className="relative size-5 shrink-0 text-black" />
        <div className="flex items-baseline">
          <div className="relative w-8 text-center">
            <span className="invisible text-black">{overallRating}</span>
            <motion.span className="absolute -inset-1 text-base font-medium text-black">
              {rounded}
            </motion.span>
          </div>
          <span className="text-base font-medium text-black">/ 10</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
