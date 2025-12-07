import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Load a script source
 */
export function useScript(url: string): void {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};

/**
 * Do setState like react class component.
 */
export function useSetState<T extends object>(
  initState: T,
): [T, (arg: Partial<T>) => void, (arg?: Partial<T>) => void] {
  const [ state, setState ] = useState<T>(initState);
  // "setState" function
  const setCustomState = useCallback((newPartialState: Partial<T>) => {
    return setState(prevState => ({ ...prevState, ...newPartialState }));
  }, []);
  // "resetState" function
  const resetState = useCallback((partialState: Partial<T> = {}) => {
    return setState(() => ({ ...initState, ...partialState }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Return
  return [state, setCustomState, resetState];
};

/**
 * When you have multiple dependencies but only want to fire the callback
 * for one of them changing.
 */
export function useOnChange<T = void>(
  cb: (prevVal?: T, newVal?: T) => void, dep: T,
): void {
  const prevVal = usePrevious(dep);
  useEffect(() => {
    if (prevVal !== dep) {
      cb(prevVal, dep);
    }
  }, [cb, dep, prevVal]);
}

/**
 * Fire a callback function when the value changes and remains a new value
 * for the give debounce time. 
 */
export function useOnDebounce<T>(
  cb: () => void,
  value: T,
  debounceMs = 300,
): void {

  // State
  const [
    timeoutInit,
    setTimeoutInit,
  ] = useState<NodeJS.Timeout | null>(null);

  // Fire the timeout function when the value changes
  useOnChange(prevVal => {
    if (timeoutInit) {
      clearTimeout(timeoutInit);
    }
    const timeoutNew = setTimeout(() => {
      if (prevVal !== value) {
        cb();
      }
    }, debounceMs);
    setTimeoutInit(timeoutNew);
  }, value);
}
