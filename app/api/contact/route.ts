import { NextResponse } from "next/server";
import { validateRequest, contactSchema } from "@/lib/api-validation";
import { handleAPIResponse } from "@/lib/api-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = await validateRequest(contactSchema, body);

    // TODO: Send email using your email service
    // For now, we'll simulate a successful email send
    const emailSent = true;

    if (!emailSent) {
      return new NextResponse(
        JSON.stringify({
          message: "Failed to send email",
          code: "EMAIL_SEND_FAILED",
        }),
        { status: 500 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: "Email sent successfully" }),
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "APIError") {
      const apiError = error as Error & { code: string; status: number };
      return new NextResponse(
        JSON.stringify({
          message: apiError.message,
          code: apiError.code,
        }),
        { status: apiError.status }
      );
    }

    return new NextResponse(
      JSON.stringify({
        message: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      }),
      { status: 500 }
    );
  }
}
