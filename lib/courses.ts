import { prisma } from "./prisma";

export async function getCourses(limit?: number) {
  const courses = await prisma.course.findMany({
    where: {
      isPublished: true,
    },
    include: {
      teacher: true,
      tag: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    ...(limit ? { take: limit } : {}),
  });
  return courses;
}

export async function getCourseBySlug(slug: string, teacherView = false) {
  const course = await prisma.course.findUnique({
    where: {
      slug,
    },
    include: {
      teacher: true,
      lessons: {
        ...(teacherView ? {} : { where: { isPublished: true } }),
        include: {
          video: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      tag: true,
    },
  });

  return course;
}

export function createSlugFromName(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  return slug;
}

export async function getTags() {
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return tags;
}

export async function getLessonBySlug(courseSlug: string, lessonSlug: string) {
  const lesson = await prisma.lesson.findUnique({
    where: {
      courseSlug_slug: {
        courseSlug,
        slug: lessonSlug,
      },
    },
    include: {
      video: true,
    },
  });

  return lesson;
}
