import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { isAdmin: true },
    });

    console.log(`Successfully made ${user.email} an admin`);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        console.error(`No user found with email: ${email}`);
      } else {
        console.error('Prisma error:', error.message);
      }
    } else {
      console.error('Error making user admin:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address');
  process.exit(1);
}

makeAdmin(email); 