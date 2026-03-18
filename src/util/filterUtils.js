export const buildFilterState = (configs) => Object.fromEntries(
  configs.map(filter => [
    filter.name,
    filter.values.map(({ cql, name }) => ({ value: cql, label: name })),
  ])
);
