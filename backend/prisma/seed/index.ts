import { PrismaClient } from '@prisma/client';
import { arrayProblems } from './topics/arrays';
import { stringProblems } from './topics/strings';
import { linkedListProblems } from './topics/linked_lists';
import { stackProblems } from './topics/stacks';
import { queueProblems } from './topics/queues';
import { treeProblems } from './topics/trees';
import { bstProblems } from './topics/bst';
import { heapProblems } from './topics/heaps';
import { hashingProblems } from './topics/hashing';
import { graphProblems } from './topics/graphs';
import { recursionProblems } from './topics/recursion';
import { backtrackingProblems } from './topics/backtracking';
import { dpProblems } from './topics/dynamic_programming';
import { greedyProblems } from './topics/greedy';
import { sortingProblems } from './topics/sorting';
import { searchingProblems } from './topics/searching';
import { CodingProblemSeedInput } from './types';

const prisma = new PrismaClient();

const ALL_PROBLEMS: CodingProblemSeedInput[] = [
  ...arrayProblems,
  ...stringProblems,
  ...linkedListProblems,
  ...stackProblems,
  ...queueProblems,
  ...treeProblems,
  ...bstProblems,
  ...heapProblems,
  ...hashingProblems,
  ...graphProblems,
  ...recursionProblems,
  ...backtrackingProblems,
  ...dpProblems,
  ...greedyProblems,
  ...sortingProblems,
  ...searchingProblems,
];

export async function seedCodingArena() {
  console.log(`🌱 Seeding Nexora Coding Arena Problem Bank (${ALL_PROBLEMS.length} problems across 16 topics)...`);

  let seededCount = 0;

  for (const prob of ALL_PROBLEMS) {
    // Upsert Problem definition
    const problemRecord = await prisma.codingProblem.upsert({
      where: { slug: prob.slug },
      update: {
        title: prob.title,
        description: prob.description,
        source: prob.source || 'Nexora Original',
        license: prob.license || 'MIT',
        difficulty: prob.difficulty,
        topic: prob.topic,
        tags: prob.tags,
        examples: prob.examples,
        constraints: prob.constraints,
        supportedLanguages: prob.supportedLanguages || ['java', 'cpp', 'python', 'javascript', 'typescript'],
        starterCode: prob.starterCode,
        timeLimitMs: prob.timeLimitMs || 2000,
        memoryLimitMb: prob.memoryLimitMb || 256,
      },
      create: {
        slug: prob.slug,
        title: prob.title,
        description: prob.description,
        source: prob.source || 'Nexora Original',
        license: prob.license || 'MIT',
        difficulty: prob.difficulty,
        topic: prob.topic,
        tags: prob.tags,
        examples: prob.examples,
        constraints: prob.constraints,
        supportedLanguages: prob.supportedLanguages || ['java', 'cpp', 'python', 'javascript', 'typescript'],
        starterCode: prob.starterCode,
        timeLimitMs: prob.timeLimitMs || 2000,
        memoryLimitMb: prob.memoryLimitMb || 256,
      },
    });

    // Delete existing test cases for clean re-seeding
    await prisma.codingTestCase.deleteMany({
      where: { problemId: problemRecord.id },
    });

    // Create visible sample test cases
    let order = 0;
    for (const tc of prob.visibleTestCases) {
      await prisma.codingTestCase.create({
        data: {
          problemId: problemRecord.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: false,
          explanation: tc.explanation || null,
          order: order++,
        },
      });
    }

    // Create hidden test cases
    for (const tc of prob.hiddenTestCases) {
      await prisma.codingTestCase.create({
        data: {
          problemId: problemRecord.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          isHidden: true,
          explanation: null,
          order: order++,
        },
      });
    }

    seededCount++;
  }

  console.log(`✅ Successfully seeded ${seededCount} coding problems and test cases into PostgreSQL.`);
}

async function main() {
  try {
    await seedCodingArena();
  } catch (err) {
    console.error('❌ Error seeding Coding Arena problem bank:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
