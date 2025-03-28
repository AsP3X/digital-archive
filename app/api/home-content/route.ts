import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const contents = await prisma.homeContent.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(contents);
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return NextResponse.json(
      { message: 'Error fetching homepage content' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { type, content } = await request.json();

    if (!type || !content) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get the highest order number
    const lastContent = await prisma.homeContent.findFirst({
      orderBy: { order: 'desc' },
    });

    const newContent = await prisma.homeContent.create({
      data: {
        type,
        content,
        order: (lastContent?.order ?? 0) + 1,
      },
    });

    return NextResponse.json(newContent);
  } catch (error) {
    console.error('Error creating homepage content:', error);
    return NextResponse.json(
      { message: 'Error creating homepage content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const content = await prisma.homeContent.update({
      where: { id: data.id },
      data: {
        type: data.type,
        content: data.content,
        order: data.order,
        style: data.style,
      },
    });
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating home content:', error);
    return NextResponse.json({ error: 'Failed to update home content' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.homeContent.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting home content:', error);
    return NextResponse.json({ error: 'Failed to delete home content' }, { status: 500 });
  }
} 