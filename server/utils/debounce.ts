// Define a type for a generic function
type AnyFunction<T extends any[] = any[], R = any> = (...args: T) => R;

/**
 * Creates a debounced function that delays invoking `func` until after `delay`
 * milliseconds have passed since the last time the debounced function was invoked.
 * The debounced function comes with a `cancel` method to cancel delayed `func` invocations.
 *
 * @param func The function to debounce.
 * @param delay The number of milliseconds to delay.
 * @returns A new debounced function.
 */
export function debounce<T extends AnyFunction>(
  func: T,
  delay: number
): T & { cancel: () => void } {
  let timeoutId: ReturnType<typeof setTimeout> | null = null; // Store the timeout ID

  const debounced = function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ) {
    // Clear the previous timeout if it exists
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Set a new timeout
    timeoutId = setTimeout(() => {
      func.apply(this, args); // Call the original function
      timeoutId = null; // Reset timeoutId after execution
    }, delay);
  } as T & { cancel: () => void };

  // Add a cancel method to the debounced function
  debounced.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debounced;
}
