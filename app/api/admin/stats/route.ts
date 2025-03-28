import { NextResponse } from "next/server";
import { requireAdmin, clearSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // This will redirect non-admin users and clear their session
    await requireAdmin();

    const [totalUsers, totalArchives, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.archiveItem.count(),
      prisma.user.findMany({
        take: 5,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalArchives,
      recentUsers,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    
    // Clear the session on error
    await clearSession();
    
    return NextResponse.json(
      { message: "Error fetching admin statistics" },
      { status: 500 }
    );
  }
} 