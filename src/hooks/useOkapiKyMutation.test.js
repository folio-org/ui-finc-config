import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { useOkapiKyMutation } from './useOkapiKyMutation';

describe('useOkapiKyMutation', () => {
  const api = '/api/sources';
  const mutationKey = 'QK_SOURCES';
  const id = '123';
  let queryClient;
  let mockRequest;

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const doMockRequest = (method) => {
    if (method === 'post') {
      mockRequest = jest.fn(() => Promise.resolve({
        json: jest.fn(() => Promise.resolve({ id: '123456' })),
      }));
    } else {
      mockRequest = jest.fn(() => Promise.resolve());
    }

    useOkapiKy.mockReturnValue({
      [method]: mockRequest,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient();
  });

  it('should call POST with id and correct payload', async () => {
    doMockRequest('post');

    const { result: requestResult } = renderHook(
      () => useOkapiKyMutation({ mutationKey, id, api }),
      { wrapper }
    );

    const { result } = renderHook(() => requestResult.current.useCreate(), { wrapper });

    const payload = { name: 'Test Source' };
    result.current.mutateAsync(payload);

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledWith(api, { json: { ...payload, id } });
    });
  });

  it('should call POST without id, but correct payload', async () => {
    doMockRequest('post');

    const { result: requestResult } = renderHook(
      () => useOkapiKyMutation({ mutationKey, id: undefined, api }),
      { wrapper }
    );

    const { result } = renderHook(() => requestResult.current.useCreate(), { wrapper });

    const payload = { name: 'Test Source' };
    result.current.mutateAsync(payload);

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledWith(api, { json: payload });
    });
  });

  it('should call PUT with correct payload and URL', async () => {
    doMockRequest('put');

    const { result: requestResult } = renderHook(
      () => useOkapiKyMutation({ mutationKey, id, api }),
      { wrapper }
    );

    const { result } = renderHook(() => requestResult.current.useUpdate(), { wrapper });

    const payload = { name: 'Updated Source' };
    result.current.mutateAsync(payload);

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledWith(`${api}/${id}`, { json: payload });
    });
  });

  it('should call DELETE with correct URL', async () => {
    doMockRequest('delete');

    const { result: requestResult } = renderHook(
      () => useOkapiKyMutation({ mutationKey, id, api }),
      { wrapper }
    );

    const { result } = renderHook(() => requestResult.current.useDelete(), { wrapper });

    result.current.mutateAsync();

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledWith(`${api}/${id}`);
    });
  });
});
