interface FilterValue {
  cql: string;
  name: string;
}

interface FilterConfig {
  name: string;
  values: FilterValue[];
}

export const buildFilterState = (
  configs: FilterConfig[],
  formatMessage: (descriptor: { id: string }) => string
) => Object.fromEntries(
  configs.map(filter => [
    filter.name,
    filter.values.map(({ cql, name }) => ({ value: cql, label: formatMessage({ id: name }) })),
  ])
);
