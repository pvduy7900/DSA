import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { DETAILED_GUIDES, SHARED_GUIDES } from "../guides/detailed-content.mjs";

const ROOT = dirname(fileURLToPath(import.meta.url));

const TOPIC_SHARED = {
  graphs: ["dfsVsBfs"],
  searching: ["dfsVsBfs"],
  sorting: ["stableVsUnstable"],
  recursion: ["recursionAnatomy"],
  dynamic_programming: ["dpCore"],
};

const EMPTY_GUIDE = {
  title: "",
  meaning: "",
  definition: "",
  whyLearn: "",
  analogy: "",
  algorithmSteps: "",
  howItWorks: "",
  dryRun: "",
  visualization: "",
  codePattern: "",
  bigO: "",
  bigOWhy: "",
  commonMistakes: "",
  compareApproaches: "",
  interviewTips: "",
  notes: "",
};

function normalizeGuide(guide) {
  return { ...EMPTY_GUIDE, ...guide };
}

const guides = {};
for (const [id, guide] of Object.entries(DETAILED_GUIDES)) {
  guides[id] = normalizeGuide(guide);
}

const shared = {};
for (const [key, guide] of Object.entries(SHARED_GUIDES)) {
  shared[key] = normalizeGuide(guide);
}

writeFileSync(
  join(ROOT, "..", "exercise_guides.json"),
  JSON.stringify({ shared, guides, topicShared: TOPIC_SHARED }, null, 2)
);

console.log(`Generated ${Object.keys(guides).length} detailed exercise guides`);
