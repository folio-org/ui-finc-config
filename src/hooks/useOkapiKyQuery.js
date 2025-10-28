import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useOkapiKyQuery = ({ queryKey, id, api, params = {}, options = {} }) => {
  const ky = useOkapiKy();

  return useQuery(
    [...(Array.isArray(queryKey) ? queryKey : [queryKey])],
    () => {
      const url = id ? `${api}/${id}` : api;

      return ky.get(url, { searchParams: params }).json();
    },
    {
      enabled: id ? !!id : (options.enabled !== undefined ? options.enabled : true),
      ...options,
    }
  );
};
