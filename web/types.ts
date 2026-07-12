export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface Problem {
  id: string;
  topic: string;
  title: string;
  statement: string;
  constraints: string[];
  examples: Example[];
  function: string;
  starter_file: string;
}

export interface TopicMeta {
  name: string;
  aliases: string[];
  sub_items: string[];
}

export interface Bank {
  topics: Record<string, TopicMeta>;
  problems: Problem[];
}

export interface TestResult {
  case: number;
  passed: boolean;
  args: unknown;
  expected: unknown;
  actual: unknown;
  failingOp?: string;
}

export interface Solution {
  time: string;
  space: string;
  approach: string;
  code: string;
}

export interface ExerciseGuide {
  title: string;
  meaning: string;
  definition: string;
  whyLearn: string;
  analogy: string;
  algorithmSteps: string;
  howItWorks: string;
  dryRun: string;
  visualization: string;
  codePattern: string;
  bigO: string;
  bigOWhy: string;
  commonMistakes: string;
  compareApproaches: string;
  interviewTips: string;
  notes: string;
  trace?: string;
}

export interface GuideResponse {
  guide: ExerciseGuide;
  extras: ExerciseGuide[];
}
