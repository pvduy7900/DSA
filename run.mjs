#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import readline from "readline";

const ROOT = dirname(fileURLToPath(import.meta.url));
const BANK_PATH = join(ROOT, "problem_bank.json");
const SESSION_PATH = join(ROOT, ".session.json");
const STARTER_DIR = join(ROOT, "starter");
const WORKSPACE_DIR = join(ROOT, "workspace");

function loadBank() {
  return JSON.parse(readFileSync(BANK_PATH, "utf8"));
}

function loadSession() {
  if (existsSync(SESSION_PATH)) {
    return JSON.parse(readFileSync(SESSION_PATH, "utf8"));
  }
  return { current_problem_id: null, topic: null, problem_index: 0, attempts: {} };
}

function saveSession(session) {
  writeFileSync(SESSION_PATH, JSON.stringify(session, null, 2));
}

function resolveTopicKey(bank, topicName) {
  const normalized = topicName.trim().toLowerCase().replace(/ /g, "_").replace(/-/g, "_");
  if (normalized === "random") return "random";

  const { topics } = bank;
  if (topics[normalized]) return normalized;

  for (const [key, meta] of Object.entries(topics)) {
    const aliases = [key, ...(meta.aliases || [])];
    if (aliases.map((a) => a.toLowerCase()).includes(normalized)) return key;
    if (normalized.replace(/_/g, "") === meta.name.toLowerCase().replace(/ /g, "").replace(/&/g, "")) {
      return key;
    }
  }
  return null;
}

function getProblemsForTopic(bank, topicKey) {
  if (topicKey === "random") return bank.problems;
  return bank.problems.filter((p) => p.topic === topicKey);
}

function findProblem(bank, problemId) {
  return bank.problems.find((p) => p.id === problemId) ?? null;
}

function ensureWorkspace(problem) {
  mkdirSync(WORKSPACE_DIR, { recursive: true });
  const target = join(WORKSPACE_DIR, problem.starter_file);
  const starter = join(STARTER_DIR, problem.starter_file);
  if (!existsSync(target)) {
    copyFileSync(starter, target);
  }
  return target;
}

function readStarterCode(problem) {
  return readFileSync(join(STARTER_DIR, problem.starter_file), "utf8");
}

