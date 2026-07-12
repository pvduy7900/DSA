# DSA Practice Environment

Interactive coding practice aligned with your curriculum in `instruction_dsa_promt.md`.

**Language: JavaScript (ES modules)**

## Quick Start (Web UI — recommended)

```bash
cd /Users/phamquangduy/Interview
npm run dsa:ui
```

Opens a browser with topics, code editor, test runner, and **Giải thích** tab per exercise (mapped from `EXERCISE_GUIDE.md`).

To rebuild guide content after editing `EXERCISE_GUIDE.md`:

```bash
npm run build:guides --prefix dsa-practice
```

Or from `dsa-practice/`:

```bash
npm run ui
```

## CLI (optional)

```bash
cd dsa-practice
node run.mjs
```

Or from the project root:

```bash
npm run dsa
```

Then in the interactive prompt:

```
/start arrays
```

Edit the file shown under **Starter Code** in `workspace/`, then:

```
/submit
```

## Commands

| Command | Description |
|---------|-------------|
| `/start [topic]` | Load a problem for a topic (or `/start random`) |
| `/submit` | Run 5–8 test cases against your workspace solution |
| `/explain` | Show optimal approach, complexity, and solution |
| `/reset` | Restore starter code for the current problem |
| `/next` | Move to the next problem in the current topic |
| `/topics` | List all 10 curriculum topics |
| `/problems [topic]` | List problems (optionally filtered by topic) |

One-off commands:

```bash
node run.mjs /start hash_tables
node run.mjs /submit
```

## Topics & Problems (37 total)

See [CURRICULUM_COVERAGE.md](./CURRICULUM_COVERAGE.md) for full mapping to your instruction file.

| Topic | Key | # | Problems |
|-------|-----|---|----------|
| Big O & Arrays | `arrays` | 3 | dynamicArray, reverseString, mergeSortedArrays |
| Hash Tables | `hash_tables` | 2 | hashMap, firstRecurringCharacter |
| Linked Lists | `linked_lists` | 3 | singlyLinkedList, doublyLinkedList, reverseLinkedList |
| Stacks & Queues | `stacks_queues` | 3 | stack, queue, queueUsingStacks |
| Trees | `trees` | 4 | bst, minHeap, trie, **avlTree** |
| Graphs | `graphs` | 3 | buildAdjacencyList, graphBfs, graphDfs |
| Recursion | `recursion` | 3 | factorial, fibonacciRecursive, reverseStringRecursive |
| Sorting | `sorting` | 8 | bubble, selection, insertion, merge, quick, heap, counting, **radix** |
| Searching + Traversal | `searching` | 7 | linearSearch, binarySearch, treeTraversals, dijkstra, **bellmanFord**, validateBst + graph traversals |
| Dynamic Programming | `dynamic_programming` | 2 | fibonacciMemo, fibonacciDp |

Topic aliases work too: `/start 1`, `/start dp`, `/start bfs`, etc.

## Folder Structure

```
dsa-practice/
├── run.mjs             # Interactive CLI runner
├── problem_bank.json   # Problems, tests, and solutions
├── starter/            # Clean JS templates (do not edit)
├── workspace/          # Your active solutions (edit these)
├── lib/                # Shared helpers (linked lists, etc.)
└── README.md
```

## Workflow

1. `/start arrays` — loads a problem and copies starter code to `workspace/`
2. Edit `workspace/reverseString.js` (or whichever file is shown)
3. `/submit` — see pass/fail for each test case
4. `/explain` — only when you want the optimal solution
5. `/next` — next problem in the same topic

## Starter Code Pattern

Each file exports a function or class:

```javascript
export function reverseString(s) {
  // your solution
}
```

```javascript
export class MyQueue {
  enqueue(x) { /* ... */ }
  dequeue() { /* ... */ }
  peek() { /* ... */ }
  isEmpty() { /* ... */ }
}
```

## Using with Cursor Chat

Use the same commands from `instruction_dsa_promt.md` in chat, or run tests locally with `node run.mjs /submit` for instant feedback.

## Adding More Problems

Edit `problem_bank.json` and add a matching file in `starter/`. Each problem needs:

- `id`, `topic`, `title`, `statement`, `constraints`, `examples`
- `function` name and `starter_file` (`.js`)
- `tests` array (5–8 cases recommended)
- `solution` block for `/explain`
