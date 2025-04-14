import { useEffect } from 'react';

const useUpdatedFilters = ({
  dynamicKey,
  filterConfig,
  filterData,
  filterState,
  setFilterState,
}) => {
  useEffect(() => {
    const newState = {};
    const arr = [];

    filterConfig.forEach((filter) => {
      const newValues = [];
      let values = {};

      if (filter === dynamicKey) {
        // get filter values from okapi
        values = filterData[filter] || [];
      } else {
        // get filte values from filterConfig
        values = filter.values;
      }

      values.forEach((key) => {
        newValues.push({
          value: key.cql,
          label: key.name,
        });
      });

      arr[filter.name] = newValues;

      if (
        filterState[filter.name] &&
          arr[filter.name].length !== filterState[filter.name].length
      ) {
        newState[filter.name] = arr[filter.name];
      }
    });

    if (Object.keys(newState).length) {
      setFilterState((prevState) => ({ ...prevState, ...newState }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData, filterState, dynamicKey]);
};

export default useUpdatedFilters;
