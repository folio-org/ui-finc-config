import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    name: 'metadataAvailable',
    cql: 'metadataAvailable',
    values: [
      { name: <FormattedMessage id="ui-finc-config.dataOption.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-finc-config.dataOption.no" />, cql: 'no' },
      { name: <FormattedMessage id="ui-finc-config.dataOption.undetermined" />, cql: 'undetermined' }
    ],
  },
  {
    name: 'usageRestricted',
    cql: 'usageRestricted',
    values: [
      { name: <FormattedMessage id="ui-finc-config.dataOption.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-finc-config.dataOption.no" />, cql: 'no' }
    ],
  },
  {
    name: 'freeContent',
    cql: 'freeContent',
    values: [
      { name: <FormattedMessage id="ui-finc-config.dataOption.yes" />, cql: 'yes' },
      { name: <FormattedMessage id="ui-finc-config.dataOption.no" />, cql: 'no' },
      { name: <FormattedMessage id="ui-finc-config.dataOption.undetermined" />, cql: 'undetermined' }
    ],
  },
  {
    name: 'mdSource',
    cql: 'mdSource.id',
    operator: '==',
    values: [],
  }
];

export default filterConfig;
