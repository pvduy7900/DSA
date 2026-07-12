# DSA Exercise Guide for Assignees

> **Nguồn chi tiết cho web UI:** `guides/detailed-content.mjs`  
> Chạy `npm run build:guides` sau khi sửa để cập nhật tab **Giải thích** trên web.

Giải thích sâu cho **37 bài tập**, mỗi bài gồm 15 mục:

---

## Mục lục

1. [Big O & Arrays](#1-big-o--arrays)
2. [Hash Tables](#2-hash-tables)
3. [Linked Lists](#3-linked-lists)
4. [Stacks & Queues](#4-stacks--queues)
5. [Trees (BST, Heap, Trie, AVL)](#5-trees)
6. [Graphs](#6-graphs)
7. [Recursion](#7-recursion)
8. [Sorting](#8-sorting)
9. [Searching & Traversal](#9-searching--traversal)
10. [Dynamic Programming](#10-dynamic-programming)

---

## 1. Big O & Arrays

### 1.1 Reverse a String (`reverseString`)

**Ý nghĩa:** Đảo ngược chuỗi — ký tự đầu thành cuối.

**Định nghĩa dễ hiểu:** Đọc chuỗi từ hai đầu, hoán đổi vị trí cho đến giữa.

**Hình ảnh thực tế:** Giống xếp hàng đổi chỗ — người đầu hàng đi xuống cuối, người cuối lên đầu.

**Dry-run:** `hello` → `oellh` → `olleh`

```
h e l l o
↑       ↑  swap h↔o → o e l l h
  ↑   ↑    swap e↔l → o l l e h
    ↑      middle → olleh
```

**Code pattern:**
```javascript
export function reverseString(s) {
  const chars = s.split("");
  let left = 0, right = chars.length - 1;
  while (left < right) {
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++; right--;
  }
  return chars.join("");
}
```

**Big O:** Time `O(n)`, Space `O(n)` (hoặc `O(1)` nếu mutate in-place trên mảng ký tự).

**Lưu ý:** Chuỗi trong JS là immutable — cần `split` → swap → `join`.

---

### 1.2 Merge Sorted Arrays (`mergeSortedArrays`)

**Ý nghĩa:** Gộp 2 mảng đã sort thành 1 mảng sort.

**Định nghĩa:** Hai con trỏ `i`, `j` — mỗi bước lấy phần tử nhỏ hơn từ `nums1[i]` hoặc `nums2[j]`.

**Hình ảnh thực tế:** Trộn 2 dây bài đã xếp A–Z thành 1 dây — luôn lấy lá bài nhỏ nhất đang ở đầu mỗi chồng.

**Dry-run:**
```
nums1 = [1, 3, 5]
nums2 = [2, 4, 6]

Bước 1: 1 vs 2 → lấy 1  → [1]
Bước 2: 3 vs 2 → lấy 2  → [1,2]
Bước 3: 3 vs 4 → lấy 3  → [1,2,3]
Bước 4: 5 vs 4 → lấy 4  → [1,2,3,4]
Bước 5: 5 vs 6 → lấy 5  → [1,2,3,4,5]
Còn lại: 6       → [1,2,3,4,5,6]
```

**Big O:** Time `O(n+m)`, Space `O(n+m)`.

---

### 1.3 Implement Dynamic Array (`DynamicArray`)

**Ý nghĩa:** Mảng động — tự mở rộng khi đầy (JS array đã làm sẵn, bài này học **API** push/pop/get).

**Định nghĩa:** `push` thêm cuối, `pop` xóa cuối, `get(i)` đọc index, `size()` đếm phần tử.

**Hình ảnh thực tế:** Hộp đựng bút — thêm bút vào miệng hộp, lấy bút từ miệng hộp (LIFO cho pop, nhưng get đọc bất kỳ vị trí).

**Big O:** push/pop amortized `O(1)`, get `O(1)`.

**Lưu ý:** Static array cố định size; dynamic array resize khi full (thường gấp đôi capacity).

---

## 2. Hash Tables

### 2.1 First Recurring Character (`firstRecurringCharacter`)

**Ý nghĩa:** Tìm ký tự **đầu tiên** lặp lại khi quét trái → phải.

**Định nghĩa:** Dùng `Set` — gặp ký tự đã có trong set → return ngay.

**Dry-run:** `abccbaac`
```
a → set {a}
b → set {a,b}
c → set {a,b,c}
c → ĐÃ CÓ → return "c" ✓
```

**Big O:** Time `O(n)`, Space `O(k)` (k = số ký tự unique).

**Hash Table vs Array:** Array tìm recurring cần `O(n²)` nested loop; hash set → `O(n)`.

---

### 2.2 Implement Hash Map (`HashMap`)

**Ý nghĩa:** Bảng băm — map key → value với tra cứu nhanh.

**Định nghĩa:** `set(key,val)`, `get(key)`, `has(key)`, `keys()`.

**Hình ảnh thực tế:** Tủ locker — mỗi key là số tủ, value là đồ bên trong. Collision = 2 key cùng bucket → chaining (xích) bằng linked list.

**Cách hoạt động:**
1. Hash function: `hash(key) % bucketSize`
2. Collision: nhiều key cùng bucket → lưu list tại bucket đó
3. `get`: hash → bucket → tìm key trong chain

**Big O:** Average `O(1)` per operation.

---

## 3. Linked Lists

### 3.1 Singly Linked List (`SinglyLinkedList`)

**Ý nghĩa:** Danh sách liên kết đơn — mỗi node có `val` + `next`.

**Pointers concept:** `head` trỏ node đầu. Không random access — phải đi từ đầu.

**Hình ảnh thực tế:** Đoàn tàu — mỗi toa biết toa tiếp theo, không biết toa trước.

```
head → [1|•] → [2|•] → [3|null]
```

| Operation | Cách làm | Big O |
|-----------|----------|-------|
| append | Đi đến node cuối, gắn node mới | O(n) |
| prepend | Node mới.next = head; head = mới | O(1) |
| insertAt(i) | Walk đến i-1, chèn | O(n) |
| removeAt(i) | Walk đến i-1, nối bỏ qua | O(n) |

---

### 3.2 Doubly Linked List (`DoublyLinkedList`)

**Khác singly:** Mỗi node có `prev` + `next`.

**Hình ảnh:** Đường hai chiều — đi tới/lùi đều được.

**Singly vs Doubly:**
- Singly: ít memory hơn
- Doubly: remove node đã biết vị trí → `O(1)`, duyệt ngược dễ

---

### 3.3 Reverse Linked List (`reverseLinkedList`)

**Ý nghĩa:** Đảo chiều mũi tên `next`.

**3 con trỏ:** `prev`, `curr`, `next`

**Dry-run:**
```
null ← 1    2 → 3 → null
prev  curr

Bước 1: curr.next = prev  → null←1  2→3
Bước 2: prev=1, curr=2
...
Kết quả: 3 → 2 → 1 → null
```

**Big O:** Time `O(n)`, Space `O(1)`.

---

## 4. Stacks & Queues

### DFS vs BFS (từ `explain_dsa.md`)

| Tiêu chí | DFS | BFS |
|----------|-----|-----|
| Dịch nghĩa | Tìm kiếm theo chiều sâu | Tìm kiếm theo chiều rộng |
| Chiến lược | Đi sâu xuống đáy rồi quay lại | Quét hết từng tầng |
| Cấu trúc | **Stack** hoặc đệ quy | **Queue** |
| Ưu điểm | Ít memory nếu cây rộng | Đường đi ngắn nhất (unweighted) |

---

### 4.1 Stack (`Stack`)

**Ý nghĩa:** Ngăn xếp — LIFO (Last In First Out).

**Hình ảnh:** Chồng đĩa — đĩa cuối cùng đặt lên sẽ lấy ra trước.

**Operations:** push, pop, peek, isEmpty — tất cả `O(1)` với array.

---

### 4.2 Queue (`Queue`)

**Ý nghĩa:** Hàng đợi — FIFO (First In First Out).

**Hình ảnh:** Xếp hàng mua vé — người vào trước ra trước.

**Operations:** enqueue (cuối), dequeue (đầu), peek, isEmpty.

---

### 4.3 Queue using Stacks (`MyQueue`)

**Ý nghĩa:** Dùng 2 stack mô phỏng queue.

**Cách hoạt động:**
- `inbox`: enqueue = push vào inbox
- `outbox`: dequeue/peek — nếu outbox rỗng, đổ hết inbox sang outbox (đảo thứ tự → FIFO)

```
enqueue(1), enqueue(2)
inbox:  [1,2]  (bottom→top)
dequeue: đổ sang outbox → [2,1] → pop → 1
```

**Big O:** Amortized `O(1)` per operation.

---

## 5. Trees

### 5.1 BST Operations (`BST`)

**Ý nghĩa:** Binary Search Tree — trái < node < phải.

**Class structure (theo `explain_dsa.md`):**
```javascript
class Node { constructor(val) { this.val=val; this.left=null; this.right=null; } }
class BST { constructor() { this.root=null; } }
```

**Insert:** Đi từ root — nhỏ hơn đi trái, lớn hơn đi phải.

**Lookup:** Giống insert nhưng so sánh bằng → return true/false.

**Ví dụ tree (từ explain_dsa.md):**
```
        9
    4       20
       6   11   170

insert(9), insert(4), insert(6), insert(20)...
lookup(6)  → true
lookup(100) → false
```

**Big O:** Average `O(log n)` — mỗi level chia đôi không gian tìm kiếm:
```
2^0 = 1 node (root)
2^1 = 2
2^2 = 4
2^3 = 8
→ log₂(n) levels
```

**Remove (khó — nhớ kĩ, xem VisuAlgo):**
1. Leaf → xóa trực tiếp
2. 1 con → nối con lên thay
3. 2 con → thay bằng inorder successor (min bên phải), rồi xóa successor

---

### 5.2 Min Heap (`MinHeap`)

**Ý nghĩa:** Cây nhị phân đầy — cha ≤ con. Min luôn ở root (index 0).

**Hình ảnh:** Hàng đợi ưu tiên — việc khẩn nhất (nhỏ nhất) xử lý trước.

**Array representation:**
```
       1
     /   \
    3     2
  /  \
 5    4

Array: [1, 3, 2, 5, 4]
Parent(i) = floor((i-1)/2)
Left(i)   = 2i+1
Right(i)  = 2i+2
```

**insert:** Thêm cuối array → bubble up (so với parent).
**extractMin:** Lấy root, move phần tử cuối lên root → bubble down.

**Big O:** insert/extract `O(log n)`.

---

### 5.3 Trie (`Trie`)

**Ý nghĩa:** Prefix tree — tìm theo tiền tố.

**Hình ảnh:** Từ điển auto-complete — gõ "app" → gợi ý apple, apply...

**Cấu trúc:** Mỗi node = map ký tự → node con. Flag `isEnd` đánh dấu hết từ.

```
root → a → p → p → l → e (end)
              → l → y (end)
```

**Big O:** insert/search `O(m)` — m = độ dài từ.

---

### 5.4 AVL Tree (`AVLTree`)

**Ý nghĩa:** BST tự cân bằng — |balance factor| ≤ 1.

**Balance factor** = height(left) - height(right)

**4 kiểu rotation:**

| Case | Hình dạng | Fix |
|------|-----------|-----|
| LL | Insert vào left của left child | rotateRight |
| RR | Insert vào right của right child | rotateLeft |
| LR | Insert vào right của left child | rotateLeft(child) + rotateRight |
| RL | Insert vào left của right child | rotateRight(child) + rotateLeft |

**Dry-run RR:** insert 10, 20, 30 liên tiếp
```
10              20
  \            /  \
   20    →    10   30
     \
     30
```

**Lưu ý:** Insert BST trước → check balance → rotate. Giống note trong explain_dsa: *"nhớ code hàm insert theo node dạng cân bằng trước mới search được"*.

---

## 6. Graphs

### 6.1 Build Adjacency List (`buildAdjacencyList`)

**Ý nghĩa:** Chuyển danh sách cạnh → danh sách kề.

**3 cách biểu diễn graph:**

| Loại | Mô tả | Khi dùng |
|------|-------|----------|
| Edge List | `[[0,1],[1,2]]` | Ít memory, chậm tìm neighbor |
| Adjacency List | `{0:[1,2], 1:[0]}` | Sparse graph, BFS/DFS |
| Adjacency Matrix | `matrix[i][j]=1` | Dense graph, O(1) check edge |

**Undirected:** mỗi edge `[a,b]` → thêm b vào list của a **và** a vào list của b.

---

### 6.2 BFS (`bfs`) — Breadth-First Search

**Ý nghĩa tiếng Việt:** Duyệt theo chiều rộng / từng tầng.

**Hình ảnh (từ explain_dsa.md):** Sóng nước lan từ tâm. Tìm chìa khoá: tìm hết tầng 1 rồi mới lên tầng 2.

**Tree ví dụ:**
```
        9
    4       20
  1   5   9   170

BFS output: [9, 4, 20, 1, 5, 9, 170]
```

**Cách hoạt động — Queue FIFO:**
```
queue = [9]
visit 9 → enqueue 4, 20     → queue [4,20]
visit 4 → enqueue 1, 5      → queue [20,1,5]
visit 20 → enqueue 9, 170   → queue [1,5,9,170]
...
```

**Code 2 dạng (nhớ theo explain_dsa):**

*Iterative (queue):*
```javascript
export function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const node = queue.shift(); // FIFO
    order.push(node);
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}
```

*Recursive:* Dùng queue helper hoặc level-order recursion — iterative phổ biến hơn cho graph BFS.

**Big O:** `O(V + E)`.

---

### 6.3 DFS (`dfs`) — Depth-First Search

**Ý nghĩa:** Đi sâu nhánh trái/nhánh đầu tiên đến đáy, rồi backtrack.

**Cùng tree trên → DFS:** `[9, 4, 1, 5, 20, 9, 170]` (theo thứ tự neighbor)

**Stack hoặc recursion:**
```javascript
export function dfs(graph, start) {
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
}
```

**BFS vs DFS khi nào dùng:**
- Cần **đường ngắn nhất** (unweighted) → BFS
- Cần **explore all paths / cycle detect / topological** → DFS
- Cây **rất rộng** → DFS tiết kiệm memory hơn

---

## 7. Recursion

### Anatomy of Recursion

Mọi đệ quy cần:
1. **Base case** — dừng (không gọi tiếp)
2. **Recursive case** — gọi chính nó với input nhỏ hơn
3. **Stack** — mỗi call push 1 frame → quá sâu = Stack Overflow

---

### 7.1 Factorial (`factorial`)

```
factorial(5)
= 5 * factorial(4)
= 5 * 4 * factorial(3)
= ...
= 5 * 4 * 3 * 2 * 1 = 120

Base: factorial(0) = 1
```

**Big O:** Time `O(n)`, Space `O(n)` call stack.

---

### 7.2 Fibonacci Recursive (`fibonacci`)

```
fib(6) = fib(5) + fib(4)
       = (fib(4)+fib(3)) + (fib(3)+fib(2))
       → nhiều subproblem lặp lại!
```

**Big O:** `O(2^n)` — rất chậm. Đây là lý do cần DP/memoization.

---

### 7.3 Reverse String Recursive (`reverseStringRecursive`)

```
reverse("hello")
= reverse("ello") + "h"
= reverse("llo") + "e" + "h"
= ...
= "olleh"
```

Base: length ≤ 1 → return s.

---

## 8. Sorting

### Stable vs Unstable

| Stable | Unstable |
|--------|----------|
| Giữ thứ tự tương đối phần tử bằng nhau | Có thể đổi thứ tự phần tử bằng nhau |
| Insertion, Merge, Bubble, Counting | Quick, Heap |

---

### 8.1 Bubble Sort (`bubbleSort`)

**Mô tả (từ explain_dsa.md):** Duyệt từng cặp trái-phải, nếu trái > phải thì swap. Lặp đến khi không swap nữa.

**Dry-run:**
```
5 1 3 8 4 6 9 2
| |
1 5 3 8 4 6 9 2   ← swap 5↔1
  | |
1 3 5 8 4 6 9 2   ← swap 5↔3
    | |
1 3 4 5 8 6 9 2   ← swap 8↔4
      ...
1 2 3 4 5 6 8 9   ← sorted
```

**Code:** 2 vòng lặp `i`, `j`, biến tạm swap.

**Big O:** `O(n²)` — 2 nested loops.

---

### 8.2 Selection Sort (`selectionSort`)

Mỗi pass: tìm **min** của phần chưa sort → swap lên đầu phần đó.

```
[5, 1, 4, 2]
 ↑ min=1 → swap → [1, 5, 4, 2]
    ↑ min=2 → swap → [1, 2, 4, 5]
```

**Big O:** `O(n²)`, ít swap hơn bubble nhưng vẫn chậm.

---

### 8.3 Insertion Sort (`insertionSort`)

Giống xếp bài trên tay — mỗi lá mới chèn vào đúng vị trí trong phần đã sort.

**Stable.** Tốt khi array gần sorted.

**Big O:** `O(n²)` worst, `O(n)` best (đã sorted).

---

### 8.4 Merge Sort (`mergeSort`)

**Chia để trị:** Chia đôi → sort nửa trái/phải → merge 2 nửa sorted.

```
[38,27,43,3]
   /        \
[38,27]    [43,3]
 /  \       /  \
38  27    43   3
 ↓ merge ↓
[27,38]  [3,43]
     ↓ merge ↓
[3,27,38,43]
```

**Big O:** `O(n log n)` — luôn. Space `O(n)`.

---

### 8.5 Quick Sort (`quickSort`)

Chọn pivot, partition: nhỏ hơn pivot trái, lớn hơn phải, recurse.

**Big O:** Average `O(n log n)`, worst `O(n²)` (pivot xấu).

**Unstable.**

---

### 8.6 Heap Sort (`heapSort`)

Build max-heap → swap root với cuối → heapify → lặp.

**Big O:** `O(n log n)`, in-place.

---

### 8.7 Counting Sort (`countingSort`)

Đếm frequency mỗi giá trị → rebuild output. **Non-comparison.**

**Big O:** `O(n + k)` — k = range giá trị.

Chỉ dùng khi range nhỏ (0..1000).

---

### 8.8 Radix Sort (`radixSort`)

Sort theo từng digit (LSD: đơn vị → chục → trăm...) dùng stable bucket.

```
170, 45, 75, 90 → sort digit 1s → sort 10s → sort 100s → sorted
```

**Big O:** `O(d * (n + k))` — d = số chữ số.

---

## 9. Searching & Traversal

### 9.1 Linear Search (`linearSearch`)

Quét từ đầu đến cuối — `O(n)`. Dùng khi array **chưa sort**.

---

### 9.2 Binary Search (`binarySearch`)

**Điều kiện:** Array **đã sort**.

**Cách:** left, right, mid — chia đôi không gian tìm.

```
nums = [-1, 0, 3, 5, 9, 12], target = 9
left=0, right=5, mid=2 (val=3) → 3<9 → left=3
left=3, right=5, mid=4 (val=9) → found index 4
```

**Big O:** `O(log n)` — mỗi bước bỏ nửa:
```
log₂(100) ≈ 7 bước (2^7 = 128)
```

---

### 9.3 Tree Traversals (`treeTraversals`)

```
        2
       / \
      1   3

Preorder  (Root→Left→Right):  [2, 1, 3]
Inorder   (Left→Root→Right):  [1, 2, 3]  ← BST inorder = sorted!
Postorder (Left→Right→Root):  [1, 3, 2]
```

**Lưu ý:** Level-order array dùng index `2i+1` (left), `2i+2` (right).

---

### 9.4 Validate BST (`validateBst`)

Không chỉ check node trái < node phải — phải check **toàn bộ subtree** nằm trong range `(min, max)`.

```
    5
   / \
  1   4   ← 4 < 5 nhưng 4 nằm bên phải 5 → INVALID
```

DFS với bounds: `(-∞, +∞)` → trái `(-∞, node.val)` → phải `(node.val, +∞)`.

---

### 9.5 Dijkstra (`dijkstra`)

**Đường đi ngắn nhất** với **trọng số không âm**.

Greedy: luôn relax node có dist nhỏ nhất chưa visit.

```
A --1-- B --2-- C
  \           /
   ----4-----

A→B→C = 3  tốt hơn A→C = 4
```

**Big O:** `O((V+E) log V)` với priority queue.

**Không dùng khi có cạnh âm** → dùng Bellman-Ford.

---

### 9.6 Bellman-Ford (`bellmanFord`)

Relax **tất cả edges** V-1 lần. Lần thứ V nếu còn improve → **negative cycle**.

**Cho phép cạnh âm.** Chậm hơn Dijkstra: `O(V * E)`.

---

## 10. Dynamic Programming

### Core idea

1. **Overlapping subproblems** — cùng bài toán con tính nhiều lần
2. **Optimal substructure** — optimal của bài lớn từ optimal bài nhỏ

---

### 10.1 Fibonacci Memo — Top-down (`fibonacciMemo`)

```javascript
function fib(n, memo = {}) {
  if (n in memo) return memo[n];  // đã tính → trả luôn
  if (n <= 1) return n;
  memo[n] = fib(n-1, memo) + fib(n-2, memo);
  return memo[n];
}
```

**Big O:** `O(n)` — mỗi n tính 1 lần.

---

### 10.2 Fibonacci Bottom-up (`fibonacciDp`)

```javascript
function fibonacciDp(n) {
  if (n <= 1) return n;
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}
```

**Top-down vs Bottom-up:**

| | Top-down (memo) | Bottom-up (tabulation) |
|--|-----------------|------------------------|
| Hướng | Từ n → base case | Từ base case → n |
| Cấu trúc | Đệ quy + cache | Vòng lặp + table |
| Stack | Có call stack | Không |

---

## Quick Reference — Big O Cheat Sheet

| Algorithm | Time | Space |
|-----------|------|-------|
| Reverse string | O(n) | O(n) |
| Merge arrays | O(n+m) | O(n+m) |
| Hash get/set | O(1) avg | O(n) |
| Linked list ops | O(n) | O(1) extra |
| Stack/Queue | O(1) | O(n) |
| BST search | O(log n) avg | O(h) |
| Heap insert | O(log n) | O(n) |
| BFS/DFS | O(V+E) | O(V) |
| Bubble/Selection/Insertion | O(n²) | O(1) |
| Merge/Heap/Quick avg | O(n log n) | varies |
| Binary search | O(log n) | O(1) |
| Dijkstra | O((V+E)logV) | O(V) |
| Bellman-Ford | O(VE) | O(V) |
| Fibonacci DP | O(n) | O(1) |

---

## Tips cho Assignee

1. **Luôn viết base case trước** khi dùng đệ quy
2. **BFS = Queue**, **DFS = Stack/Recursion** — nhớ như explain_dsa
3. **BST:** insert trước, rồi mới lookup/remove
4. **Sorting:** trace tay 1 mảng nhỏ trước khi code
5. **Graph:** vẽ adjacency list ra giấy trước khi BFS/DFS
6. **Stuck?** Mở `/explain` trong UI hoặc xem `solution` trong `problem_bank.json`
7. **Visualize:** [VisuAlgo.net](https://visualgo.net) — đặc biệt cho BST remove, AVL rotation, heap

---

*File này đi kèm `instruction_dsa_promt.md` (luyện tập) và `CURRICULUM_COVERAGE.md` (mapping bài tập).*
