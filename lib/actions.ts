"use server";

import { NewCourseSchema, NewLessonSchema } from "@/validator/course.schema";
import { prisma } from "./prisma";
import { z } from "zod";
import { auth } from "./auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Course } from "@prisma/client";
import Mux from "@mux/mux-node";
import { v4 as uuid } from "uuid";

type NewCourseActionInputs = z.infer<typeof NewCourseSchema>;
type NewLessonActionInputs = z.infer<typeof NewLessonSchema>;

const mux = new Mux();

export async function createNewCourseAction(data: NewCourseActionInputs) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { message: "Oops! You need to log in to access this feature." },
      { status: 400 }
    );
  }

  const result = NewCourseSchema.safeParse(data);
  if (result.error) {
    return { error: "Form validation error." };
  }

  let course;

  try {
    course = await prisma.course.create({
      data: {
        ...result.data,
        teacherId: session.user.id,
      },
    });

    revalidatePath(`/teach/courses`);
  } catch (error: any) {
    if (error.meta?.modelName === "Course" && error.code === "P2002") {
      return {
        error: "A course with that slug already exists.",
      };
    }
  }

  if (!course) {
    return { error: "Failed to create the course." };
  }

  redirect(`/teach/course/${course.slug}`);
}

export async function updateCourseAction(
  courseId: string,
  data: Partial<Course>
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { message: "Oops! You need to log in to access this feature." },
      { status: 400 }
    );
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      teacherId: session.user.id,
    },
  });

  if (!course) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.course.update({
      where: { id: courseId },
      data,
    });

    revalidatePath(`/learn/courses`);
    revalidatePath(`/course/${course.slug}`);
    revalidatePath(`/teach/course/${course.slug}`);
  } catch {
    return { error: "Failed to update the course." };
  }
}

export async function deleteCourseAction(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { message: "Oops! You need to log in to access this feature." },
      { status: 400 }
    );
  }

  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
      teacherId: session.user.id,
    },
    include: {
      lessons: {
        include: {
          video: true,
        },
      },
      students: true,
    },
  });

  if (!course) {
    return { error: "Unauthorized" };
  }

  try {
    for (const lesson of course.lessons) {
      if (lesson.video?.assetId) {
        await mux.video.assets.delete(lesson.video.assetId);
      }
    }

    await prisma.course.delete({
      where: { id: courseId },
    });

    revalidate("/interviews");
    revalidatePath(`/teach/course`);
    revalidatePath(`/learn/course`);
  } catch {
    return { error: "Failed to delete the course." };
  }

  redirect("/teach");
}

export async function revalidate(path: string) {
  return revalidatePath(path);
}

export async function createNewLessonAction(
  data: NewLessonActionInputs,
  courseSlug: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { message: "Oops! You need to log in to access this feature." },
      { status: 400 }
    );
  }

  const course = await prisma.course.findUnique({
    where: {
      slug: courseSlug,
      teacherId: session.user.id,
    },
  });

  if (!course) {
    return { error: "Unauthorized" };
  }

  const result = NewLessonSchema.safeParse(data);

  if (result.error) {
    return { error: "Form validation error." };
  }

  let lesson;

  try {
    lesson = await prisma.lesson.create({
      data: {
        ...result.data,
        courseSlug,
      },
    });

    revalidatePath(`/teach/course/${courseSlug}`);
  } catch (error: any) {
    if (error.meta?.modelName === "Lesson" && error.code === "P2002") {
      return {
        error: "A lesson with that slug already exists.",
      };
    }
  }

  if (!lesson) {
    return { error: "Failed to create the lesson." };
  }
}

export async function updateLessonAction(lessonId: string, data: any) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { message: "Oops! You need to log in to access this feature." },
      { status: 400 }
    );
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
      course: {
        teacherId: session.user.id,
      },
    },
    include: {
      course: true,
    },
  });

  if (!lesson) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.lesson.update({
      where: { id: lessonId },
      data,
    });

    // Unpublish the course if it has no published lessons
    const lessons = await prisma.lesson.count({
      where: {
        courseSlug: lesson.courseSlug,
        isPublished: true,
      },
    });

    if (lessons === 0) {
      await prisma.course.update({
        where: { slug: lesson.courseSlug },
        data: {
          isPublished: false,
        },
      });
    }

    revalidatePath(
      `/teach/course/${lesson.course.slug}/lessons/${lesson.slug}`
    );
    revalidatePath(
      `/learn/course/${lesson.course.slug}/lessons/${lesson.slug}`
    );
  } catch {
    return { error: "Failed to update the lesson." };
  }
}

export async function deleteLessonAction(
  lessonId: string,
  redirectTo?: string
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { message: "Oops! You need to log in to access this feature." },
      { status: 400 }
    );
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
      course: {
        teacherId: session.user.id,
      },
    },
    include: {
      course: true,
      video: true,
    },
  });

  if (!lesson) {
    return { error: "Unauthorized" };
  }

  try {
    // Delete the lesson
    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    // Delete the video asset in mux
    if (lesson.video?.assetId) {
      await mux.video.assets.delete(lesson.video.assetId);
    }

    // Unpublish the course if it has no lessons
    const lessons = await prisma.lesson.count({
      where: {
        courseSlug: lesson.courseSlug,
        isPublished: true,
      },
    });

    if (lessons === 0) {
      await prisma.course.update({
        where: { slug: lesson.courseSlug },
        data: {
          isPublished: false,
        },
      });
    }

    revalidatePath(`/teach/course/${lesson.course.slug}`);
    revalidatePath(`/learn/course/${lesson.course.slug}`);
  } catch {
    return { error: "Failed to delete the lesson." };
  }

  if (redirectTo) {
    redirect(redirectTo);
  }
}

export async function createUploadUrl(lessonId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { message: "Oops! You need to log in to access this feature." },
      { status: 400 }
    );
  }

  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
      course: {
        teacherId: session.user.id,
      },
    },
    include: {
      video: true,
    },
  });

  if (!lesson) redirect("/");

  // Delete the previous video asset in mux
  if (lesson.video?.assetId) {
    await mux.video.assets.delete(lesson.video.assetId);
  }

  const passthrough = uuid();
  const upload = await mux.video.uploads.create({
    new_asset_settings: {
      playback_policy: ["public"],
      encoding_tier: "baseline",
      passthrough,
    },
    // TODO: Change this origin to your-domain.com
    cors_origin: "*",
  });

  // Update existing or create a new record in the database
  await prisma.video.upsert({
    where: {
      lessonId: lessonId,
    },
    update: {
      status: "waiting",
      passthrough: passthrough,
      uploadId: upload.id,
      assetId: null,
      playbackId: null,
      duration: null,
      aspectRatio: null,
    },
    create: {
      status: "waiting",
      passthrough: passthrough,
      uploadId: upload.id,
      teacherId: session.user.id,
      lessonId: lessonId,
    },
  });

  return upload.url;
}
