/* istanbul ignore file */

// default scenario is used during `yarn start --mirage`
export default function defaultScenario(server) {
  server.create('finc-config-metadata-source');
  server.create('finc-config-metadata-collection');
  server.create('tiny-metadata-source');
  server.create('isil');
  server.create('contact');
}