function formatProblem(problem, workspaceFile) {
  const lines = [
    `## ${problem.title}`,
    "",
    "**Problem Statement:**",
    problem.statement,
    "",
    "**Constraints:**",
    ...problem.constraints.map((c) => `- ${c}`),
    "",
    "**Examples:**",
  ];

  problem.examples.forEach((example, i) => {
    lines.push(`${i + 1}. Input: ${example.input}`);
    lines.push(`   Output: ${example.output}`);
    if (example.explanation) {
      lines.push(`   Explanation: ${example.explanation}`);
    }
  });

  lines.push(
    "",
    "**Starter Code:**",
    `Edit your solution in: \`${workspaceFile}\``,
    "",
    "```javascript",
    readStarterCode(problem).trimEnd(),
    "```",
    "",
    "Commands: `/submit`, `/explain`, `/reset`, `/next`"
  );

  return lines.join("\n");
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

async function loadModule(path) {
  const url = `${pathToFileURL(path).href}?t=${Date.now()}`;
  return import(url);
}

async function runFunctionTests(problem, module) {
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

async function runClassTests(problem, module) {
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
        if (name === "enqueue" || name === "insert") {
          instance[name](...op.args);
        } else if ("expected" in op) {
          actual = instance[name](...(op.args || []));
          expected = op.expected;
          if (!deepEqual(actual, expected)) {
            passed = false;
            failingOp = name;
            break;
          }
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

async function evaluateSubmission(problem, solutionPath) {
  const module = await loadModule(solutionPath);
  const hasClassTests = problem.tests.some((t) => t.type === "class");
  return hasClassTests ? runClassTests(problem, module) : runFunctionTests(problem, module);
}

function printTestResults(results) {
  const passedCount = results.filter((r) => r.passed).length;
  const total = results.length;

  console.log(`\nTest Results: ${passedCount}/${total} passed\n`);
  for (const result of results) {
    const status = result.passed ? "PASS" : "FAIL";
    console.log(`  [${status}] Test Case ${result.case}`);
    if (!result.passed) {
      console.log(`         Input:    ${JSON.stringify(result.args)}`);
      console.log(`         Expected: ${JSON.stringify(result.expected)}`);
      console.log(`         Got:      ${JSON.stringify(result.actual)}`);
      if (result.failingOp) {
        console.log(`         Failed at operation: ${result.failingOp}`);
      }
    }
  }

  if (passedCount === total) {
    console.log("\nAll tests passed! Use `/explain` to see the optimal solution, or `/next` for another problem.");
  } else {
    console.log("\nSome tests failed. Fix your code and run `/submit` again. No solution revealed yet.");
  }
}

function cmdStart(args, bank, session) {
  if (!args.length) {
    console.log("Usage: /start [topic_name] or /start random");
    console.log("\nAvailable topics:");
    for (const [key, meta] of Object.entries(bank.topics)) {
      console.log(`  - ${key}: ${meta.name}`);
    }
    return;
  }

  const topicKey = resolveTopicKey(bank, args[0]);
  if (!topicKey) {
    console.log(`Unknown topic: ${args[0]}`);
    return;
  }

  const problems = getProblemsForTopic(bank, topicKey);
  if (!problems.length) {
    console.log("No problems found for that topic.");
    return;
  }

  const problem =
    topicKey === "random"
      ? problems[Math.floor(Math.random() * problems.length)]
      : problems[session.problem_index % problems.length];

  const workspaceFile = ensureWorkspace(problem);
  session.current_problem_id = problem.id;
  session.topic = topicKey === "random" ? problem.topic : topicKey;
  session.problem_index = session.problem_index ?? 0;
  saveSession(session);

  console.log(formatProblem(problem, workspaceFile));
}

async function cmdSubmit(bank, session) {
  const problemId = session.current_problem_id;
  if (!problemId) {
    console.log("No active problem. Use `/start [topic]` first.");
    return;
  }

  const problem = findProblem(bank, problemId);
  if (!problem) {
    console.log("Current problem not found in bank.");
    return;
  }

  const workspaceFile = join(WORKSPACE_DIR, problem.starter_file);
  if (!existsSync(workspaceFile)) {
    ensureWorkspace(problem);
  }

  console.log(`Evaluating: ${workspaceFile}`);
  const results = await evaluateSubmission(problem, workspaceFile);
  printTestResults(results);

  session.attempts = session.attempts ?? {};
  session.attempts[problemId] = (session.attempts[problemId] ?? 0) + 1;
  saveSession(session);
}

function cmdExplain(bank, session) {
  const problemId = session.current_problem_id;
  if (!problemId) {
    console.log("No active problem. Use `/start [topic]` first.");
    return;
  }

  const problem = findProblem(bank, problemId);
  if (!problem) {
    console.log("Current problem not found in bank.");
    return;
  }

  const { solution } = problem;
  console.log(`\n## Optimal Solution: ${problem.title}\n`);
  console.log("### Approach");
  console.log(solution.approach);
  console.log("\n### Complexity");
  console.log(`- Time:  ${solution.time}`);
  console.log(`- Space: ${solution.space}`);
  console.log("\n### Code");
  console.log("```javascript");
  console.log(solution.code.trimEnd());
  console.log("```");
}

function cmdReset(bank, session) {
  const problemId = session.current_problem_id;
  if (!problemId) {
    console.log("No active problem. Use `/start [topic]` first.");
    return;
  }

  const problem = findProblem(bank, problemId);
  if (!problem) {
    console.log("Current problem not found in bank.");
    return;
  }

  const workspaceFile = join(WORKSPACE_DIR, problem.starter_file);
  copyFileSync(join(STARTER_DIR, problem.starter_file), workspaceFile);

  session.attempts = session.attempts ?? {};
  session.attempts[problemId] = 0;
  saveSession(session);

  console.log("Problem reset. Fresh starter code restored.\n");
  console.log(formatProblem(problem, workspaceFile));
}

function cmdNext(bank, session) {
  const topicKey = session.topic;
  if (!topicKey) {
    console.log("No active topic. Use `/start [topic]` first.");
    return;
  }

  const problems = getProblemsForTopic(bank, topicKey);
  if (!problems.length) {
    console.log("No problems in current topic.");
    return;
  }

  session.problem_index = (session.problem_index + 1) % problems.length;
  const problem = problems[session.problem_index];
  const workspaceFile = ensureWorkspace(problem);

  copyFileSync(join(STARTER_DIR, problem.starter_file), workspaceFile);

  session.current_problem_id = problem.id;
  saveSession(session);

  console.log(formatProblem(problem, workspaceFile));
}

function cmdListTopics(bank) {
  console.log("\nCurriculum Topics:\n");
  for (const [key, meta] of Object.entries(bank.topics)) {
    const count = bank.problems.filter((p) => p.topic === key).length;
    console.log(`  ${key}`);
    console.log(`    ${meta.name} (${count} problems)`);
    for (const sub of meta.sub_items) {
      console.log(`      - ${sub}`);
    }
    console.log();
  }
}

function cmdListProblems(bank, args) {
  let problems;
  if (args.length) {
    const topicKey = resolveTopicKey(bank, args[0]);
    if (!topicKey) {
      console.log(`Unknown topic: ${args[0]}`);
      return;
    }
    problems = getProblemsForTopic(bank, topicKey);
    console.log(`\nProblems in ${topicKey}:\n`);
  } else {
    problems = bank.problems;
    console.log("\nAll problems:\n");
  }

  for (const problem of problems) {
    console.log(`  - ${problem.id}: ${problem.title} [${problem.topic}]`);
  }
}

function printHelp() {
  console.log(`
DSA Training Environment

Commands:
  /start [topic]   Start a problem (topic name, number, or 'random')
  /submit          Run tests against your workspace solution
  /explain         Show optimal solution for current problem
  /reset           Reset current problem to starter code
  /next            Load next problem in current topic
  /topics          List all curriculum topics
  /problems [topic] List problems
  /help            Show this help
  /quit            Exit

Examples:
  /start arrays
  /start hash_tables
  /start random
  /submit
`);
}

async function handleCommand(raw, bank, session) {
  if (!raw.startsWith("/")) {
    console.log("Commands start with /. Try /help");
    return;
  }

  const parts = raw.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  const handlers = {
    "/start": () => cmdStart(args, bank, session),
    "/submit": () => cmdSubmit(bank, session),
    "/explain": () => cmdExplain(bank, session),
    "/reset": () => cmdReset(bank, session),
    "/next": () => cmdNext(bank, session),
    "/topics": () => cmdListTopics(bank),
    "/problems": () => cmdListProblems(bank, args),
    "/help": printHelp,
  };

  const handler = handlers[cmd];
  if (handler) {
    await handler();
  } else {
    console.log(`Unknown command: ${cmd}. Type /help`);
  }
}

async function main() {
  const bank = loadBank();
  const session = loadSession();

  console.log("DSA Training Environment Initialized.");
  console.log("Type '/start [topic]' or '/start random' to begin.");
  console.log("Type '/help' for all commands.\n");

  const cliArgs = process.argv.slice(2);
  if (cliArgs.length) {
    await handleCommand(cliArgs.join(" "), bank, session);
    return;
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "dsa> ",
  });

  rl.prompt();

  rl.on("line", async (line) => {
    const raw = line.trim();
    if (!raw) {
      rl.prompt();
      return;
    }
    if (raw === "/quit" || raw === "/exit") {
      console.log("Goodbye!");
      rl.close();
      return;
    }
    await handleCommand(raw, bank, session);
    rl.prompt();
  });

  rl.on("close", () => {
    process.exit(0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
