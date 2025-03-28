import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get settings from the database
    const settings = await prisma.settings.findFirst();

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        siteName: "Digital Archive",
        siteDescription: "A platform for preserving and sharing digital content",
        contactEmail: "contact@example.com",
        maxUploadSize: 5,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { siteName, siteDescription, contactEmail, maxUploadSize } = body;

    // Update or create settings
    const settings = await prisma.settings.upsert({
      where: { id: 1 }, // Assuming we only have one settings record
      update: {
        siteName,
        siteDescription,
        contactEmail,
        maxUploadSize,
      },
      create: {
        id: 1,
        siteName,
        siteDescription,
        contactEmail,
        maxUploadSize,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 