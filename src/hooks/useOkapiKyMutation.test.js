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
  const queryKy = 'QK_SOURCES';
  const id = '123';
  let queryClient;
  const mockRequest = jest.fn(() => Promise.resolve());

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient();
  });

  it('should call POST with correct payload', async () => {
    useOkapiKy.mockReturnValue({
      post: mockRequest,
    });

    const { result } = renderHook(
      () => useOkapiKyMutation(queryKy, id, api, 'POST'),
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

  it('should call PUT with correct payload and URL', async () => {
    useOkapiKy.mockReturnValue({
      put: mockRequest,
    });

    const { result } = renderHook(
      () => useOkapiKyMutation(queryKy, id, api, 'PUT'),
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
    useOkapiKy.mockReturnValue({
      delete: mockRequest,
    });

    const { result } = renderHook(
      () => useOkapiKyMutation(queryKy, id, api, 'DELETE'),
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
});
