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
  const queryKey = ['QK_SOURCES'];
  const id = '123';
  let queryClient;

  const mockData = { name: 'Test Source', id };
  const mockListData = [
    { name: 'Test Source 1', id: '111' },
    { name: 'Test Source 2', id: '222' },
  ];

  const mockGet = jest.fn((url) => ({
    json: async () => (url.includes(id) ? mockData : mockListData),
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

    expect(mockGet).toHaveBeenCalledWith(`${api}/${id}`, { searchParams: {} });
    expect(result.current.data).toEqual(mockData);
  });

  it('should not fetch if query is disabled', async () => {
    const { result } = renderHook(
      () => useOkapiKyQuery({ queryKey, id: undefined, api, options: { enabled: false } }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isIdle).toBe(true));
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('should fetch list of resources when id is not provided', async () => {
    const { result } = renderHook(
      () => useOkapiKyQuery({ queryKey, api }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockGet).toHaveBeenCalledWith(api, { searchParams: {} });
    expect(result.current.data).toEqual(mockListData);
  });

  it('should call GET with correct params', async () => {
    const params = { limit: 10, offset: 5 };

    renderHook(
      () => useOkapiKyQuery({ queryKey, id, api, params }),
      { wrapper }
    );

    await waitFor(() => expect(mockGet).toHaveBeenCalledWith(`${api}/${id}`, { searchParams: params }));
  });
});
