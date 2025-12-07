/**
 * Move item in an array from its index to the end.
 */
export function moveItemToEnd<T>(arr: T[], from: number): T[] {
  return [
    ...arr.slice(0, from),
    ...arr.slice(from + 1),
    arr[from],
  ];
}


/**
 * Wait a certain number of milliseconds.
 */
export function tick(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}
