import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  evaluateSource,
  findProblem,
  getSolution,
  loadBank,
  readStarterCode,
  sanitizeBankForClient,
} from "./lib/engine.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));
const GUIDES_PATH = join(ROOT, "exercise_guides.json");

function loadGuides() {
  return JSON.parse(readFileSync(GUIDES_PATH, "utf8"));
}

function getGuideForProblem(problemId, topic) {
  const data = loadGuides();
  const guide = data.guides[problemId];
  if (!guide) return null;

  const traversalIds = new Set([
    "graph_bfs",
    "graph_dfs",
    "dijkstra_shortest_path",
    "bellman_ford",
    "tree_traversals",
  ]);

  const sharedKeys = data.topicShared?.[topic] ?? [];
  const extras = sharedKeys
    .map((key) => ({ key, guide: data.shared[key] }))
    .filter((item) => item.guide)
    .filter((item) => item.key !== "dfsVsBfs" || traversalIds.has(problemId) || topic === "graphs")
    .map((item) => item.guide);

  return { guide, extras };
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

export function dsaApiPlugin() {
  const bank = loadBank(ROOT);

  return {
    name: "dsa-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith("/api/")) {
          next();
          return;
        }

        try {
          const url = new URL(req.url, "http://localhost");

          if (req.method === "GET" && url.pathname === "/api/bank") {
            sendJson(res, 200, sanitizeBankForClient(bank));
            return;
          }

          if (req.method === "GET" && url.pathname.startsWith("/api/starter/")) {
            const problemId = url.pathname.replace("/api/starter/", "");
            const problem = findProblem(bank, problemId);
            if (!problem) {
              sendJson(res, 404, { error: "Problem not found" });
              return;
            }
            sendJson(res, 200, { code: readStarterCode(problem, ROOT) });
            return;
          }

          if (req.method === "GET" && url.pathname.startsWith("/api/guide/")) {
            const problemId = url.pathname.replace("/api/guide/", "");
            const problem = findProblem(bank, problemId);
            if (!problem) {
              sendJson(res, 404, { error: "Problem not found" });
              return;
            }
            const payload = getGuideForProblem(problemId, problem.topic);
            if (!payload) {
              sendJson(res, 404, { error: "Guide not found" });
              return;
            }
            sendJson(res, 200, payload);
            return;
          }

          if (req.method === "GET" && url.pathname.startsWith("/api/solution/")) {
            const problemId = url.pathname.replace("/api/solution/", "");
            const problem = findProblem(bank, problemId);
            if (!problem) {
              sendJson(res, 404, { error: "Problem not found" });
              return;
            }
            sendJson(res, 200, getSolution(problem));
            return;
          }

          if (req.method === "POST" && url.pathname === "/api/submit") {
            const body = await readBody(req);
            const problem = findProblem(bank, body.problemId);
            if (!problem) {
              sendJson(res, 404, { error: "Problem not found" });
              return;
            }
            if (!body.code || typeof body.code !== "string") {
              sendJson(res, 400, { error: "Missing code" });
              return;
            }

            const results = await evaluateSource(problem, body.code, ROOT);
            const passed = results.filter((r) => r.passed).length;
            sendJson(res, 200, {
              results,
              summary: { passed, total: results.length },
            });
            return;
          }

          sendJson(res, 404, { error: "Not found" });
        } catch (error) {
          sendJson(res, 500, { error: error.message });
        }
      });
    },
  };
}
