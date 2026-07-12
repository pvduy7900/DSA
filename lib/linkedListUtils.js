export class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

export function listToLinkedList(values) {
  const dummy = new ListNode(0);
  let current = dummy;
  for (const value of values) {
    current.next = new ListNode(value);
    current = current.next;
  }
  return dummy.next;
}

export function linkedListToList(head) {
  const result = [];
  while (head) {
    result.push(head.val);
    head = head.next;
  }
  return result;
}
