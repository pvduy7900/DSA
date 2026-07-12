import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const BANK_PATH = join(ROOT, "..", "problem_bank.json");

const extraProblems = [
  {
    id: "radix_sort",
    topic: "sorting",
    title: "Radix Sort",
    statement:
      "Sort a non-negative integer array using LSD radix sort (base 10). Return a new sorted array.",
    constraints: [
      "0 <= nums[i] <= 10^6",
      "O(d * (n + k)) time where d is number of digits",
      "Non-comparison sort",
    ],
    examples: [
      { input: "nums=[170,45,75,90,802,24,2,66]", output: "[2,24,45,66,75,90,170,802]" },
      { input: "nums=[5,2,8,1]", output: "[1,2,5,8]" },
    ],
    function: "radixSort",
    starter_file: "radixSort.js",
    tests: [
      { args: [[170, 45, 75, 90, 802, 24, 2, 66]], expected: [2, 24, 45, 66, 75, 90, 170, 802] },
      { args: [[5, 2, 8, 1]], expected: [1, 2, 5, 8] },
      { args: [[]], expected: [] },
      { args: [[0]], expected: [0] },
      { args: [[10, 1, 10]], expected: [1, 10, 10] },
      { args: [[100, 10, 1]], expected: [1, 10, 100] },
      { args: [[9, 8, 7, 6, 5]], expected: [5, 6, 7, 8, 9] },
      { args: [[505, 55, 5]], expected: [5, 55, 505] },
    ],
    solution: {
      time: "O(d * (n + k))",
      space: "O(n + k)",
      approach: "Sort by each digit place from least significant to most using counting/bucket distribution.",
      code: `export function radixSort(nums) {
  if (!nums.length) return [];
  const arr = [...nums];
  const max = Math.max(...arr);
  let exp = 1;
  while (Math.floor(max / exp) > 0) {
    const buckets = Array.from({ length: 10 }, () => []);
    for (const n of arr) {
      const digit = Math.floor(n / exp) % 10;
      buckets[digit].push(n);
    }
    arr.length = 0;
    for (const bucket of buckets) arr.push(...bucket);
    exp *= 10;
  }
  return arr;
}`,
    },
  },
  {
    id: "bellman_ford",
    topic: "searching",
    title: "Bellman-Ford Shortest Path",
    statement:
      "Given a weighted directed graph `{ node: [[neighbor, weight], ...] }` and a `start` node, return `{ distances, hasNegativeCycle }`. `distances[node]` is shortest distance from start, or `null` if unreachable. If a negative cycle is reachable, set `hasNegativeCycle` to true and `distances` to null.",
    constraints: [
      "May include negative edge weights",
      "O(V * E) time",
      "No parallel multi-edge simplification needed",
    ],
    examples: [
      { input: "graph with edges A->B(1), B->C(2), start=A", output: "{A:0,B:1,C:3,hasNegativeCycle:false}" },
      { input: "graph with negative cycle", output: "hasNegativeCycle:true" },
    ],
    function: "bellmanFord",
    starter_file: "bellmanFord.js",
    tests: [
      {
        args: [{ A: [["B", 1], ["C", 4]], B: [["C", 2]], C: [] }, "A"],
        expected: { distances: { A: 0, B: 1, C: 3 }, hasNegativeCycle: false },
      },
      {
        args: [{ 0: [[1, 5]], 1: [] }, 0],
        expected: { distances: { 0: 0, 1: 5 }, hasNegativeCycle: false },
      },
      {
        args: [{ A: [["B", -1]], B: [["C", -2]], C: [["A", -3]] }, "A"],
        expected: { distances: null, hasNegativeCycle: true },
      },
      {
        args: [{ a: [["b", 2], ["c", 5]], b: [["c", -10]], c: [] }, "a"],
        expected: { distances: { a: 0, b: 2, c: -8 }, hasNegativeCycle: false },
      },
      {
        args: [{ X: [] }, "X"],
        expected: { distances: { X: 0 }, hasNegativeCycle: false },
      },
      {
        args: [{ s: [["t", 1]], t: [["u", 1]], u: [] }, "s"],
        expected: { distances: { s: 0, t: 1, u: 2 }, hasNegativeCycle: false },
      },
      {
        args: [{ 1: [[2, 3]], 2: [[3, 4]], 3: [[1, -10]] }, 1],
        expected: { distances: null, hasNegativeCycle: true },
      },
      {
        args: [{ 0: [[1, 0]], 1: [] }, 0],
        expected: { distances: { 0: 0, 1: 0 }, hasNegativeCycle: false },
      },
    ],
    solution: {
      time: "O(V * E)",
      space: "O(V)",
      approach: "Relax all edges V-1 times, then one more pass to detect negative cycles.",
      code: `export function bellmanFord(graph, start) {
  const dist = {};
  for (const node of Object.keys(graph)) dist[node] = null;
  dist[start] = 0;

  const edges = [];
  for (const [u, neighbors] of Object.entries(graph)) {
    for (const [v, w] of neighbors) edges.push([u, v, w]);
  }

  const nodes = Object.keys(graph);
  for (let i = 0; i < nodes.length - 1; i += 1) {
    for (const [u, v, w] of edges) {
      if (dist[u] !== null && (dist[v] === null || dist[u] + w < dist[v])) {
        dist[v] = dist[u] + w;
      }
    }
  }

  for (const [u, v, w] of edges) {
    if (dist[u] !== null && dist[v] !== null && dist[u] + w < dist[v]) {
      return { distances: null, hasNegativeCycle: true };
    }
    if (dist[u] !== null && dist[v] === null && dist[u] + w < 0) {
      return { distances: null, hasNegativeCycle: true };
    }
  }

  return { distances: dist, hasNegativeCycle: false };
}`,
    },
  },
  {
    id: "avl_tree",
    topic: "trees",
    title: "AVL Tree Insert with Rotations",
    statement:
      "Implement an `AVLTree` class with `insert(val)` and `inorder()` (sorted values). The tree must stay height-balanced using LL, RR, LR, and RL rotations after each insert.",
    constraints: [
      "Values are distinct integers",
      "insert is O(log n)",
      "Height balance factor must stay in {-1, 0, 1}",
    ],
    examples: [
      { input: "insert(10), insert(20), insert(30)", output: "inorder=[20,30] wait - [20] root? Actually after AVL: 20 root, 10 left, 30 right -> [10,20,30]" },
      { input: "insert(30), insert(10), insert(20)", output: "[10,20,30] after LR rotation" },
    ],
    function: "AVLTree",
    starter_file: "avlTree.js",
    tests: [
      {
        type: "class",
        operations: [
          { op: "insert", args: [10] },
          { op: "insert", args: [20] },
          { op: "insert", args: [30] },
          { op: "inorder", expected: [10, 20, 30] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: [30] },
          { op: "insert", args: [10] },
          { op: "insert", args: [20] },
          { op: "inorder", expected: [10, 20, 30] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: [10] },
          { op: "insert", args: [30] },
          { op: "insert", args: [20] },
          { op: "inorder", expected: [10, 20, 30] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: [30] },
          { op: "insert", args: [10] },
          { op: "insert", args: [40] },
          { op: "insert", args: [20] },
          { op: "inorder", expected: [10, 20, 30, 40] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: [5] },
          { op: "insert", args: [2] },
          { op: "insert", args: [8] },
          { op: "insert", args: [1] },
          { op: "insert", args: [3] },
          { op: "inorder", expected: [1, 2, 3, 5, 8] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: [50] },
          { op: "insert", args: [25] },
          { op: "insert", args: [75] },
          { op: "insert", args: [10] },
          { op: "insert", args: [30] },
          { op: "insert", args: [60] },
          { op: "insert", args: [80] },
          { op: "inorder", expected: [10, 25, 30, 50, 60, 75, 80] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: [42] },
          { op: "inorder", expected: [42] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: [9] },
          { op: "insert", args: [5] },
          { op: "insert", args: [7] },
          { op: "insert", args: [6] },
          { op: "inorder", expected: [5, 6, 7, 9] },
        ],
      },
    ],
    solution: {
      time: "O(log n) per insert",
      space: "O(n)",
      approach: "BST insert then rebalance using single/double rotations based on balance factor and child direction.",
      code: `class Node {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

export class AVLTree {
  constructor() {
    this.root = null;
  }

  height(node) {
    return node ? node.height : 0;
  }

  balanceFactor(node) {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  updateHeight(node) {
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  rotateRight(y) {
    const x = y.left;
    const t2 = x.right;
    x.right = y;
    y.left = t2;
    this.updateHeight(y);
    this.updateHeight(x);
    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const t2 = y.left;
    y.left = x;
    x.right = t2;
    this.updateHeight(x);
    this.updateHeight(y);
    return y;
  }

  insertNode(node, val) {
    if (!node) return new Node(val);
    if (val < node.val) node.left = this.insertNode(node.left, val);
    else if (val > node.val) node.right = this.insertNode(node.right, val);
    else return node;

    this.updateHeight(node);
    const balance = this.balanceFactor(node);

    if (balance > 1 && val < node.left.val) return this.rotateRight(node);
    if (balance < -1 && val > node.right.val) return this.rotateLeft(node);
    if (balance > 1 && val > node.left.val) {
      node.left = this.rotateLeft(node.left);
      return this.rotateRight(node);
    }
    if (balance < -1 && val < node.right.val) {
      node.right = this.rotateRight(node.right);
      return this.rotateLeft(node);
    }
    return node;
  }

  insert(val) {
    this.root = this.insertNode(this.root, val);
  }

  inorder() {
    const out = [];
    const walk = (node) => {
      if (!node) return;
      walk(node.left);
      out.push(node.val);
      walk(node.right);
    };
    walk(this.root);
    return out;
  }
}`,
    },
  },
];

