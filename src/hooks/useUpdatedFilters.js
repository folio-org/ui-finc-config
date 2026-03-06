import { useEffect } from 'react';

export const useUpdatedFilters = ({
  filterConfig,
  filterState,
  setFilterState,
}) => {
  useEffect(() => {
    const newState = {};

    for (const filter of filterConfig) {
      const newValues = filter.values.map(
        ({ cql, name }) => ({ value: cql, label: name })
      );

      if (filterState[filter.name]?.length !== newValues.length) {
        newState[filter.name] = newValues;
      }
    }

    if (Object.keys(newState).length) {
      setFilterState((prevState) => ({ ...prevState, ...newState }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState, filterConfig]);
};
