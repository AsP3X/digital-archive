import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get total users count
    const totalUsers = await prisma.user.count();

    // Get total archives count
    const totalArchives = await prisma.archiveItem.count();

    // Get recent users
    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalArchives: totalArchives || 0,
      recentUsers: recentUsers || [],
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 