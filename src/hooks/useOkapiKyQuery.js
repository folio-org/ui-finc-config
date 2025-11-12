import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useOkapiKyQuery = ({ queryKey, id, api, params = {}, options = {} }) => {
  if (!api) throw new Error('useOkapiKyQuery requires an "api" parameter');

  const ky = useOkapiKy();
  const url = id ? `${api}/${id}` : api;
  const key = Array.isArray(queryKey) ? queryKey : [queryKey ?? url, params];

  return useQuery(
    key,
    () => {
      return ky.get(url, { searchParams: params }).json();
    },
    options
  );
};
