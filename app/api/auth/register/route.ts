import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Check if this is the first user
    const userCount = await prisma.user.count();
    const isFirstUser = userCount === 0;
    console.log("DEBUG - User count:", userCount);
    console.log("DEBUG - Is first user:", isFirstUser);
    console.log("DEBUG - Database connection:", !!prisma);

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user with explicit isAdmin flag
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin: isFirstUser,
      },
    });

    console.log("DEBUG - Created user:", { 
      id: user.id, 
      email: user.email, 
      isAdmin: user.isAdmin,
      createdAt: user.createdAt 
    });

    // Verify the user was created correctly
    const verifyUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
    console.log("DEBUG - Verified user in database:", {
      id: verifyUser?.id,
      email: verifyUser?.email,
      isAdmin: verifyUser?.isAdmin,
      createdAt: verifyUser?.createdAt
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(
      { 
        message: isFirstUser 
          ? "Admin user created successfully" 
          : "User created successfully",
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Error creating user" },
      { status: 500 }
    );
  }
} 