import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(
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

    const page = await prisma.page.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        components: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json(
        { message: "Page not found" },
        { status: 404 }
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

    const { title, slug, description, isPublished, components } = await request.json();

    // Check if page exists and belongs to user
    const existingPage = await prisma.page.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingPage) {
      return NextResponse.json(
        { message: "Page not found" },
        { status: 404 }
      );
    }

    // Check if new slug is taken by another page
    if (slug !== existingPage.slug) {
      const slugTaken = await prisma.page.findUnique({
        where: { slug },
      });

      if (slugTaken) {
        return NextResponse.json(
          { message: "Slug is already taken" },
          { status: 400 }
        );
      }
    }

    // Update page and its components
    const updatedPage = await prisma.page.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        description,
        isPublished,
      },
      include: {
        components: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    // Update components
    if (components) {
      // Delete removed components
      const currentComponentIds = components.map((c: any) => c.id);
      await prisma.pageComponent.deleteMany({
        where: {
          pageId: params.id,
          NOT: {
            id: {
              in: currentComponentIds,
            },
          },
        },
      });

      // Update or create components
      for (const component of components) {
        if (component.id.startsWith("temp-")) {
          // Create new component
          await prisma.pageComponent.create({
            data: {
              name: component.name,
              type: component.type,
              config: component.config,
              order: component.order,
              pageId: params.id,
            },
          });
        } else {
          // Update existing component
          await prisma.pageComponent.update({
            where: { id: component.id },
            data: {
              name: component.name,
              type: component.type,
              config: component.config,
              order: component.order,
            },
          });
        }
      }
    }

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { message: "Error updating page" },
      { status: 500 }
    );
  }
}

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

    // Check if page exists and belongs to user
    const page = await prisma.page.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!page) {
      return NextResponse.json(
        { message: "Page not found" },
        { status: 404 }
      );
    }

    // Delete page and its components
    await prisma.page.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { message: "Error deleting page" },
      { status: 500 }
    );
  }
} 