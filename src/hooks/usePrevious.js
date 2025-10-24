import {
  useEffect,
  useRef,
} from 'react';

// A hook which holds a previous value.
// Useful to hold props from a previous render.
export const usePrevious = value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};
