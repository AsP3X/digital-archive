const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create default settings if they don't exist
  const settings = await prisma.settings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      siteName: 'Digital Archive',
      siteDescription: 'A digital archive system',
      contactEmail: 'admin@example.com',
      maxUploadSize: 10, // 10MB
    },
  });

  console.log('Default settings created:', settings);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 