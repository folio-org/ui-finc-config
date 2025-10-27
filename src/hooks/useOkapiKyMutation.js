import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useOkapiKyMutation = ({ mutationKey, id, api } = {}) => {
  if (!api) throw new Error('useOkapiKyMutation requires an "api" parameter');

  const ky = useOkapiKy();

  const useMutationRequest = (method, { usePayload = true, ...options } = {}) => {
    return useMutation({
      ...(mutationKey && { mutationKey: Array.isArray(mutationKey) ? mutationKey : [mutationKey] }),
      mutationFn: async (payload) => {
        switch (method) {
          case 'post':
            return ky.post(api, { json: id ? { ...payload, id } : payload });
          case 'put':
            if (!id) throw new Error('PUT requires an "id"');
            return ky.put(`${api}/${id}`, { json: payload });
          case 'delete':
            if (!id) throw new Error('DELETE requires an "id"');
            return usePayload
              ? ky.delete(`${api}/${id}`, { json: payload })
              : ky.delete(`${api}/${id}`);
          default:
            throw new Error(`Unsupported HTTP method: ${method}`);
        }
      },
      ...options,
    });
  };

  return {
    useCreate: (options) => useMutationRequest('post', options),
    useUpdate: (options) => useMutationRequest('put', options),
    useDelete: (options) => useMutationRequest('delete', { ...options, usePayload: false }),
  };
};
