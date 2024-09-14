import { auth } from "@/lib/auth";
import { chatSession } from "@/lib/geminiAI";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { interviewId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json(
        { message: "Oops! You need to log in to access this feature." },
        { status: 400 }
      );
    }

    const data = await req.json();
    const { questionId, answer } = data;
    if (!questionId || !answer) {
      return Response.json(
        {
          message:
            "Hold on! We're missing some important details. Can you double-check your input?",
        },
        { status: 400 }
      );
    }

    // Check if the user and interview exist
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    const interview = await prisma.interview.findUnique({
      where: {
        id: params.interviewId,
      },
    });
    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });
    // if (!user || !interview || !question) {
    //   return Response.json(
    //     {
    //       message:
    //         "Hmm... We couldn't find all the pieces of the puzzle. Let's make sure everything is in order!",
    //     },
    //     { status: 400 }
    //   );
    // }

    if (!user || !interview || !question) {
      const missingPieces = [];
      if (!user) missingPieces.push("user");
      if (!interview) missingPieces.push("interview");
      if (!question) missingPieces.push("question");

      return Response.json(
        {
          message: `Hmm... We couldn't find all the pieces of the puzzle. Missing: ${missingPieces.join(", ")}. Let's make sure everything is in order!`,
        },
        { status: 400 }
      );
    }

    // Generate feedback using Gemini AI
    const feedbackPrompt = `Question: ${question.content}, User Answer: ${answer}. Based on the provided interview question and user answer, please evaluate the response by considering the relevance, clarity, and completeness of the answer. Provide a rating (out of 10) and specific feedback focusing on areas of improvement or strengths, if any. The feedback should be concise, highlighting key points in 4 to 6 lines. Return the result in JSON format with fields 'rating' and 'content'.`;
    const result = await chatSession.sendMessage(feedbackPrompt);
    let feedbackJson;
    try {
      // Attempt to parse the response as JSON
      feedbackJson = JSON.parse(result.response.text());
    } catch (error) {
      console.error("Error parsing AI response:", error);
      // If parsing fails, attempt to extract rating and content manually
      const responseText = result.response.text();
      const ratingMatch = responseText.match(/"rating":\s*(\d+)/);
      const contentMatch = responseText.match(/"content":\s*"(.+?)"/);

      if (ratingMatch && contentMatch) {
        feedbackJson = {
          rating: parseInt(ratingMatch[1]),
          content: contentMatch[1],
        };
      } else {
        return Response.json(
          {
            message:
              "Oops! Our AI got a bit confused. We're working on making it smarter!",
          },
          { status: 500 }
        );
      }
    }

    // Check if feedbackJson is valid
    if (
      !feedbackJson ||
      typeof feedbackJson.rating !== "number" ||
      typeof feedbackJson.content !== "string"
    ) {
      console.error("Invalid feedback format:", feedbackJson);
      return Response.json(
        { message: "The feedback data looks a bit off. We're on it!" },
        { status: 500 }
      );
    }

    // Upsert feedback
    const feedback = await prisma.feedback.upsert({
      where: {
        userId_interviewId_questionId: {
          userId: user.id,
          interviewId: interview.id,
          questionId: question.id,
        },
      },
      update: {
        content: feedbackJson.content,
        rating: feedbackJson.rating,
        answer, // Add this line to update the answer
      },
      create: {
        userId: user.id,
        interviewId: interview.id,
        questionId: question.id,
        content: feedbackJson.content,
        rating: feedbackJson.rating,
        answer, // Add this line to store the answer
      },
    });

    if (feedback) {
      return Response.json(
        { message: "Your feedback has been saved successfully!" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Creating_Interview_Feedback", error);
    return Response.json(
      {
        message:
          "Uh-oh! We hit a small bump while saving your feedback. Don't worry, we're on it! Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
