import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Get a single page
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug } = params;

    const page = await prisma.page.findUnique({
      where: {
        slug,
        ...(session?.user?.id ? {} : { isPublished: true }),
      },
    });

    if (!page) {
      return NextResponse.json(
        { message: "Page not found" },
        { status: 404 }
      );
    }

    // If page is not published and user is not the owner
    if (!page.isPublished && page.userId !== session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { message: "Error fetching page" },
      { status: 500 }
    );
  }
}

// Update a page
export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = params;
    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      return NextResponse.json(
        { message: "Page not found" },
        { status: 404 }
      );
    }

    // Check if user owns the page
    if (page.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const updatedPage = await prisma.page.update({
      where: { slug },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { message: "Error updating page" },
      { status: 500 }
    );
  }
}

// Delete a page
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug } = params;

    const page = await prisma.page.findUnique({
      where: { slug },
    });

    if (!page) {
      return NextResponse.json(
        { message: "Page not found" },
        { status: 404 }
      );
    }

    // Check if user owns the page
    if (page.userId !== session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.page.delete({
      where: { slug },
    });

    return NextResponse.json(
      { message: "Page deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { message: "Error deleting page" },
      { status: 500 }
    );
  }
} 