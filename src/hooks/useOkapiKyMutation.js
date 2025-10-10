import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useOkapiKyMutation = (queryKy, id, api, method = 'POST', options = {}) => {
  const ky = useOkapiKy();

  return useMutation({
    mutationKey: [queryKy],
    mutationFn: (payload) => {
      if (method === 'POST') return ky.post(api, { json: { ...payload, id } });
      if (method === 'PUT') return ky.put(`${api}/${id}`, { json: payload });
      if (method === 'DELETE') return ky.delete(`${api}/${id}`);
      throw new Error(`Unsupported API method: ${method}`);
    },
    ...options,
  });
};
