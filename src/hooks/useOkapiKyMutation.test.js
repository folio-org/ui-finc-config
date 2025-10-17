import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { HTTP_METHODS } from '../util/constants';
import { useOkapiKyMutation } from './useOkapiKyMutation';

describe('useOkapiKyMutation', () => {
  const api = '/api/sources';
  const queryKey = 'QK_SOURCES';
  const id = '123';
  let queryClient;
  let mockRequest;

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const doMockRequest = (method) => {
    mockRequest = jest.fn(() => Promise.resolve());
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

    const { result } = renderHook(
      () => useOkapiKyMutation({ queryKey, id, api, method: HTTP_METHODS.POST }),
      { wrapper }
    );

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

    const { result } = renderHook(
      () => useOkapiKyMutation({ queryKey, id: undefined, api, method: HTTP_METHODS.POST }),
      { wrapper }
    );

    const payload = { name: 'Test Source' };
    result.current.mutateAsync(payload);

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledWith(api, { json: payload });
    });
  });

  it('should call PUT with correct payload and URL', async () => {
    doMockRequest('put');

    const { result } = renderHook(
      () => useOkapiKyMutation({ queryKey, id, api, method: HTTP_METHODS.PUT }),
      { wrapper }
    );

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

    const { result } = renderHook(
      () => useOkapiKyMutation({ queryKey, id, api, method: HTTP_METHODS.DELETE }),
      { wrapper }
    );

    result.current.mutateAsync();

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockRequest).toHaveBeenCalledWith(`${api}/${id}`);
    });
  });

  it('should throw an error for unsupported HTTP method', async () => {
    const { result } = renderHook(
      () => useOkapiKyMutation({ queryKey, id, api, method: 'PATCH' }),
      { wrapper }
    );

    // promis will be rejected with error
    await expect(result.current.mutateAsync({})).rejects.toThrow('Unsupported HTTP method: PATCH');
  });
});
