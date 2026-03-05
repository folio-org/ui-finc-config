import { useEffect } from 'react';

import {
  FilterConfigEntry,
  FilterOption,
  FilterState,
} from '../types';

export const useUpdatedFilters = ({
  dynamicKey,
  filterConfig,
  filterData,
  filterState,
  setFilterState,
}: {
  dynamicKey: string;
  filterConfig: FilterConfigEntry[];
  filterData: Record<string, FilterOption[]>;
  filterState: FilterState;
  setFilterState: React.Dispatch<React.SetStateAction<FilterState>>;
}) => {
  useEffect(() => {
    const newState: FilterState = {};
    const arr: FilterState = {};

    for (const filter of filterConfig) {
      const newValues: Array<{ value: string; label: string }> = [];
      let values: FilterOption[] = [];

      if (filter.name === dynamicKey) {
        // get filter values from okapi
        values = filterData[dynamicKey] || [];
      } else {
        // get filte values from filterConfig
        values = filter.values;
      }

      for (const key of values) {
        newValues.push({
          value: key.cql,
          label: key.name,
        });
      }

      arr[filter.name] = newValues;

      if (
        filterState[filter.name] &&
          arr[filter.name].length !== filterState[filter.name].length
      ) {
        newState[filter.name] = arr[filter.name];
      }
    }

    if (Object.keys(newState).length) {
      setFilterState((prevState) => ({ ...prevState, ...newState }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData, filterState, dynamicKey]);
};
