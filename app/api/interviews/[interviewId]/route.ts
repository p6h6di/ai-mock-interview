import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { interviewId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { message: "Oops! You need to log in to access this interview." },
        { status: 400 }
      );
    }

    const interview = await prisma.interview.findUnique({
      where: {
        id: params.interviewId,
      },
      include: {
        questions: {
          include: {
            feedbacks: {
              select: {
                id: true,
                answer: true,
                content: true,
                rating: true,
              },
            },
            answers: {
              select: {
                id: true,
                content: true,
              },
            },
          },
        },
      },
    });

    if (!interview) {
      return Response.json(
        {
          message: "Oops! We couldn't find the interview you're looking for.",
        },
        { status: 404 }
      );
    }

    if (interview.userId !== session.user.id) {
      return Response.json(
        {
          message: "You don't have permission to view this interview",
        },
        { status: 403 }
      );
    }

    return Response.json(interview, { status: 201 });
  } catch (error) {
    console.error("Get_Single_Interview", error);
    return Response.json(
      {
        message:
          "Oops! Something went wrong while fetching your interview. Please try again later.",
      },
      { status: 500 }
    );
  }
}
