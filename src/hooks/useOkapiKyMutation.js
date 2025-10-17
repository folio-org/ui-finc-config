import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { HTTP_METHODS } from '../util/constants';

export const useOkapiKyMutation = ({
  queryKey,
  api,
  id,
  method = HTTP_METHODS.POST,
  options = {},
} = {}) => {
  if (!api) throw new Error('useOkapiKyMutation requires an "api" parameter');

  const ky = useOkapiKy();

  return useMutation({
    ...(queryKey && { mutationKey: Array.isArray(queryKey) ? queryKey : [queryKey] }),
    mutationFn: async (payload) => {
      switch (method) {
        case HTTP_METHODS.POST:
          return ky.post(api, { json: id ? { ...payload, id } : payload });

        case HTTP_METHODS.PUT:
          if (!id) throw new Error('PUT requires an "id"');
          return ky.put(`${api}/${id}`, { json: payload });

        case HTTP_METHODS.DELETE:
          if (!id) throw new Error('DELETE requires an "id"');
          return ky.delete(`${api}/${id}`);

        default:
          throw new Error(`Unsupported HTTP method: ${method}`);
      }
    },
    ...options,
  });
};
