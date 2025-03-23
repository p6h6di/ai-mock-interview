import * as z from "zod";

export const InterviewSchema = z.object({
  jobRole: z.string().min(1, {
    message: "Job role is required! Please enter a valid job title.",
  }),
  jobDescription: z.string().min(1, {
    message:
      "Don't forget the job description! It's essential for creating relevant questions.",
  }),
  experience: z
    .number({
      invalid_type_error:
        "Experience must be a number. Please enter a valid numeric value.",
    })
    .min(0, {
      message:
        "Experience can't be negative! Please enter a non-negative number.",
    })
    .max(100, {
      message: "Wow, that's a lot! Experience must be less than 100 years.",
    }),
  questionRange: z
    .number({
      invalid_type_error:
        "Question range must be a number. Please enter a valid numeric value.",
    })
    .min(2, {
      message:
        "Too few questions! Please select at least 5 questions for a meaningful interview.",
    })
    .max(20, {
      message:
        "That's a lot of questions! Please keep it under 20 for a manageable interview.",
    }),
});

export type InterviewProps = z.infer<typeof InterviewSchema>;
