// @ts-expect-error: @folio/jest-config-stripes provides no type declarations
import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { usePrevious } from './usePrevious';

describe('usePrevious', () => {
  it('returns undefined on initial render', () => {
    const { result } = renderHook(() => usePrevious('first'));
    expect(result.current).toBeUndefined();
  });

  it('returns the previous value after a re-render', () => {
    const { result, rerender } = renderHook(({ value }: { value: string }) => usePrevious(value), {
      initialProps: { value: 'first' },
    });

    rerender({ value: 'second' });
    expect(result.current).toBe('first');
  });

  it('returns the second value after two re-renders', () => {
    const { result, rerender } = renderHook(({ value }: { value: string }) => usePrevious(value), {
      initialProps: { value: 'first' },
    });

    rerender({ value: 'second' });
    rerender({ value: 'third' });
    expect(result.current).toBe('second');
  });
});
