import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { HTTP_METHODS } from '../util/constants';

export const useOkapiKyMutation = (queryKey, id, api, method = HTTP_METHODS.POST, options = {}) => {
  const ky = useOkapiKy();

  return useMutation({
    mutationKey: [queryKey],
    mutationFn: (payload) => {
      if (method === HTTP_METHODS.POST) return ky.post(api, { json: id ? { ...payload, id } : payload });
      if (method === HTTP_METHODS.PUT) return ky.put(`${api}/${id}`, { json: payload });
      if (method === HTTP_METHODS.DELETE) return ky.delete(`${api}/${id}`);
      throw new Error(`Unsupported API method: ${method}`);
    },
    ...options,
  });
};
