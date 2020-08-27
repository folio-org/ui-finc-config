const filterConfig = [
  {
    label: 'Implementation Status',
    name: 'status',
    cql: 'status',
    values: [
      { name: 'Active', cql: 'active' },
      { name: 'Wish', cql: 'wish' },
      { name: 'Implementation', cql: 'implementation' },
      { name: 'Closed', cql: 'closed' },
      { name: 'Impossible', cql: 'impossible' }
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
      { name: 'SLUB DBoD', cql: 'SLUB DBoD' }
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
