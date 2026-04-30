import { FilterConfig } from '../../util/filterUtils';

const filterConfig: FilterConfig[] = [
  {
    name: 'metadataAvailable',
    cql: 'metadataAvailable',
    operator: '=',
    values: [
      { name: 'ui-finc-config.dataOption.yes', cql: 'yes' },
      { name: 'ui-finc-config.dataOption.no', cql: 'no' },
      { name: 'ui-finc-config.dataOption.undetermined', cql: 'undetermined' },
    ],
  },
  {
    name: 'usageRestricted',
    cql: 'usageRestricted',
    operator: '=',
    values: [
      { name: 'ui-finc-config.dataOption.yes', cql: 'yes' },
      { name: 'ui-finc-config.dataOption.no', cql: 'no' },
    ],
  },
  {
    name: 'freeContent',
    cql: 'freeContent',
    operator: '=',
    values: [
      { name: 'ui-finc-config.dataOption.yes', cql: 'yes' },
      { name: 'ui-finc-config.dataOption.no', cql: 'no' },
      { name: 'ui-finc-config.dataOption.undetermined', cql: 'undetermined' },
    ],
  },
  {
    name: 'mdSource',
    cql: 'mdSource.id',
    operator: '==',
    values: [],
  },
];

export default filterConfig;
