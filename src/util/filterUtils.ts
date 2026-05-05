import type { IntlShape } from 'react-intl';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterValue {
  cql: string;
  name: string;
  translate?: boolean;
}

export interface FilterConfig {
  cql?: string;
  label?: string;
  name: string;
  operator?: string;
  values: FilterValue[];
}

export const buildFilterState = (
  configs: FilterConfig[],
  formatMessage: IntlShape['formatMessage']
): Record<string, FilterOption[]> => Object.fromEntries(
  configs.map(filter => [
    filter.name,
    filter.values.map(({ cql, name, translate = true }) => (
      { value: cql, label: translate ? formatMessage({ id: name }) : name }
    )),
  ])
);
