// import extractUUID from '../helpers/extract-uuid';

// typical mirage config export
// http://www.ember-cli-mirage.com/docs/v0.4.x/configuration/
export default function config() {
  // const server = this;

  // okapi endpoints
  this.get('/_/version', () => '0.0.0');

  this.get('_/proxy/tenants/:id/modules', []);

  this.get('/saml/check', {
    ssoEnabled: false
  });

  this.get('/configurations/entries', {
    configs: []
  });

  this.post('/bl-users/login?expandPermissions=true&fullPermissions=true', () => {
    return new Response(201, {
      'X-Okapi-Token': `myOkapiToken:${Date.now()}`
    }, {
      user: {
        id: 'test',
        username: 'testuser',
        personal: {
          lastName: 'User',
          firstName: 'Test',
          email: 'user@folio.org',
        }
      },
      permissions: {
        permissions: []
      }
    });
  });

  // this.namespace = '/fincconfig';

  // add just one instance
  // this.get('/fincconfig/metadata-sources', {
  //   id: '1',
  //   label: 'source 1',
  //   description: 'Requires urgent attention',
  //   status: 'active',
  //   sourceId: 3
  // });

  // add array of instances
  // this.get('/metadata-sources', () => {
  //   const sources = [];
  //   let i = 0;

  //   for (i = 0; i < 25; i++) {
  //     sources.push({
  //       id: i,
  //       label: 'source ' + i,
  //       description: 'description ' + i,
  //       status: 'active',
  //     });
  //   }

  //   return sources;
  // });

  // this.get('/fincconfig/metadata-sources', {
  //   metadatasources:[
  //     {
  //   id: '1',
  //   label: 'source 1',
  //   description: 'Requires urgent attention',
  //   status: 'active',
  //   sourceId: 3
  //     },
  //     {
  //       id: '2',
  //       label: 'source 2',
  //       description: 'Requires urgent attention',
  //       status: 'active',
  //       sourceId: 3
  //     },
  //   ]
  // });


  // return a model, which will pass through the serializer:
  this.get('/finc-config/isils', ({ isils }) => {
    return isils.all();
  });
  this.get('/finc-config/metadata-sources', ({ fincConfigMetadataSources }) => {
    return fincConfigMetadataSources.all();
  });
  this.get('/finc-config/metadata-sources/:id', (schema, request) => {
    return schema.fincConfigMetadataSources.find(request.params.id).attrs;
  });
  this.put('/finc-config/metadata-sources/:id', (schema, request) => {
    return schema.fincConfigMetadataSources.find(request.params.id).attrs;
  });
  // this.post('/finc-config/metadata-sources/', (schema, { requestBody }) => {
  //   const source = JSON.parse(requestBody);
  //   return server.create('finc-config-metadata-source', source);
  // });

  this.get('/finc-config/metadata-collections', ({ fincConfigMetadataCollections }) => {
    return fincConfigMetadataCollections.all();
  });
  this.get('/finc-config/metadata-collections/:id', (schema, request) => {
    return schema.fincConfigMetadataCollections.find(request.params.id).attrs;
  });
  this.put('/finc-config/metadata-collections/:id', (schema, request) => {
    return schema.fincConfigMetadataCollections.find(request.params.id).attrs;
  });
  this.get('/finc-config/tiny-metadata-sources', ({ tinyMetadataSources }) => {
    return tinyMetadataSources.all();
  });
  this.get('/finc-config/contacts', ({ contacts }) => {
    return contacts.all();
  });
}
