import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing home content
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
      type: 'archive-grid',
      content: 'Recent Archives',
      order: 3,
    },
  ];

  for (const content of defaultContent) {
    await prisma.homeContent.create({
      data: content,
    });
  }

  console.log('Database has been seeded with default home content.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 