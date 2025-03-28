import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing content
  await prisma.homeContent.deleteMany();

  // Add initial content
  await prisma.homeContent.createMany({
    data: [
      {
        type: 'heading',
        content: 'Welcome to Digital Archive',
        order: 0,
        style: {
          color: '#1a1a1a',
          fontSize: '3rem',
        },
      },
      {
        type: 'paragraph',
        content: 'A modern platform for storing and displaying your digital content',
        order: 1,
        style: {
          color: '#666666',
          fontSize: '1.25rem',
        },
      },
      {
        type: 'button',
        content: 'Get Started',
        order: 2,
        style: {
          backgroundColor: '#3b82f6',
          color: '#ffffff',
        },
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 