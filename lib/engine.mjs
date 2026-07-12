import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const ROOT = dirname(fileURLToPath(import.meta.url));

export function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function loadModule(path) {
  const url = `${pathToFileURL(path).href}?t=${Date.now()}`;
  return import(url);
}

export async function runFunctionTests(problem, module) {
  const fn = module[problem.function];
  const results = [];

  for (const [i, test] of problem.tests.entries()) {
    if (test.type === "class") continue;
    try {
      const actual = fn(...test.args);
      results.push({
        case: i + 1,
        passed: deepEqual(actual, test.expected),
        args: test.args,
        expected: test.expected,
        actual,
      });
    } catch (error) {
      results.push({
        case: i + 1,
        passed: false,
        args: test.args,
        expected: test.expected,
        actual: `ERROR: ${error.message}`,
      });
    }
  }

  return results;
}

export async function runClassTests(problem, module) {
  const Cls = module[problem.function];
  const results = [];
  let caseNum = 0;

  for (const test of problem.tests) {
    if (test.type !== "class") continue;
    caseNum += 1;

    try {
      const instance = new Cls();
      let passed = true;
      let actual = null;
      let expected = null;
      let failingOp = null;

      for (const op of test.operations) {
        const { op: name } = op;
        if ("expected" in op) {
          actual = instance[name](...(op.args || []));
          expected = op.expected;
          if (!deepEqual(actual, expected)) {
            passed = false;
            failingOp = name;
            break;
          }
        } else {
          instance[name](...(op.args || []));
        }
      }

      results.push({
        case: caseNum,
        passed,
        args: test.operations,
        expected,
        actual,
        failingOp,
      });
    } catch (error) {
      results.push({
        case: caseNum,
        passed: false,
        args: test.operations,
        expected: "operations complete",
        actual: `ERROR: ${error.message}`,
      });
    }
  }

  return results;
}

export async function evaluateSubmission(problem, solutionPath) {
  const module = await loadModule(solutionPath);
  const hasClassTests = problem.tests.some((t) => t.type === "class");
  return hasClassTests ? runClassTests(problem, module) : runFunctionTests(problem, module);
}

export async function evaluateSource(problem, sourceCode, root = join(ROOT, "..")) {
  const tempDir = mkdtempSync(join(tmpdir(), "dsa-eval-"));
  try {
    const libDir = join(tempDir, "lib");
    mkdirSync(libDir, { recursive: true });
    cpSync(join(root, "lib", "linkedListUtils.js"), join(libDir, "linkedListUtils.js"));

    const workspaceDir = join(tempDir, "workspace");
    mkdirSync(workspaceDir, { recursive: true });
    const filePath = join(workspaceDir, problem.starter_file);
    writeFileSync(filePath, sourceCode);

    return await evaluateSubmission(problem, filePath);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

export function loadBank(root = join(ROOT, "..")) {
  return JSON.parse(readFileSync(join(root, "problem_bank.json"), "utf8"));
}

export function findProblem(bank, problemId) {
  return bank.problems.find((p) => p.id === problemId) ?? null;
}

export function readStarterCode(problem, root = join(ROOT, "..")) {
  return readFileSync(join(root, "starter", problem.starter_file), "utf8");
}

export function getProblemsForTopic(bank, topicKey) {
  if (topicKey === "random") return bank.problems;
  return bank.problems.filter((p) => p.topic === topicKey);
}

export function sanitizeBankForClient(bank) {
  return {
    topics: bank.topics,
    problems: bank.problems.map(({ solution, ...rest }) => rest),
  };
}

export function getSolution(problem) {
  return problem.solution;
}

export function ensureWorkspaceFile(problem, root = join(ROOT, "..")) {
  const workspaceDir = join(root, "workspace");
  const starterPath = join(root, "starter", problem.starter_file);
  const workspacePath = join(workspaceDir, problem.starter_file);
  if (!existsSync(workspacePath)) {
    mkdirSync(workspaceDir, { recursive: true });
    cpSync(starterPath, workspacePath);
  }
  return workspacePath;
}
