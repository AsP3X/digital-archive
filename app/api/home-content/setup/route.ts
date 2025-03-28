import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    // First, delete all existing home content
    await prisma.homeContent.deleteMany();

    // Create default home content
    const defaultContent = [
      {
        type: 'heading',
        content: 'Welcome to Digital Archive',
        order: 1,
        style: {
          fontSize: '3rem',
          color: 'hsl(var(--primary))',
        },
      },
      {
        type: 'paragraph',
        content: 'Your personal space for storing and organizing digital memories.',
        order: 2,
        style: {
          fontSize: '1.25rem',
          color: 'hsl(var(--muted-foreground))',
        },
      },
      {
        type: 'archive-preview',
        content: 'Recent Archives',
        order: 3,
      },
      {
        type: 'button',
        content: 'View All Archives',
        order: 4,
      },
    ];

    // Insert all default content
    await prisma.homeContent.createMany({
      data: defaultContent,
    });

    return NextResponse.json({ message: 'Default home content created successfully' });
  } catch (error) {
    console.error('Error setting up default home content:', error);
    return NextResponse.json(
      { error: 'Failed to set up default home content' },
      { status: 500 }
    );
  }
} 