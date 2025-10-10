import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useOkapiKyQuery = (queryKey, id, api, options = {}) => {
  const ky = useOkapiKy();

  return useQuery(
    [queryKey, id],
    () => ky.get(`${api}/${id}`).json(),
    {
      enabled: !!id,
      ...options,
    }
  );
};
