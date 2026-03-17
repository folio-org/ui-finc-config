const filterConfig = [
  {
    label: 'Implementation Status',
    name: 'status',
    cql: 'status',
    values: [
      { name: 'ui-finc-config.dataOption.active', cql: 'active' },
      { name: 'ui-finc-config.dataOption.request', cql: 'request' },
      { name: 'ui-finc-config.dataOption.implementation', cql: 'implementation' },
      { name: 'ui-finc-config.dataOption.closed', cql: 'closed' },
      { name: 'ui-finc-config.dataOption.impossible', cql: 'impossible' },
    ],
  },
  {
    label: 'Solr Shard',
    name: 'solrShard',
    cql: 'solrShard',
    values: [
      { name: 'UBL main', cql: 'UBL main', translate: false },
      { name: 'UBL ai', cql: 'UBL ai', translate: false },
      { name: 'UBL DNB', cql: 'UBL DNB', translate: false },
      { name: 'SLUB dswarm', cql: 'SLUB dswarm', translate: false },
      { name: 'SLUB DBoD', cql: 'SLUB DBoD', translate: false },
    ],
  },
  {
    label: 'Contact',
    name: 'contact',
    cql: 'contacts=/@externalId',
    operator: ' ',
    values: [] as { name: string; cql: string }[],
  },
];

export default filterConfig;
