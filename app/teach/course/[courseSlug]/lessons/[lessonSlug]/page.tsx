import BackButton from "@/components/BackButton";
import { getLessonBySlug } from "@/lib/courses";
import React from "react";
import LessonContentForm from "./_components/LessonContentForm";

const LessonPage = async ({
  params,
}: {
  params: { courseSlug: string; lessonSlug: string };
}) => {
  const { courseSlug, lessonSlug } = params;
  const lesson = await getLessonBySlug(courseSlug, lessonSlug);

  if (!lesson) {
    return (
      <div className="p-12 text-black">
        <h1 className="text-3xl font-bold">Lesson not found</h1>
        <p className="text-muted-foreground">
          The lesson you are looking for does not exist.
        </p>

        <div className="mt-8">
          <BackButton
            href={`/teach/course/${courseSlug}`}
            text="Back to course"
          />
        </div>
      </div>
    );
  }
  return (
    <section className="p-8 text-black">
      <BackButton
        href={`/teach/course/${courseSlug}`}
        text="Back"
        className="hidden md:inline-flex"
      />

      <div className="mt-4">
        <LessonContentForm lesson={lesson} />
      </div>
    </section>
  );
};

export default LessonPage;
