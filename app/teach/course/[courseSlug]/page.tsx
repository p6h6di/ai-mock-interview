import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { getCourseBySlug } from "@/lib/courses";
import Link from "next/link";
import React from "react";
import CoursePublishForm from "./_components/CoursePublishForm";
import Lessons from "./_components/Lessons";

const CourseDetailsPage = async ({
  params,
}: {
  params: { courseSlug: string };
}) => {
  const { courseSlug } = params;
  const course = await getCourseBySlug(courseSlug, true);

  if (!course) {
    return (
      <section className="p-24 text-black">
        <div className="container">
          <h1 className="text-3xl font-bold">Course not found</h1>
          <p className="text-muted-foreground">
            The course you are looking for does not exist.
          </p>

          <div className="mt-8">
            <Link
              href="/interviews"
              className="text-sm text-blue-500 underline underline-offset-1"
            >
              Back to courses
            </Link>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="p-12 text-black">
      <div>
        <BackButton
          href="/interviews"
          text="Back"
          className="hidden md:inline-flex"
        />
      </div>

      <div className="mt-4 flex flex-col gap-x-10 gap-y-10 lg:flex-row">
        <div className="flex-1">
          <div className="flex items-center gap-x-3">
            <h3 className="text-xl font-semibold">{course.name}</h3>
            <Badge variant={course.isPublished ? "default" : "secondary"}>
              {course.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
          <p className="text-xs font-light text-muted-foreground">
            By <span>{course.teacher.name}</span>
          </p>

          <div className="mt-4 text-sm text-muted-foreground">
            {course.description}
          </div>

          <div className="mt-6 flex items-center justify-between gap-2">
            <span className="-mt-1.5 font-playfair text-xl">FREE</span>

            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-xs font-light text-muted-foreground">
                Category
              </span>
              <Badge variant="secondary">{course.tag?.name}</Badge>
            </div>
          </div>

          <CoursePublishForm course={course} />
        </div>

        <div className="flex-1">
          <Lessons course={course} />
        </div>
      </div>
    </section>
  );
};

export default CourseDetailsPage;
