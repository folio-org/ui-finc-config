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
          case 'post': {
            const response = await ky.post(api, { json: id ? { ...payload, id } : payload });
            return response.json();
          }

          case 'put':
            if (!id) throw new Error('PUT requires an "id"');
            await ky.put(`${api}/${id}`, { json: payload });

            return null;

          case 'delete':
            if (!id) throw new Error('DELETE requires an "id"');

            if (usePayload) {
              await ky.delete(`${api}/${id}`, { json: payload });
            } else {
              await ky.delete(`${api}/${id}`);
            }

            return null;

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