const bank = JSON.parse(readFileSync(BANK_PATH, "utf8"));

bank.topics.sorting.sub_items = [
  "Stable VS Unstable Algorithms",
  "Bubble Sort",
  "Selection Sort",
  "Insertion Sort",
  "Merge Sort",
  "Quick Sort",
  "Heap Sort",
  "Counting Sort",
  "Radix Sort",
];

bank.topics.searching.sub_items = [
  "Linear Search",
  "Binary Search",
  "Tree Traversals (PreOrder, InOrder, PostOrder)",
  "BFS in Graphs",
  "DFS in Graphs",
  "Dijkstra Shortest Path",
  "Bellman-Ford Shortest Path",
  "Validate a BST",
];

bank.topics.trees.sub_items = [
  "Binary Trees and O(log n)",
  "Binary Search Trees (insert, lookup, remove)",
  "AVL Trees (rotations + balance)",
  "Red Black Trees (concepts)",
  "Binary Heaps and Priority Queues",
  "Trie data structure",
];

const existing = new Set(bank.problems.map((p) => p.id));
let added = 0;
for (const problem of extraProblems) {
  if (!existing.has(problem.id)) {
    bank.problems.push(problem);
    existing.add(problem.id);
    added += 1;
  }
}

writeFileSync(BANK_PATH, JSON.stringify(bank, null, 2));
console.log(`Added ${added} problems. Total: ${bank.problems.length}`);
