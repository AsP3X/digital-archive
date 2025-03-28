import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Get all pages
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    
    const pages = await prisma.page.findMany({
      where: {
        userId: session.user.id,
        ...(published !== null ? { isPublished: published === 'true' } : {}),
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { message: "Error fetching pages" },
      { status: 500 }
    );
  }
}

// Create a new page
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { title, slug, content } = await request.json();

    if (!title || !slug || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if slug is already taken
    const existingPage = await prisma.page.findUnique({
      where: { slug },
    });

    if (existingPage) {
      return NextResponse.json(
        { message: "Slug already exists" },
        { status: 400 }
      );
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content,
        userId: session.user.id,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { message: "Error creating page" },
      { status: 500 }
    );
  }
} 