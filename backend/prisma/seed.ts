import { PrismaClient, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Nexora database seed...');

  const demoEmail = 'demo@nexora.ai';
  const existingUser = await prisma.user.findUnique({
    where: { email: demoEmail },
  });

  if (!existingUser) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('NexoraDemo123!', salt);

    const user = await prisma.user.create({
      data: {
        email: demoEmail,
        passwordHash,
        firstName: 'Demo',
        lastName: 'User',
        name: 'Demo User',
        emailVerified: true,
        status: UserStatus.ACTIVE,
        profile: {
          create: {
            headline: 'AI Career & Placement Candidate',
            bio: 'Welcome to Nexora AI platform.',
            skills: ['TypeScript', 'React', 'Node.js', 'AI Engineering'],
          },
        },
      },
    });

    console.log(`✅ Demo user created: ${user.email} (ID: ${user.id})`);
  } else {
    console.log('ℹ️ Demo user already exists.');
  }

  console.log('🌱 Nexora database seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
