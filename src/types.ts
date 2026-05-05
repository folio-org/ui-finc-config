export type ActiveFilters = Record<string, string[]>;

export interface FilterHandlers {
  clearGroup: (key: string) => void;
  state: (filters: ActiveFilters) => void;
}

export interface MdSource {
  id: string;
  label: string;
}

export interface Contact {
  externalId: string;
  name: string;
}
