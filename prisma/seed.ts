import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a test user if it doesn't exist
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: 'test-user-1',
      email: 'test@example.com',
    },
  });

  // Create some sample habits for the test user
  const habits = await Promise.all([
    prisma.habit.upsert({
      where: { id: 'habit-1' },
      update: {},
      create: {
        id: 'habit-1',
        name: 'Morning Exercise',
        emoji: '🏃‍♂️',
        frequency: 'daily',
        userId: testUser.id,
      },
    }),
    prisma.habit.upsert({
      where: { id: 'habit-2' },
      update: {},
      create: {
        id: 'habit-2',
        name: 'Read Books',
        emoji: '📚',
        frequency: 'daily',
        userId: testUser.id,
      },
    }),
    prisma.habit.upsert({
      where: { id: 'habit-3' },
      update: {},
      create: {
        id: 'habit-3',
        name: 'Meditation',
        emoji: '🧘‍♀️',
        frequency: 'daily',
        userId: testUser.id,
      },
    }),
  ]);

  // Create sample challenges
  const challenges = await Promise.all([
    prisma.challenge.create({
      data: {
        title: '7-Day Fitness Streak',
        description: 'Complete your daily exercise habit for 7 consecutive days. Build momentum and consistency!',
        type: 'STREAK_BASED',
        difficulty: 'EASY',
        duration: 7,
        creatorId: testUser.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isPublic: true,
        aiGenerated: false,
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Social Motivation Boost',
        description: 'Send cheers to 3 friends this week and encourage their habit progress. Spread positivity!',
        type: 'SOCIAL_BASED',
        difficulty: 'EASY',
        duration: 7,
        creatorId: testUser.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isPublic: true,
        aiGenerated: true,
        aiPrompt: 'AI-generated challenge for social engagement',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Mindful Living Challenge',
        description: 'Practice meditation daily for 14 days. Develop mindfulness and reduce stress.',
        type: 'FREQUENCY_BASED',
        difficulty: 'MEDIUM',
        duration: 14,
        creatorId: testUser.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        isPublic: true,
        aiGenerated: false,
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Reading Marathon',
        description: 'Read for at least 30 minutes every day for 21 days. Expand your knowledge!',
        type: 'TIME_BASED',
        difficulty: 'HARD',
        duration: 21,
        creatorId: testUser.id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        isPublic: true,
        aiGenerated: true,
        aiPrompt: 'AI-generated challenge for reading habit',
      },
    }),
  ]);

  // Create some participants for the challenges
  await Promise.all([
    prisma.challengeParticipant.create({
      data: {
        challengeId: challenges[0].id,
        userId: testUser.id,
        joinedAt: new Date(),
        isActive: true,
      },
    }),
    prisma.challengeParticipant.create({
      data: {
        challengeId: challenges[1].id,
        userId: testUser.id,
        joinedAt: new Date(),
        isActive: true,
      },
    }),
  ]);

  // Add some progress for the first challenge
  const participant1 = await prisma.challengeParticipant.findFirst({
    where: { challengeId: challenges[0].id, userId: testUser.id },
  });

  if (participant1) {
    await Promise.all([
      prisma.challengeProgress.create({
        data: {
          participantId: participant1.id,
          date: new Date(),
          completed: true,
          notes: 'Great workout today!',
        },
      }),
      prisma.challengeProgress.create({
        data: {
          participantId: participant1.id,
          date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
          completed: true,
          notes: 'Morning run completed',
        },
      }),
    ]);
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created ${habits.length} habits`);
  console.log(`🏆 Created ${challenges.length} challenges`);
  console.log(`👤 Test user: ${testUser.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
