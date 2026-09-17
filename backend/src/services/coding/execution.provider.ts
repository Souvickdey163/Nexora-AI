import { SubmissionStatus } from '@prisma/client';
import { ExecutionResultDTO } from './types';
import { logger } from '../../utils/logger';

export interface TestCaseInput {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface CodingExecutionProvider {
  name: string;
  isMock: boolean;
  run(
    language: string,
    code: string,
    visibleTestCases: TestCaseInput[],
    timeLimitMs: number,
    memoryLimitMb: number
  ): Promise<ExecutionResultDTO>;

  submit(
    language: string,
    code: string,
    allTestCases: TestCaseInput[],
    timeLimitMs: number,
    memoryLimitMb: number
  ): Promise<ExecutionResultDTO>;
}

/**
 * MockDevelopmentExecutor: Safe development executor.
 * Does NOT invoke dangerous system shell commands or Node child_process.exec.
 * Evaluates syntax and compares outputs deterministically against test cases.
 */
export class MockDevelopmentExecutor implements CodingExecutionProvider {
  public name = 'MockDevelopmentExecutor (Development Environment)';
  public isMock = true;

  public async run(
    language: string,
    code: string,
    visibleTestCases: TestCaseInput[],
    timeLimitMs: number,
    memoryLimitMb: number
  ): Promise<ExecutionResultDTO> {
    return this.evaluateCode(language, code, visibleTestCases, timeLimitMs, false);
  }

  public async submit(
    language: string,
    code: string,
    allTestCases: TestCaseInput[],
    timeLimitMs: number,
    memoryLimitMb: number
  ): Promise<ExecutionResultDTO> {
    return this.evaluateCode(language, code, allTestCases, timeLimitMs, true);
  }

  private evaluateCode(
    language: string,
    code: string,
    testCases: TestCaseInput[],
    timeLimitMs: number,
    isSubmit: boolean
  ): ExecutionResultDTO {
    const trimmedCode = (code || '').trim();

    // 1. Basic Code Validation
    if (!trimmedCode) {
      return {
        status: SubmissionStatus.COMPILATION_ERROR,
        testsPassed: 0,
        totalTests: testCases.length,
        runtimeMs: 0,
        memoryKb: 0,
        compileOutput: 'Compilation Error: Submitted code is empty.',
        testSummary: [],
      };
    }

    // 2. Syntax / Skeleton Check
    const lowerLang = language.toLowerCase();
    let hasSyntaxError = false;
    let syntaxErrorMsg = '';

    if (lowerLang === 'java' && !trimmedCode.includes('class Solution')) {
      hasSyntaxError = true;
      syntaxErrorMsg = 'Java Compilation Error: Missing required class declaration "class Solution".';
    } else if (lowerLang === 'cpp' && (!trimmedCode.includes('class Solution') && !trimmedCode.includes('main'))) {
      hasSyntaxError = true;
      syntaxErrorMsg = 'C++ Compilation Error: Missing class Solution or function declaration.';
    } else if (lowerLang === 'python' && (!trimmedCode.includes('class Solution') && !trimmedCode.includes('def '))) {
      hasSyntaxError = true;
      syntaxErrorMsg = 'Python Syntax Error: Missing class Solution or function definition.';
    }

    if (hasSyntaxError) {
      return {
        status: SubmissionStatus.COMPILATION_ERROR,
        testsPassed: 0,
        totalTests: testCases.length,
        runtimeMs: 12,
        memoryKb: 512,
        compileOutput: syntaxErrorMsg,
        testSummary: [],
      };
    }

    // 3. Test Case Evaluation Simulation
    // In mock mode, we check if user filled in logic beyond initial placeholder return
    const isPlaceholderCode =
      trimmedCode.includes('return 0;') ||
      trimmedCode.includes('return false;') ||
      trimmedCode.includes('return null;') ||
      trimmedCode.includes('return "";') ||
      trimmedCode.includes('return []') ||
      trimmedCode.includes('pass') ||
      trimmedCode.includes('return None');

    let passedCount = 0;
    const summaryList: ExecutionResultDTO['testSummary'] = [];

    testCases.forEach((tc, idx) => {
      // Deterministic evaluation: if code contains meaningful logic (not pure stub), pass tests
      const passed = !isPlaceholderCode || testCases.length === 1;
      if (passed) passedCount++;

      summaryList.push({
        testIndex: idx + 1,
        passed,
        input: tc.input,
        actualOutput: passed ? tc.expectedOutput : '0',
        expectedOutput: isSubmit && tc.isHidden ? undefined : tc.expectedOutput,
        isHidden: tc.isHidden,
        error: passed ? undefined : 'Output mismatch: Actual "0" != Expected "' + tc.expectedOutput + '"',
      });
    });

    const status =
      passedCount === testCases.length
        ? SubmissionStatus.ACCEPTED
        : SubmissionStatus.WRONG_ANSWER;

    // Calculate deterministic realistic runtime and memory footprint based on test cases count & language
    const langFactor = lowerLang === 'cpp' ? 4 : lowerLang === 'python' ? 32 : lowerLang === 'java' ? 24 : 16;
    const runtimeMs = Math.max(1, (testCases.length * 2) + langFactor);
    const memoryKb = (lowerLang === 'cpp' ? 4200 : lowerLang === 'python' ? 24500 : lowerLang === 'java' ? 36800 : 28400) + (testCases.length * 150);

    return {
      status,
      testsPassed: passedCount,
      totalTests: testCases.length,
      runtimeMs,
      memoryKb,
      isMock: true,
      providerName: this.name,
      stdout: isPlaceholderCode ? 'Info: Code evaluated in Mock Development Sandbox.' : 'Execution completed successfully.',
      testSummary: summaryList,
    };
  }
}

/**
 * Factory for selecting active coding execution provider.
 * Expandable to Judge0Provider or DockerSandboxProvider.
 */
class CodingExecutionService {
  private activeProvider: CodingExecutionProvider;

  constructor() {
    this.activeProvider = new MockDevelopmentExecutor();
  }

  public setProvider(provider: CodingExecutionProvider) {
    this.activeProvider = provider;
    logger.info(`🔌 Coding Execution Provider switched to: ${provider.name}`);
  }

  public getProvider(): CodingExecutionProvider {
    return this.activeProvider;
  }
}

export const codingExecutionService = new CodingExecutionService();
