import { NextResponse } from "next/server";
import { Resend } from "resend";

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key_for_build");

// Define the expected request body structure
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Validates contact form data
 * @param data The form data to validate
 * @returns An error message if validation fails, or null if validation passes
 */
function validateContactForm(data: Partial<ContactFormData>): string | null {
  const { name, email, subject, message } = data;

  if (!name?.trim()) {
    return "Name is required";
  }

  if (!email?.trim()) {
    return "Email is required";
  }

  if (!EMAIL_REGEX.test(email)) {
    return "Please provide a valid email address";
  }

  if (!subject?.trim()) {
    return "Subject is required";
  }

  if (!message?.trim()) {
    return "Message is required";
  }

  return null;
}

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param text The text to sanitize
 * @returns Sanitized text
 */
function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Handles POST requests to send emails from the contact form
 */
export async function POST(request: Request) {
  try {
    // Parse request body
    const formData = (await request.json()) as Partial<ContactFormData>;

    // Validate form data
    const validationError = validateContactForm(formData);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Destructure and sanitize form data
    const { name, email, subject, message } = formData as ContactFormData;
    const sanitizedName = sanitizeHtml(name);
    const sanitizedEmail = sanitizeHtml(email);
    const sanitizedSubject = sanitizeHtml(subject);
    const sanitizedMessage = sanitizeHtml(message);

    // Prepare email content
    const htmlContent = `
      <p><strong>Name:</strong> ${sanitizedName}</p>
      <p><strong>Email:</strong> ${sanitizedEmail}</p>
      <p><strong>Subject:</strong> ${sanitizedSubject}</p>
      <p><strong>Message:</strong></p>
      <p>${sanitizedMessage.replace(/\n/g, "<br>")}</p>
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Contact Form <${
        process.env.FROM_EMAIL || "onboarding@resend.dev"
      }>`,
      to: process.env.TO_EMAIL || "ramii.cheikhrouhou@gmail.com", // Use default recipient if not configured
      subject: `Portfolio Contact: ${sanitizedName} - ${sanitizedSubject}`,
      html: htmlContent,
      replyTo: sanitizedEmail,
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error processing email request:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
