// "use client";

import React from "react";
import NewCourseForm from "./_components/NewCourseForm";
import { getTags } from "@/lib/courses";

const TeachPage = async () => {
  //   const router = useRouter();
  const tags = await getTags();
  return (
    <div className="p-8 text-black">
      {/* <div className="flex items-center space-x-6">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="hover:bg-white"
        >
          <Icons.right_arrow className="size-8" />
        </Button>
        <h1 className="font-playfair text-2xl font-bold tracking-wide text-black antialiased sm:text-3xl">
          Create course
        </h1>
      </div> */}

      <NewCourseForm tags={tags} />
    </div>
  );
};

export default TeachPage;
