import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Get the home page
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const page = await prisma.page.findUnique({
      where: {
        slug: 'home',
      },
    });

    if (!page) {
      // Create a default home page if it doesn't exist
      const defaultPage = await prisma.page.create({
        data: {
          title: 'Home',
          slug: 'home',
          content: [],
          userId: session?.user?.id || '',
          isPublished: true,
        },
      });
      return NextResponse.json(defaultPage);
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching home page:", error);
    return NextResponse.json(
      { message: "Error fetching home page" },
      { status: 500 }
    );
  }
}

// Update the home page
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const page = await prisma.page.findUnique({
      where: { slug: 'home' },
    });

    if (!page) {
      // Create the home page if it doesn't exist
      const newPage = await prisma.page.create({
        data: {
          title,
          slug: 'home',
          content,
          userId: session.user.id,
          isPublished: true,
        },
      });
      return NextResponse.json(newPage);
    }

    // Update the existing home page
    const updatedPage = await prisma.page.update({
      where: { slug: 'home' },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error updating home page:", error);
    return NextResponse.json(
      { message: "Error updating home page" },
      { status: 500 }
    );
  }
} 