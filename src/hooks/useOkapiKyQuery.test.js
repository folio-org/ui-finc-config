import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useOkapiKyQuery } from './useOkapiKyQuery';

describe('useOkapiKyQuery', () => {
  const api = '/api/sources';
  const queryKey = 'QK_SOURCES';
  const id = '123';
  let queryClient;

  const mockData = { name: 'Test Source', id };
  const mockGet = jest.fn(() => ({
    json: async () => mockData,
  }));
  useOkapiKy.mockReturnValue({ get: mockGet });

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should fetch data correctly when id is provided', async () => {
    const { result } = renderHook(
      () => useOkapiKyQuery({ queryKey, id, api }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGet).toHaveBeenCalledWith(`${api}/${id}`);
    expect(result.current.data).toEqual(mockData);
  });

  it('should not fetch if id is undefined', async () => {
    const { result } = renderHook(
      () => useOkapiKyQuery({ queryKey, undefined, api }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isIdle).toBe(true));
    expect(mockGet).not.toHaveBeenCalled();
  });
});
