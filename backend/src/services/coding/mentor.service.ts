import { prisma } from '../../config/database';
import { aiClient } from '../ai.client';
import { CodingMentorQueryInput } from './types';

export class CodingMentorService {
  /**
   * Process a coding query for Nexus AI Mentor.
   */
  public async getCodingAdvice(
    userId: string,
    input: CodingMentorQueryInput
  ): Promise<{ message: string; model: string; provider: string }> {
    const problem = await prisma.codingProblem.findUnique({
      where: { id: input.problemId },
    });

    if (!problem) {
      throw new Error('Problem not found.');
    }

    const { queryType, language, userCode, executionResult } = input;

    // Construct precise prompt depending on queryType
    let promptInstruction = '';

    switch (queryType) {
      case 'HINT':
        promptInstruction = `The user is asking for a HINT to solve this problem.
CRITICAL MANDATORY INSTRUCTION: Do NOT reveal the full solution or write complete code for the user.
Provide 1 to 2 progressive, conceptual hints that guide their problem-solving thinking without giving away the answer.`;
        break;
      case 'EXPLAIN_PROBLEM':
        promptInstruction = `Explain this coding problem in simple, intuitive terms. Break down the inputs, expected outputs, constraints, and edge cases to consider.`;
        break;
      case 'EXPLAIN_ERROR':
        promptInstruction = `The user encountered an error during code execution. Analyze the execution error and code below, and explain why the error occurred and how to debug it conceptually.`;
        break;
      case 'REVIEW_CODE':
        promptInstruction = `Review the user's submitted code for cleanliness, edge case handling, efficiency, and best practices in ${language}.`;
        break;
      case 'ANALYZE_COMPLEXITY':
        promptInstruction = `Analyze the Time Complexity O(...) and Space Complexity O(...) of the user's code snippet below. Explain how each part contributes to complexity.`;
        break;
      case 'SUGGEST_OPTIMIZATION':
        promptInstruction = `Suggest algorithmic optimizations to improve time or space efficiency for this problem. Explain the optimal data structures or algorithmic patterns (e.g. Hash Map, Two Pointers, DP, Monotonic Stack).`;
        break;
      default:
        promptInstruction = `Provide helpful coding mentorship regarding this problem.`;
    }

    const userMessage = `[CODING MENTOR REQUEST: ${queryType}]
Problem Title: "${problem.title}" (${problem.difficulty} - ${problem.topic})
Language: ${language}

Problem Description:
${problem.description}

Constraints:
${(problem.constraints || []).join('\n')}

User Code:
\`\`\`${language.toLowerCase()}
${userCode || '// No code provided'}
\`\`\`

Execution Result / Errors:
${executionResult ? JSON.stringify(executionResult, null, 2) : 'None'}

User Instruction:
${promptInstruction}`;

    const careerContext = {
      feature: 'CodingArena',
      problemTitle: problem.title,
      difficulty: problem.difficulty,
      topic: problem.topic,
      language,
    };

    // Call existing FastAPI / Gemini provider microservice via aiClient
    return aiClient.sendMentorChat(userMessage, [], careerContext);
  }
}

export const codingMentorService = new CodingMentorService();
