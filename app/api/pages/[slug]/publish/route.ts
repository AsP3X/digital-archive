import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Toggle page publish status
export async function POST(
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

    const updatedPage = await prisma.page.update({
      where: { slug },
      data: {
        isPublished: !page.isPublished,
      },
    });

    return NextResponse.json({
      message: updatedPage.isPublished ? "Page published" : "Page unpublished",
      isPublished: updatedPage.isPublished,
    });
  } catch (error) {
    console.error("Error toggling page publish status:", error);
    return NextResponse.json(
      { message: "Error toggling page publish status" },
      { status: 500 }
    );
  }
} 