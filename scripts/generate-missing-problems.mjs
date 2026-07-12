import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const BANK_PATH = join(ROOT, "..", "problem_bank.json");

const topicUpdates = {
  linked_lists: {
    sub_items: [
      "Pointers concepts",
      "Singly Linked Lists (append, prepend, insert, remove)",
      "Doubly Linked Lists implementation",
      "Singly VS Doubly",
      "Reverse a Linked List",
    ],
  },
  stacks_queues: {
    sub_items: [
      "Stacks VS Queues concepts",
      "Stack Implementation (Array)",
      "Queue Implementation (Array)",
      "Implement Queues using Stacks",
    ],
  },
  trees: {
    sub_items: [
      "Binary Trees and O(log n)",
      "Binary Search Trees (insert, lookup, remove)",
      "AVL Trees + Red Black Trees (concepts)",
      "Binary Heaps and Priority Queues",
      "Trie data structure",
    ],
  },
  graphs: {
    sub_items: [
      "Types Of Graphs",
      "Adjacency Matrix, Adjacency List, Edge List",
      "Build Adjacency List from Edges",
      "BFS Traversal",
      "DFS Traversal",
    ],
  },
  sorting: {
    sub_items: [
      "Stable VS Unstable Algorithms",
      "Bubble Sort",
      "Selection Sort",
      "Insertion Sort",
      "Merge Sort",
      "Quick Sort",
      "Heap Sort",
      "Counting Sort",
    ],
  },
  searching: {
    sub_items: [
      "Linear Search",
      "Binary Search",
      "Tree Traversals (PreOrder, InOrder, PostOrder)",
      "BFS in Graphs",
      "DFS in Graphs",
      "Dijkstra Shortest Path",
      "Validate a BST",
    ],
  },
  dynamic_programming: {
    sub_items: [
      "Memoization concepts",
      "Fibonacci Top-down (Memoization)",
      "Fibonacci Bottom-up (Tabulation)",
    ],
  },
  hash_tables: {
    sub_items: [
      "Hash Functions and Collisions",
      "Implementing a Hash Table",
      "Keys() and Collisions",
      "Hash Tables VS Arrays",
      "First Recurring Character",
    ],
  },
  arrays: {
    sub_items: [
      "Big O and Scalability",
      "Space Complexity",
      "Static vs Dynamic Arrays",
      "Strings and Arrays manipulation",
      "Implementing an Array from scratch",
      "Reverse A String",
      "Merge Sorted Arrays",
    ],
  },
  recursion: {
    sub_items: [
      "Anatomy of Recursion",
      "Recursive VS Iterative",
      "Factorial",
      "Fibonacci",
      "Reverse String With Recursion",
    ],
  },
};

