import type { IntlShape } from 'react-intl';

import { buildFilterState } from './filterUtils';

const formatMessage = (({ id }: { id: string }) => `translated:${id}`) as unknown as IntlShape['formatMessage'];

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
        { value: 'cql1', label: 'translated:name1' },
        { value: 'cql2', label: 'translated:name2' },
      ],
      filter2: [{ value: 'cql3', label: 'translated:name3' }],
    };

    expect(buildFilterState(configs, formatMessage)).toEqual(expected);
  });

  it('should skip translation when translate is false', () => {
    const configs = [
      {
        name: 'filter1',
        values: [{ cql: 'cql1', name: 'UBL main', translate: false }],
      },
    ];

    expect(buildFilterState(configs, formatMessage)).toEqual({
      filter1: [{ value: 'cql1', label: 'UBL main' }],
    });
  });

  it('should handle empty configs', () => {
    expect(buildFilterState([], formatMessage)).toEqual({});
  });

  it('should handle configs with empty values', () => {
    expect(buildFilterState([{ name: 'filter1', values: [] }], formatMessage)).toEqual({
      filter1: [],
    });
  });
});
