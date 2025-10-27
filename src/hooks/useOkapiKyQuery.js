import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useOkapiKyQuery = ({ queryKey, id, api, options = {} }) => {
  const ky = useOkapiKy();

  return useQuery(
    [...(Array.isArray(queryKey) ? queryKey : [queryKey])],
    () => ky.get(`${api}/${id}`).json(),
    {
      // The query will not execute until the id exists
      enabled: !!id,
      ...options,
    }
  );
};
