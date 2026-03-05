export interface MdSource {
  id: string;
  label: string;
}

export interface FilterOption {
  cql: string;
  name: string;
}

export interface FilterConfigEntry {
  name: string;
  cql: string;
  operator: string;
  values: FilterOption[];
}

export type FilterState = Record<string, Array<{ value: string; label: string }>>;