const newProblems = [
  {
    id: "implement_dynamic_array",
    topic: "arrays",
    title: "Implement a Dynamic Array",
    statement:
      "Implement a `DynamicArray` class backed by a JavaScript array. Support `push(val)`, `pop()` (return removed value or null if empty), `get(index)` (return value or null if out of bounds), and `size()`.",
    constraints: [
      "0 <= number of operations <= 10^4",
      "push and pop should be O(1) amortized",
      "get should be O(1)",
    ],
    examples: [
      { input: "push(1), push(2), get(0), pop()", output: "get=1, pop=2" },
      { input: "pop() on empty array", output: "null" },
    ],
    function: "DynamicArray",
    starter_file: "dynamicArray.js",
    tests: [
      {
        type: "class",
        operations: [
          { op: "push", args: [1] },
          { op: "push", args: [2] },
          { op: "get", args: [0], expected: 1 },
          { op: "size", expected: 2 },
          { op: "pop", expected: 2 },
          { op: "size", expected: 1 },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "pop", expected: null },
          { op: "size", expected: 0 },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "push", args: [10] },
          { op: "push", args: [20] },
          { op: "push", args: [30] },
          { op: "get", args: [2], expected: 30 },
          { op: "get", args: [5], expected: null },
          { op: "pop", expected: 30 },
          { op: "pop", expected: 20 },
          { op: "pop", expected: 10 },
          { op: "pop", expected: null },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "push", args: [7] },
          { op: "get", args: [0], expected: 7 },
          { op: "get", args: [-1], expected: null },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "push", args: [1] },
          { op: "push", args: [2] },
          { op: "push", args: [3] },
          { op: "pop", expected: 3 },
          { op: "push", args: [4] },
          { op: "get", args: [1], expected: 2 },
          { op: "get", args: [2], expected: 4 },
          { op: "size", expected: 3 },
        ],
      },
    ],
    solution: {
      time: "O(1) amortized per push/pop",
      space: "O(n)",
      approach: "Wrap a native array. push uses array.push, pop uses array.pop, get checks bounds.",
      code: `export class DynamicArray {
  constructor() {
    this.data = [];
  }

  push(val) {
    this.data.push(val);
  }

  pop() {
    return this.data.length ? this.data.pop() : null;
  }

  get(index) {
    if (index < 0 || index >= this.data.length) return null;
    return this.data[index];
  }

  size() {
    return this.data.length;
  }
}`,
    },
  },
  {
    id: "implement_hash_table",
    topic: "hash_tables",
    title: "Implement a Hash Table",
    statement:
      "Implement a `HashMap` class with `set(key, value)`, `get(key)` (return value or null), `has(key)` (boolean), and `keys()` (array of keys in insertion order).",
    constraints: [
      "Keys and values are strings or numbers",
      "Average O(1) time per operation",
      "Handle collisions with chaining",
    ],
    examples: [
      { input: "set('a',1), set('b',2), get('a')", output: "1" },
      { input: "has('c')", output: "false" },
    ],
    function: "HashMap",
    starter_file: "hashMap.js",
    tests: [
      {
        type: "class",
        operations: [
          { op: "set", args: ["a", 1] },
          { op: "set", args: ["b", 2] },
          { op: "get", args: ["a"], expected: 1 },
          { op: "has", args: ["b"], expected: true },
          { op: "has", args: ["c"], expected: false },
          { op: "keys", expected: ["a", "b"] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "set", args: [1, "one"] },
          { op: "set", args: [2, "two"] },
          { op: "get", args: [2], expected: "two" },
          { op: "set", args: [1, "ONE"] },
          { op: "get", args: [1], expected: "ONE" },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "get", args: ["missing"], expected: null },
          { op: "keys", expected: [] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "set", args: ["x", 10] },
          { op: "set", args: ["y", 20] },
          { op: "set", args: ["z", 30] },
          { op: "keys", expected: ["x", "y", "z"] },
          { op: "get", args: ["y"], expected: 20 },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "set", args: ["dup", 1] },
          { op: "set", args: ["dup", 2] },
          { op: "get", args: ["dup"], expected: 2 },
          { op: "has", args: ["dup"], expected: true },
        ],
      },
    ],
    solution: {
      time: "O(1) average",
      space: "O(n)",
      approach: "Use an object/map for chaining buckets. Track key order separately for keys().",
      code: `export class HashMap {
  constructor() {
    this.buckets = new Map();
    this.order = [];
  }

  set(key, value) {
    if (!this.buckets.has(key)) this.order.push(key);
    this.buckets.set(key, value);
  }

  get(key) {
    return this.buckets.has(key) ? this.buckets.get(key) : null;
  }

  has(key) {
    return this.buckets.has(key);
  }

  keys() {
    return [...this.order];
  }
}`,
    },
  },
  {
    id: "singly_linked_list",
    topic: "linked_lists",
    title: "Singly Linked List Operations",
    statement:
      "Implement a `SinglyLinkedList` class with `append(val)`, `prepend(val)`, `insertAt(index, val)`, `removeAt(index)`, and `toArray()`. Return null from removeAt if index is invalid.",
    constraints: [
      "0 <= operations <= 10^4",
      "append/prepend O(1), insertAt/removeAt O(n)",
    ],
    examples: [
      { input: "append(1), append(2), prepend(0)", output: "[0,1,2]" },
      { input: "insertAt(1,5), removeAt(2)", output: "[0,5,2]" },
    ],
    function: "SinglyLinkedList",
    starter_file: "singlyLinkedList.js",
    tests: [
      {
        type: "class",
        operations: [
          { op: "append", args: [1] },
          { op: "append", args: [2] },
          { op: "prepend", args: [0] },
          { op: "toArray", expected: [0, 1, 2] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "append", args: [1] },
          { op: "insertAt", args: [1, 9] },
          { op: "insertAt", args: [0, 0] },
          { op: "toArray", expected: [0, 1, 9] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "append", args: [1] },
          { op: "append", args: [2] },
          { op: "append", args: [3] },
          { op: "removeAt", args: [1], expected: 2 },
          { op: "toArray", expected: [1, 3] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "removeAt", args: [0], expected: null },
          { op: "toArray", expected: [] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "append", args: [5] },
          { op: "removeAt", args: [5], expected: null },
          { op: "insertAt", args: [10, 1], expected: null },
        ],
      },
    ],
    solution: {
      time: "O(n) for insert/remove",
      space: "O(n)",
      approach: "Maintain head pointer. Walk nodes for index-based insert/remove.",
      code: `class Node {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

export class SinglyLinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  toArray() {
    const out = [];
    let curr = this.head;
    while (curr) {
      out.push(curr.val);
      curr = curr.next;
    }
    return out;
  }

  append(val) {
    const node = new Node(val);
    if (!this.head) {
      this.head = node;
    } else {
      let curr = this.head;
      while (curr.next) curr = curr.next;
      curr.next = node;
    }
    this.length += 1;
  }

  prepend(val) {
    this.head = new Node(val, this.head);
    this.length += 1;
  }

  insertAt(index, val) {
    if (index < 0 || index > this.length) return null;
    if (index === 0) {
      this.prepend(val);
      return val;
    }
    let curr = this.head;
    for (let i = 0; i < index - 1; i += 1) curr = curr.next;
    curr.next = new Node(val, curr.next);
    this.length += 1;
    return val;
  }

  removeAt(index) {
    if (index < 0 || index >= this.length) return null;
    if (index === 0) {
      const removed = this.head.val;
      this.head = this.head.next;
      this.length -= 1;
      return removed;
    }
    let curr = this.head;
    for (let i = 0; i < index - 1; i += 1) curr = curr.next;
    const removed = curr.next.val;
    curr.next = curr.next.next;
    this.length -= 1;
    return removed;
  }
}`,
    },
  },
  {
    id: "doubly_linked_list",
    topic: "linked_lists",
    title: "Doubly Linked List",
    statement:
      "Implement a `DoublyLinkedList` with `append(val)`, `prepend(val)`, `remove(val)` (first occurrence), and `toArray()` (head to tail).",
    constraints: ["Values are integers", "remove returns true if removed, false otherwise"],
    examples: [
      { input: "append(1), append(2), prepend(0)", output: "[0,1,2]" },
      { input: "remove(1)", output: "[0,2]" },
    ],
    function: "DoublyLinkedList",
    starter_file: "doublyLinkedList.js",
    tests: [
      {
        type: "class",
        operations: [
          { op: "append", args: [1] },
          { op: "append", args: [2] },
          { op: "prepend", args: [0] },
          { op: "toArray", expected: [0, 1, 2] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "append", args: [1] },
          { op: "append", args: [2] },
          { op: "remove", args: [1], expected: true },
          { op: "toArray", expected: [2] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "prepend", args: [5] },
          { op: "remove", args: [9], expected: false },
          { op: "toArray", expected: [5] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "append", args: [1] },
          { op: "append", args: [2] },
          { op: "append", args: [3] },
          { op: "remove", args: [2], expected: true },
          { op: "toArray", expected: [1, 3] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "append", args: [7] },
          { op: "prepend", args: [6] },
          { op: "remove", args: [6], expected: true },
          { op: "remove", args: [7], expected: true },
          { op: "toArray", expected: [] },
        ],
      },
    ],
    solution: {
      time: "O(n) remove, O(1) append/prepend",
      space: "O(n)",
      approach: "Use head/tail pointers and prev/next links for O(1) ends and scan for remove.",
      code: `class Node {
  constructor(val, prev = null, next = null) {
    this.val = val;
    this.prev = prev;
    this.next = next;
  }
}

export class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  toArray() {
    const out = [];
    let curr = this.head;
    while (curr) {
      out.push(curr.val);
      curr = curr.next;
    }
    return out;
  }

  append(val) {
    const node = new Node(val);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
  }

  prepend(val) {
    const node = new Node(val);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
  }

  remove(val) {
    let curr = this.head;
    while (curr) {
      if (curr.val === val) {
        if (curr.prev) curr.prev.next = curr.next;
        else this.head = curr.next;
        if (curr.next) curr.next.prev = curr.prev;
        else this.tail = curr.prev;
        return true;
      }
      curr = curr.next;
    }
    return false;
  }
}`,
    },
  },
  {
    id: "implement_stack",
    topic: "stacks_queues",
    title: "Implement a Stack",
    statement: "Implement a `Stack` class using an array: `push(val)`, `pop()`, `peek()`, `isEmpty()`.",
    constraints: ["All operations O(1)", "pop/peek return null when empty"],
    examples: [{ input: "push(1), push(2), peek(), pop()", output: "peek=2, pop=2" }],
    function: "Stack",
    starter_file: "stack.js",
    tests: [
      {
        type: "class",
        operations: [
          { op: "push", args: [1] },
          { op: "push", args: [2] },
          { op: "peek", expected: 2 },
          { op: "pop", expected: 2 },
          { op: "isEmpty", expected: false },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "isEmpty", expected: true },
          { op: "pop", expected: null },
          { op: "peek", expected: null },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "push", args: [10] },
          { op: "push", args: [20] },
          { op: "pop", expected: 20 },
          { op: "peek", expected: 10 },
          { op: "pop", expected: 10 },
          { op: "isEmpty", expected: true },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "push", args: [5] },
          { op: "push", args: [5] },
          { op: "pop", expected: 5 },
          { op: "pop", expected: 5 },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "push", args: [1] },
          { op: "push", args: [2] },
          { op: "push", args: [3] },
          { op: "pop", expected: 3 },
          { op: "pop", expected: 2 },
          { op: "peek", expected: 1 },
        ],
      },
    ],
    solution: {
      time: "O(1)",
      space: "O(n)",
      approach: "Array-backed stack using push/pop on the end.",
      code: `export class Stack {
  constructor() {
    this.items = [];
  }

  push(val) {
    this.items.push(val);
  }

  pop() {
    return this.items.length ? this.items.pop() : null;
  }

  peek() {
    return this.items.length ? this.items[this.items.length - 1] : null;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}`,
    },
  },
  {
    id: "implement_queue",
    topic: "stacks_queues",
    title: "Implement a Queue",
    statement:
      "Implement a `Queue` class using an array: `enqueue(val)`, `dequeue()`, `peek()`, `isEmpty()`.",
    constraints: ["Amortized O(1) per operation", "dequeue/peek return null when empty"],
    examples: [{ input: "enqueue(1), enqueue(2), dequeue()", output: "1" }],
    function: "Queue",
    starter_file: "queue.js",
    tests: [
      {
        type: "class",
        operations: [
          { op: "enqueue", args: [1] },
          { op: "enqueue", args: [2] },
          { op: "peek", expected: 1 },
          { op: "dequeue", expected: 1 },
          { op: "isEmpty", expected: false },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "isEmpty", expected: true },
          { op: "dequeue", expected: null },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "enqueue", args: [10] },
          { op: "enqueue", args: [20] },
          { op: "dequeue", expected: 10 },
          { op: "dequeue", expected: 20 },
          { op: "isEmpty", expected: true },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "enqueue", args: [5] },
          { op: "peek", expected: 5 },
          { op: "peek", expected: 5 },
          { op: "dequeue", expected: 5 },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "enqueue", args: [1] },
          { op: "enqueue", args: [2] },
          { op: "enqueue", args: [3] },
          { op: "dequeue", expected: 1 },
          { op: "peek", expected: 2 },
          { op: "dequeue", expected: 2 },
        ],
      },
    ],
    solution: {
      time: "O(1) amortized",
      space: "O(n)",
      approach: "Use array with head index to avoid costly shift, or use simple shift for learning.",
      code: `export class Queue {
  constructor() {
    this.items = [];
    this.head = 0;
  }

  enqueue(val) {
    this.items.push(val);
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.items[this.head++];
  }

  peek() {
    return this.isEmpty() ? null : this.items[this.head];
  }

  isEmpty() {
    return this.head >= this.items.length;
  }
}`,
    },
  },
  {
    id: "bst_operations",
    topic: "trees",
    title: "Binary Search Tree Operations",
    statement:
      "Implement a `BST` class with `insert(val)`, `search(val)` (boolean), `remove(val)` (boolean), and `inorder()` (sorted array).",
    constraints: ["Values are integers", "Average O(log n) for balanced trees, O(n) worst case"],
    examples: [
      { input: "insert(5), insert(3), insert(7), inorder()", output: "[3,5,7]" },
      { input: "search(3), remove(3)", output: "true, then [5,7]" },
    ],
    function: "BST",
    starter_file: "bst.js",
    tests: [
      {
        type: "class",
        operations: [
          { op: "insert", args: [5] },
          { op: "insert", args: [3] },
          { op: "insert", args: [7] },
          { op: "inorder", expected: [3, 5, 7] },
          { op: "search", args: [3], expected: true },
          { op: "search", args: [9], expected: false },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: [10] },
          { op: "insert", args: [5] },
          { op: "insert", args: [15] },
          { op: "remove", args: [5], expected: true },
          { op: "inorder", expected: [10, 15] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: [8] },
          { op: "remove", args: [99], expected: false },
          { op: "inorder", expected: [8] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: [5] },
          { op: "insert", args: [2] },
          { op: "insert", args: [8] },
          { op: "insert", args: [1] },
          { op: "inorder", expected: [1, 2, 5, 8] },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: [4] },
          { op: "insert", args: [2] },
          { op: "insert", args: [6] },
          { op: "remove", args: [4], expected: true },
          { op: "search", args: [4], expected: false },
          { op: "inorder", expected: [2, 6] },
        ],
      },
    ],
    solution: {
      time: "O(h) per operation",
      space: "O(n)",
      approach: "Classic BST recursion for insert/search; remove handles leaf, one child, and two children.",
      code: `class Node {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

export class BST {
  constructor() {
    this.root = null;
  }

  insert(val) {
    const add = (node) => {
      if (!node) return new Node(val);
      if (val < node.val) node.left = add(node.left);
      else if (val > node.val) node.right = add(node.right);
      return node;
    };
    this.root = add(this.root);
  }

  search(val) {
    let node = this.root;
    while (node) {
      if (val === node.val) return true;
      node = val < node.val ? node.left : node.right;
    }
    return false;
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

  remove(val) {
    const minValue = (node) => {
      while (node.left) node = node.left;
      return node.val;
    };

    const del = (node, target) => {
      if (!node) return null;
      if (target < node.val) node.left = del(node.left, target);
      else if (target > node.val) node.right = del(node.right, target);
      else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;
        const successor = minValue(node.right);
        node.val = successor;
        node.right = del(node.right, successor);
      }
      return node;
    };

    const before = this.search(val);
    if (!before) return false;
    this.root = del(this.root, val);
    return true;
  }
}`,
    },
  },
  {
    id: "implement_trie",
    topic: "trees",
    title: "Implement a Trie",
    statement:
      "Implement a `Trie` with `insert(word)`, `search(word)` (exact match), and `startsWith(prefix)`.",
    constraints: ["Words contain lowercase letters a-z", "O(m) time where m is word length"],
    examples: [
      { input: "insert('apple'), search('apple')", output: "true" },
      { input: "search('app'), startsWith('app')", output: "false, true" },
    ],
    function: "Trie",
    starter_file: "trie.js",
    tests: [
      {
        type: "class",
        operations: [
          { op: "insert", args: ["apple"] },
          { op: "search", args: ["apple"], expected: true },
          { op: "search", args: ["app"], expected: false },
          { op: "startsWith", args: ["app"], expected: true },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: ["cat"] },
          { op: "insert", args: ["car"] },
          { op: "startsWith", args: ["ca"], expected: true },
          { op: "search", args: ["ca"], expected: false },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "search", args: ["hello"], expected: false },
          { op: "startsWith", args: ["he"], expected: false },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: ["a"] },
          { op: "search", args: ["a"], expected: true },
          { op: "startsWith", args: ["a"], expected: true },
        ],
      },
      {
        type: "class",
        operations: [
          { op: "insert", args: ["dog"] },
          { op: "insert", args: ["dot"] },
          { op: "search", args: ["dot"], expected: true },
          { op: "startsWith", args: ["do"], expected: true },
        ],
      },
    ],
    solution: {
      time: "O(m)",
      space: "O(n * m)",
      approach: "Each node stores children map and isEnd flag.",
      code: `export class Trie {
  constructor() {
    this.root = {};
  }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node.$ = true;
  }

  traverse(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) return null;
      node = node[ch];
    }
    return node;
  }

  search(word) {
    const node = this.traverse(word);
    return !!(node && node.$);
  }

  startsWith(prefix) {
    return this.traverse(prefix) !== null;
  }
}`,
    },
  },
  {
    id: "build_adjacency_list",
    topic: "graphs",
    title: "Build Adjacency List from Edges",
    statement:
      "Given an array of edges `[from, to]` and a boolean `directed`, return an adjacency list (object mapping node -> sorted neighbor array).",
    constraints: ["Nodes may be strings or numbers", "O(E log E) or O(E) acceptable"],
    examples: [
      { input: "edges=[[0,1],[0,2],[1,3]], directed=false", output: "{0:[1,2],1:[0,3],2:[0],3:[1]}" },
      { input: "directed=true", output: "only outgoing edges" },
    ],
    function: "buildAdjacencyList",
    starter_file: "buildAdjacencyList.js",
    tests: [
      {
        args: [[[0, 1], [0, 2], [1, 3]], false],
        expected: { 0: [1, 2], 1: [0, 3], 2: [0], 3: [1] },
      },
      {
        args: [[[1, 2], [2, 3]], true],
        expected: { 1: [2], 2: [3] },
      },
      { args: [[], false], expected: {} },
      {
        args: [[[5, 6], [6, 5]], false],
        expected: { 5: [6], 6: [5] },
      },
      {
        args: [[["a", "b"], ["b", "c"]], true],
        expected: { a: ["b"], b: ["c"] },
      },
      {
        args: [[[0, 1], [1, 2], [2, 0]], false],
        expected: { 0: [1, 2], 1: [0, 2], 2: [0, 1] },
      },
      {
        args: [[[10, 20]], false],
        expected: { 10: [20], 20: [10] },
      },
      {
        args: [[[3, 4], [3, 4]], false],
        expected: { 3: [4], 4: [3] },
      },
    ],
    solution: {
      time: "O(E)",
      space: "O(V + E)",
      approach: "For each edge, add outgoing and optionally reverse edge for undirected graphs. Sort neighbors.",
      code: `export function buildAdjacencyList(edges, directed = false) {
  const graph = {};
  const add = (a, b) => {
    if (!graph[a]) graph[a] = [];
    if (!graph[a].includes(b)) graph[a].push(b);
    graph[a].sort();
  };

  for (const [from, to] of edges) {
    add(from, to);
    if (!directed) add(to, from);
  }
  return graph;
}`,
    },
  },
  {
    id: "graph_dfs",
    topic: "graphs",
    title: "Depth-First Search Traversal",
    statement: "Given an undirected graph as an adjacency list and a start node, return DFS traversal order.",
    constraints: ["O(V + E) time", "Visit neighbors in listed order"],
    examples: [
      { input: "graph={0:[1,2],1:[0,3],2:[0],3:[1]}, start=0", output: "[0,1,3,2]" },
    ],
    function: "dfs",
    starter_file: "graphDfs.js",
    tests: [
      {
        args: [{ 0: [1, 2], 1: [0, 3], 2: [0], 3: [1] }, 0],
        expected: [0, 1, 3, 2],
      },
      { args: [{ 0: [1], 1: [0] }, 1], expected: [1, 0] },
      { args: [{ 0: [] }, 0], expected: [0] },
      {
        args: [{ 0: [1, 2], 1: [0, 2], 2: [0, 1] }, 0],
        expected: [0, 1, 2],
      },
      {
        args: [{ a: ["b"], b: ["a", "c"], c: ["b"] }, "a"],
        expected: ["a", "b", "c"],
      },
      {
        args: [{ 0: [1], 1: [0, 2], 2: [1, 3], 3: [2] }, 0],
        expected: [0, 1, 2, 3],
      },
      {
        args: [{ 5: [6], 6: [5, 7], 7: [6] }, 5],
        expected: [5, 6, 7],
      },
      {
        args: [{ 0: [1, 3], 1: [0, 2], 2: [1], 3: [0] }, 0],
        expected: [0, 1, 2, 3],
      },
    ],
    solution: {
      time: "O(V + E)",
      space: "O(V)",
      approach: "Recursive or iterative DFS with visited set.",
      code: `export function dfs(graph, start) {
  if (!(start in graph)) return [];
  const visited = new Set();
  const order = [];

  const walk = (node) => {
    visited.add(node);
    order.push(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) walk(neighbor);
    }
  };

  walk(start);
  return order;
}`,
    },
  },
  {
    id: "reverse_string_recursive",
    topic: "recursion",
    title: "Reverse String (Recursive)",
    statement: "Reverse a string using recursion. Do not use loops.",
    constraints: ["Must use recursion", "O(n) time, O(n) stack space"],
    examples: [
      { input: "s = 'hello'", output: "'olleh'" },
      { input: "s = 'a'", output: "'a'" },
    ],
    function: "reverseStringRecursive",
    starter_file: "reverseStringRecursive.js",
    tests: [
      { args: ["hello"], expected: "olleh" },
      { args: ["a"], expected: "a" },
      { args: [""], expected: "" },
      { args: ["racecar"], expected: "racecar" },
      { args: ["ab"], expected: "ba" },
      { args: ["123"], expected: "321" },
      { args: ["abc def"], expected: "fed cba" },
      { args: ["!@#"], expected: "#@!" },
    ],
    solution: {
      time: "O(n)",
      space: "O(n)",
      approach: "Return last char + reverse of substring without last char. Base case: empty or single char.",
      code: `export function reverseStringRecursive(s) {
  if (s.length <= 1) return s;
  return reverseStringRecursive(s.slice(1)) + s[0];
}`,
    },
  },
  {
    id: "bubble_sort",
    topic: "sorting",
    title: "Bubble Sort",
    statement: "Sort an integer array in ascending order using bubble sort.",
    constraints: ["O(n^2) acceptable", "Return a new sorted array"],
    examples: [{ input: "nums=[5,1,4,2]", output: "[1,2,4,5]" }],
    function: "bubbleSort",
    starter_file: "bubbleSort.js",
    tests: [
      { args: [[5, 1, 4, 2]], expected: [1, 2, 4, 5] },
      { args: [[]], expected: [] },
      { args: [[1]], expected: [1] },
      { args: [[3, 3, 1]], expected: [1, 3, 3] },
      { args: [[9, 8, 7]], expected: [7, 8, 9] },
      { args: [[-2, -1, 0]], expected: [-2, -1, 0] },
      { args: [[2, 1]], expected: [1, 2] },
      { args: [[4, 2, 4, 1]], expected: [1, 2, 4, 4] },
    ],
    solution: {
      time: "O(n^2)",
      space: "O(n)",
      approach: "Repeatedly swap adjacent out-of-order elements; stop early if no swaps.",
      code: `export function bubbleSort(nums) {
  const arr = [...nums];
  for (let i = 0; i < arr.length; i += 1) {
    let swapped = false;
    for (let j = 0; j < arr.length - i - 1; j += 1) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    },
  },
  {
    id: "selection_sort",
    topic: "sorting",
    title: "Selection Sort",
    statement: "Sort an integer array in ascending order using selection sort.",
    constraints: ["O(n^2) time", "Return a new sorted array"],
    examples: [{ input: "nums=[5,1,4,2]", output: "[1,2,4,5]" }],
    function: "selectionSort",
    starter_file: "selectionSort.js",
    tests: [
      { args: [[5, 1, 4, 2]], expected: [1, 2, 4, 5] },
      { args: [[]], expected: [] },
      { args: [[1]], expected: [1] },
      { args: [[3, 3, 1]], expected: [1, 3, 3] },
      { args: [[9, 8, 7]], expected: [7, 8, 9] },
      { args: [[-1, 0, 2]], expected: [-1, 0, 2] },
      { args: [[2, 1]], expected: [1, 2] },
      { args: [[4, 2, 4, 1]], expected: [1, 2, 4, 4] },
    ],
    solution: {
      time: "O(n^2)",
      space: "O(n)",
      approach: "Select min of unsorted suffix and swap to front each pass.",
      code: `export function selectionSort(nums) {
  const arr = [...nums];
  for (let i = 0; i < arr.length; i += 1) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j += 1) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
    },
  },
  {
    id: "insertion_sort",
    topic: "sorting",
    title: "Insertion Sort",
    statement: "Sort an integer array in ascending order using insertion sort.",
    constraints: ["O(n^2) worst case", "Stable sort"],
    examples: [{ input: "nums=[5,1,4,2]", output: "[1,2,4,5]" }],
    function: "insertionSort",
    starter_file: "insertionSort.js",
    tests: [
      { args: [[5, 1, 4, 2]], expected: [1, 2, 4, 5] },
      { args: [[]], expected: [] },
      { args: [[1]], expected: [1] },
      { args: [[3, 3, 1]], expected: [1, 3, 3] },
      { args: [[9, 8, 7]], expected: [7, 8, 9] },
      { args: [[-1, 0, 2]], expected: [-1, 0, 2] },
      { args: [[2, 1]], expected: [1, 2] },
      { args: [[4, 2, 4, 1]], expected: [1, 2, 4, 4] },
    ],
    solution: {
      time: "O(n^2)",
      space: "O(n)",
      approach: "Insert each element into the sorted prefix by shifting larger elements right.",
      code: `export function insertionSort(nums) {
  const arr = [...nums];
  for (let i = 1; i < arr.length; i += 1) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j -= 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    },
  },
  {
    id: "quick_sort",
    topic: "sorting",
    title: "Quick Sort",
    statement: "Sort an integer array in ascending order using quick sort.",
    constraints: ["Average O(n log n)", "Return new sorted array"],
    examples: [{ input: "nums=[5,1,4,2,8]", output: "[1,2,4,5,8]" }],
    function: "quickSort",
    starter_file: "quickSort.js",
    tests: [
      { args: [[5, 1, 4, 2, 8]], expected: [1, 2, 4, 5, 8] },
      { args: [[]], expected: [] },
      { args: [[1]], expected: [1] },
      { args: [[3, 3, 1]], expected: [1, 3, 3] },
      { args: [[9, 8, 7, 6]], expected: [6, 7, 8, 9] },
      { args: [[-2, -1, 0]], expected: [-2, -1, 0] },
      { args: [[10, -10, 0]], expected: [-10, 0, 10] },
      { args: [[4, 2, 4, 1]], expected: [1, 2, 4, 4] },
    ],
    solution: {
      time: "O(n log n) average",
      space: "O(n)",
      approach: "Partition around pivot, recursively sort left and right partitions.",
      code: `export function quickSort(nums) {
  if (nums.length <= 1) return [...nums];
  const pivot = nums[Math.floor(nums.length / 2)];
  const left = nums.filter((n) => n < pivot);
  const mid = nums.filter((n) => n === pivot);
  const right = nums.filter((n) => n > pivot);
  return [...quickSort(left), ...mid, ...quickSort(right)];
}`,
    },
  },
  {
    id: "heap_sort",
    topic: "sorting",
    title: "Heap Sort",
    statement: "Sort an integer array in ascending order using heap sort.",
    constraints: ["O(n log n) time", "Use a heap structure"],
    examples: [{ input: "nums=[5,1,4,2]", output: "[1,2,4,5]" }],
    function: "heapSort",
    starter_file: "heapSort.js",
    tests: [
      { args: [[5, 1, 4, 2]], expected: [1, 2, 4, 5] },
      { args: [[]], expected: [] },
      { args: [[1]], expected: [1] },
      { args: [[3, 3, 1]], expected: [1, 3, 3] },
      { args: [[9, 8, 7]], expected: [7, 8, 9] },
      { args: [[-1, 0, 2]], expected: [-1, 0, 2] },
      { args: [[2, 1]], expected: [1, 2] },
      { args: [[4, 2, 4, 1]], expected: [1, 2, 4, 4] },
    ],
    solution: {
      time: "O(n log n)",
      space: "O(1) extra if in-place",
      approach: "Build max heap, repeatedly extract max to end of array.",
      code: `export function heapSort(nums) {
  const arr = [...nums];

  const heapify = (n, i) => {
    let largest = i;
    const left = i * 2 + 1;
    const right = i * 2 + 2;
    if (left < n && arr[left] > arr[largest]) largest = left;
    if (right < n && arr[right] > arr[largest]) largest = right;
    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(n, largest);
    }
  };

  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i -= 1) heapify(arr.length, i);
  for (let end = arr.length - 1; end > 0; end -= 1) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    heapify(end, 0);
  }
  return arr;
}`,
    },
  },
  {
    id: "counting_sort",
    topic: "sorting",
    title: "Counting Sort",
    statement:
      "Sort a non-negative integer array using counting sort. Assume values are in range 0..1000.",
    constraints: ["O(n + k) time", "Non-comparison sort"],
    examples: [{ input: "nums=[4,2,2,8,3,3,1]", output: "[1,2,2,3,3,4,8]" }],
    function: "countingSort",
    starter_file: "countingSort.js",
    tests: [
      { args: [[4, 2, 2, 8, 3, 3, 1]], expected: [1, 2, 2, 3, 3, 4, 8] },
      { args: [[]], expected: [] },
      { args: [[0]], expected: [0] },
      { args: [[5, 5, 5]], expected: [5, 5, 5] },
      { args: [[3, 1, 2]], expected: [1, 2, 3] },
      { args: [[10, 0, 5]], expected: [0, 5, 10] },
      { args: [[1, 0, 1, 0]], expected: [0, 0, 1, 1] },
      { args: [[7]], expected: [7] },
    ],
    solution: {
      time: "O(n + k)",
      space: "O(k)",
      approach: "Count occurrences, then rebuild output array in order.",
      code: `export function countingSort(nums) {
  if (!nums.length) return [];
  const max = Math.max(...nums);
  const counts = Array(max + 1).fill(0);
  for (const n of nums) counts[n] += 1;
  const out = [];
  for (let i = 0; i <= max; i += 1) {
    while (counts[i] > 0) {
      out.push(i);
      counts[i] -= 1;
    }
  }
  return out;
}`,
    },
  },
  {
    id: "linear_search",
    topic: "searching",
    title: "Linear Search",
    statement: "Return the index of `target` in `nums`, or -1 if not found. Use linear search.",
    constraints: ["O(n) time", "Do not use binary search"],
    examples: [
      { input: "nums=[4,2,7,1], target=7", output: "2" },
      { input: "target=9", output: "-1" },
    ],
    function: "linearSearch",
    starter_file: "linearSearch.js",
    tests: [
      { args: [[4, 2, 7, 1], 7], expected: 2 },
      { args: [[4, 2, 7, 1], 9], expected: -1 },
      { args: [[5], 5], expected: 0 },
      { args: [[], 1], expected: -1 },
      { args: [[1, 2, 3], 1], expected: 0 },
      { args: [[1, 2, 3], 3], expected: 2 },
      { args: [[10, 20, 10], 10], expected: 0 },
      { args: [[-1, 0, 1], 0], expected: 1 },
    ],
    solution: {
      time: "O(n)",
      space: "O(1)",
      approach: "Scan array left to right until target found.",
      code: `export function linearSearch(nums, target) {
  for (let i = 0; i < nums.length; i += 1) {
    if (nums[i] === target) return i;
  }
  return -1;
}`,
    },
  },
  {
    id: "tree_traversals",
    topic: "searching",
    title: "Binary Tree Traversals",
    statement:
      "Given a binary tree in level-order array form (`null` for missing nodes), return `{ preorder, inorder, postorder }` arrays.",
    constraints: ["O(n) time", "Use index-based children at 2i+1 and 2i+2"],
    examples: [
      { input: "tree=[1,null,2,null,null,3]", output: "pre=[1,2,3], in=[1,3,2], post=[3,2,1]" },
    ],
    function: "treeTraversals",
    starter_file: "treeTraversals.js",
    tests: [
      {
        args: [[1, null, 2, null, null, 3]],
        expected: { preorder: [1, 2, 3], inorder: [1, 3, 2], postorder: [3, 2, 1] },
      },
      {
        args: [[2, 1, 3]],
        expected: { preorder: [2, 1, 3], inorder: [1, 2, 3], postorder: [1, 3, 2] },
      },
      {
        args: [[]],
        expected: { preorder: [], inorder: [], postorder: [] },
      },
      {
        args: [[5]],
        expected: { preorder: [5], inorder: [5], postorder: [5] },
      },
      {
        args: [[10, 5, 15]],
        expected: { preorder: [10, 5, 15], inorder: [5, 10, 15], postorder: [5, 15, 10] },
      },
      {
        args: [[1, 2, 3, 4, 5, 6, 7]],
        expected: {
          preorder: [1, 2, 4, 5, 3, 6, 7],
          inorder: [4, 2, 5, 1, 6, 3, 7],
          postorder: [4, 5, 2, 6, 7, 3, 1],
        },
      },
      {
        args: [[3, 1, null, null, 2]],
        expected: { preorder: [3, 1, 2], inorder: [1, 2, 3], postorder: [2, 1, 3] },
      },
      {
        args: [[8, 4, 12, 2, 6]],
        expected: { preorder: [8, 4, 2, 6, 12], inorder: [2, 4, 6, 8, 12], postorder: [2, 6, 4, 12, 8] },
      },
    ],
    solution: {
      time: "O(n)",
      space: "O(h)",
      approach: "DFS from root index with three collectors for pre/in/post order.",
      code: `export function treeTraversals(tree) {
  const preorder = [];
  const inorder = [];
  const postorder = [];

  const walk = (index) => {
    if (index >= tree.length || tree[index] === null || tree[index] === undefined) return;
    const val = tree[index];
    preorder.push(val);
    walk(index * 2 + 1);
    inorder.push(val);
    walk(index * 2 + 2);
    postorder.push(val);
  };

  if (tree.length) walk(0);
  return { preorder, inorder, postorder };
}`,
    },
  },
  {
    id: "dijkstra_shortest_path",
    topic: "searching",
    title: "Dijkstra Shortest Path",
    statement:
      "Given a weighted directed graph as `{ node: [[neighbor, weight], ...] }` and a `start` node, return shortest distances from start to all reachable nodes as an object.",
    constraints: ["Non-negative weights", "O((V+E) log V) target"],
    examples: [
      {
        input: "graph={A:[[B,1],[C,4]],B:[[C,2]],C:[]}, start=A",
        output: "{A:0,B:1,C:3}",
      },
    ],
    function: "dijkstra",
    starter_file: "dijkstra.js",
    tests: [
      {
        args: [{ A: [["B", 1], ["C", 4]], B: [["C", 2]], C: [] }, "A"],
        expected: { A: 0, B: 1, C: 3 },
      },
      {
        args: [{ 0: [[1, 5]], 1: [] }, 0],
        expected: { 0: 0, 1: 5 },
      },
      {
        args: [{ X: [] }, "X"],
        expected: { X: 0 },
      },
      {
        args: [{ a: [["b", 2], ["c", 5]], b: [["c", 1]], c: [] }, "a"],
        expected: { a: 0, b: 2, c: 3 },
      },
      {
        args: [{ 0: [[1, 1], [2, 4]], 1: [[2, 2]], 2: [] }, 0],
        expected: { 0: 0, 1: 1, 2: 3 },
      },
      {
        args: [{ s: [["t", 10]], t: [["u", 1]], u: [] }, "s"],
        expected: { s: 0, t: 10, u: 11 },
      },
      {
        args: [{ 1: [[2, 3], [3, 8]], 2: [[3, 1]], 3: [] }, 1],
        expected: { 1: 0, 2: 3, 3: 4 },
      },
      {
        args: [{ A: [["B", 0]], B: [] }, "A"],
        expected: { A: 0, B: 0 },
      },
    ],
    solution: {
      time: "O((V+E) log V)",
      space: "O(V)",
      approach: "Greedy with min-distance node selection; relax neighbors.",
      code: `export function dijkstra(graph, start) {
  const dist = { [start]: 0 };
  const visited = new Set();

  while (visited.size < Object.keys(dist).length) {
    let curr = null;
    let best = Infinity;
    for (const [node, d] of Object.entries(dist)) {
      if (!visited.has(node) && d < best) {
        best = d;
        curr = node;
      }
    }
    if (curr === null) break;
    visited.add(curr);
    for (const [neighbor, weight] of graph[curr] || []) {
      const next = best + weight;
      if (!(neighbor in dist) || next < dist[neighbor]) dist[neighbor] = next;
    }
  }
  return dist;
}`,
    },
  },
  {
    id: "fibonacci_memo",
    topic: "dynamic_programming",
    title: "Fibonacci (Memoization)",
    statement: "Return the nth Fibonacci number using top-down dynamic programming (memoization). F(0)=0, F(1)=1.",
    constraints: ["0 <= n <= 50", "Must use memoization"],
    examples: [
      { input: "n=10", output: "55" },
      { input: "n=0", output: "0" },
    ],
    function: "fibonacciMemo",
    starter_file: "fibonacciMemo.js",
    tests: [
      { args: [10], expected: 55 },
      { args: [0], expected: 0 },
      { args: [1], expected: 1 },
      { args: [6], expected: 8 },
      { args: [15], expected: 610 },
      { args: [20], expected: 6765 },
      { args: [2], expected: 1 },
      { args: [30], expected: 832040 },
    ],
    solution: {
      time: "O(n)",
      space: "O(n)",
      approach: "Recursive with memo object caching subproblem results.",
      code: `export function fibonacciMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}`,
    },
  },
];

const bank = JSON.parse(readFileSync(BANK_PATH, "utf8"));

for (const [key, update] of Object.entries(topicUpdates)) {
  bank.topics[key] = { ...bank.topics[key], ...update };
}

const existingIds = new Set(bank.problems.map((p) => p.id));
let added = 0;
for (const problem of newProblems) {
  if (!existingIds.has(problem.id)) {
    bank.problems.push(problem);
    existingIds.add(problem.id);
    added += 1;
  }
}

writeFileSync(BANK_PATH, JSON.stringify(bank, null, 2));
console.log(`Updated topics and added ${added} problems. Total: ${bank.problems.length}`);
