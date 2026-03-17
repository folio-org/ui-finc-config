interface FilterValue {
  cql: string;
  name: string;
  translate?: boolean;
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
    filter.values.map(({ cql, name, translate = true }) => (
      { value: cql, label: translate ? formatMessage({ id: name }) : name }
    )),
  ])
);
