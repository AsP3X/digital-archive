import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const contactForm = await prisma.contactForm.create({
      data: {
        name,
        email,
        message,
        userId: session?.user?.id,
      },
    });

    // Here you would typically send an email notification
    // using a service like SendGrid, AWS SES, etc.

    return NextResponse.json(
      { message: "Message sent successfully", contactForm },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error sending contact form:", error);
    return NextResponse.json(
      { message: "Error sending message" },
      { status: 500 }
    );
  }
} 