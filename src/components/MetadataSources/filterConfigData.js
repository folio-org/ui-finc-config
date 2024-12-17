import { FormattedMessage } from 'react-intl';

const filterConfig = [
  {
    label: 'Implementation Status',
    name: 'status',
    cql: 'status',
    values: [
      { name: <FormattedMessage id="ui-finc-config.dataOption.active" />, cql: 'active' },
      { name: <FormattedMessage id="ui-finc-config.dataOption.request" />, cql: 'request' },
      { name: <FormattedMessage id="ui-finc-config.dataOption.implementation" />, cql: 'implementation' },
      { name: <FormattedMessage id="ui-finc-config.dataOption.closed" />, cql: 'closed' },
      { name: <FormattedMessage id="ui-finc-config.dataOption.impossible" />, cql: 'impossible' },
    ],
  },
  {
    label: 'Solr Shard',
    name: 'solrShard',
    cql: 'solrShard',
    values: [
      { name: 'UBL main', cql: 'UBL main' },
      { name: 'UBL ai', cql: 'UBL ai' },
      { name: 'UBL DNB', cql: 'UBL DNB' },
      { name: 'SLUB dswarm', cql: 'SLUB dswarm' },
      { name: 'SLUB DBoD', cql: 'SLUB DBoD' },
    ],
  },
  {
    label: 'Contact',
    name: 'contact',
    cql: 'contacts=/@externalId',
    operator: ' ',
    values: [],
  }
];

export default filterConfig;
