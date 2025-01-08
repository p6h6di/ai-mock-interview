import * as z from "zod";

export const NewCourseSchema = z.object({
  name: z.string().min(3, "Name is required."),
  slug: z.string().min(3, "Slug is required."),
  description: z.string().min(3, "Description is required."),
  tagId: z.string().min(3, "Tag is required."),
});

export const NewLessonSchema = z.object({
  name: z.string().min(3, "Name is required."),
  slug: z.string().min(3, "Slug is required."),
});
