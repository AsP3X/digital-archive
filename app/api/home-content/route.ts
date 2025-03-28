import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const content = await prisma.homeContent.findMany({
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching home content:', error);
    return NextResponse.json({ error: 'Failed to fetch home content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const content = await prisma.homeContent.create({
      data: {
        type: data.type,
        content: data.content,
        order: data.order,
        style: data.style,
      },
    });
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error creating home content:', error);
    return NextResponse.json({ error: 'Failed to create home content' }, { status: 500 });
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