import { buildFilterState } from './filterUtils';

describe('buildFilterState', () => {
  it('should build filter state from configs', () => {
    const configs = [
      {
        name: 'filter1',
        values: [
          { cql: 'cql1', name: 'name1' },
          { cql: 'cql2', name: 'name2' },
        ],
      },
      {
        name: 'filter2',
        values: [{ cql: 'cql3', name: 'name3' }],
      },
    ];

    const expected = {
      filter1: [
        { value: 'cql1', label: 'name1' },
        { value: 'cql2', label: 'name2' },
      ],
      filter2: [{ value: 'cql3', label: 'name3' }],
    };

    expect(buildFilterState(configs)).toEqual(expected);
  });

  it('should handle empty configs', () => {
    const configs = [];
    const expected = {};
    expect(buildFilterState(configs)).toEqual(expected);
  });

  it('should handle configs with empty values', () => {
    const configs = [
      {
        name: 'filter1',
        values: [],
      },
    ];

    const expected = {
      filter1: [],
    };

    expect(buildFilterState(configs)).toEqual(expected);
  });
});
