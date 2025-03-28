import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Update homepage content
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedContent = await prisma.homeContent.update({
      where: { id: params.id },
      data: { content },
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("Error updating homepage content:", error);
    return NextResponse.json(
      { message: "Error updating homepage content" },
      { status: 500 }
    );
  }
}

// Delete homepage content
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.homeContent.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: "Content deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting homepage content:", error);
    return NextResponse.json(
      { message: "Error deleting homepage content" },
      { status: 500 }
    );
  }
}

// Update content order
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { order } = await request.json();

    if (typeof order !== 'number') {
      return NextResponse.json(
        { message: "Invalid order value" },
        { status: 400 }
      );
    }

    const updatedContent = await prisma.homeContent.update({
      where: { id: params.id },
      data: { order },
    });

    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error("Error updating content order:", error);
    return NextResponse.json(
      { message: "Error updating content order" },
      { status: 500 }
    );
  }
} 