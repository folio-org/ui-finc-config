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

jest.mock('@folio/stripes/core'); // Wichtiger Schritt, damit wir den zentralen Mock nutzen

describe('useOkapiKyMutation', () => {
  const api = '/api/sources';
  const queryKy = 'QK_SOURCES';
  const id = '123';
  let queryClient;

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    queryClient = new QueryClient();
  });

  it('should call POST with correct payload', async () => {
    const mockPost = jest.fn(() => Promise.resolve());
    useOkapiKy.mockReturnValue({
      post: mockPost,
    });

    const { result } = renderHook(
      () => useOkapiKyMutation(queryKy, id, api, 'POST'),
      { wrapper }
    );

    const payload = { name: 'Test Source' };
    await result.current.mutateAsync(payload);

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(api, { json: { ...payload, id } });
    });
  });

  it('should call PUT with correct payload and URL', async () => {
    const mockPut = jest.fn(() => Promise.resolve());
    useOkapiKy.mockReturnValue({
      put: mockPut,
    });

    const { result } = renderHook(
      () => useOkapiKyMutation(queryKy, id, api, 'PUT'),
      { wrapper }
    );

    const payload = { name: 'Updated Source' };
    await result.current.mutateAsync(payload);

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockPut).toHaveBeenCalledWith(`${api}/${id}`, { json: payload });
    });
  });

  it('should call DELETE with correct URL', async () => {
    const mockDelete = jest.fn(() => Promise.resolve());
    useOkapiKy.mockReturnValue({
      delete: mockDelete,
    });

    const { result } = renderHook(
      () => useOkapiKyMutation(queryKy, id, api, 'DELETE'),
      { wrapper }
    );

    await result.current.mutateAsync();

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(`${api}/${id}`);
    });
  });
});
