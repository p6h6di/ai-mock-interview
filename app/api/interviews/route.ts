import { auth } from "@/lib/auth";
import { chatSession } from "@/lib/geminiAI";
import { prisma } from "@/lib/prisma";
import { InterviewSchema } from "@/validator/interview.schema";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json(
      { message: "Oops! You need to log in to access this feature." },
      { status: 400 }
    );
  }

  try {
    const data = await request.json();
    let validatedData;
    try {
      validatedData = InterviewSchema.parse(data);
    } catch (err) {
      return Response.json({ message: err }, { status: 400 });
    }

    const { jobRole, jobDescription, experience, questionRange } =
      validatedData;

    const InputPrompt = `You will receive three pieces of information: Job Position: ${jobRole}, Job Description: ${jobDescription}, Experience: ${experience}. Based on this information, please provide ${questionRange} interview questions with answers in JSON format. Include 'question' and 'answer' fields for each item in the JSON. Ensure that the difficulty level of the questions is appropriate for the given years of experience.`;

    const result = await chatSession.sendMessage(InputPrompt);
    let interviewData = result.response.text().trim();
    interviewData = interviewData.replace(/```json\n|```/g, "");
    // eslint-disable-next-line no-control-regex
    interviewData = interviewData.trim().replace(/[\x00-\x1F\x7F-\x9F]/g, "");

    if (!interviewData.startsWith("{") && !interviewData.startsWith("[")) {
      return Response.json(
        {
          message:
            "Oops! We couldn't generate valid interview questions. Please try again.",
        },
        { status: 400 }
      );
    }

    let parsedInterviewData;
    try {
      parsedInterviewData = JSON.parse(interviewData);
    } catch (error) {
      return Response.json(
        {
          message:
            "We had trouble processing the interview data. Mind giving it another shot?",
        },
        { status: 500 }
      );
    }

    if (!Array.isArray(parsedInterviewData)) {
      parsedInterviewData = [parsedInterviewData];
    }

    if (
      parsedInterviewData.length === 0 ||
      !parsedInterviewData.some((item) => item.question && item.answer)
    ) {
      return Response.json(
        {
          message:
            "Hmm, we couldn't generate any valid questions. Let's try that again!",
        },
        { status: 400 }
      );
    }

    const interview = await prisma.interview.create({
      data: {
        jobRole,
        jobDescription,
        experience,
        questionRange,
        userId: session.user.id!,
      },
    });

    for (const item of parsedInterviewData) {
      if (item.question && item.answer) {
        const question = await prisma.question.create({
          data: {
            content: item.question,
            interviewId: interview.id,
          },
        });
        await prisma.answer.create({
          data: {
            content: item.answer,
            questionId: question.id,
          },
        });
      }
    }

    return Response.json(
      { message: "Success! Your interview questions are ready to go!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Interview_Creation", error);
    return Response.json(
      {
        message:
          "Oops! Something went wrong while creating your interview. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { message: "Oops! You need to log in to access the interviews." },
        { status: 400 }
      );
    }

    const interviews = await prisma.interview.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(interviews, { status: 201 });
  } catch (error) {
    console.error("Get_Interviews", error);
    return Response.json(
      {
        message:
          "Oops! Something went wrong while fetching your interviews. Please try again later.",
      },
      { status: 500 }
    );
  }
}
