import {
  beforeEach,
  describe,
  it
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import CollectionDetailsPage from '../interactors/collection-details-page';
import CollectionInteractor from '../interactors/collection';

describe('CollectionDetailsPage', () => {
  setupApplication();
  const collectionDetailsPage = new CollectionDetailsPage();
  const collectionInteractor = new CollectionInteractor();

  let collection = null;

  beforeEach(async function () {
    collection = this.server.create('finc-config-metadata-collection');
    await this.visit('/finc-config/metadata-collections?filters=metadataAvailable.Yes');

    // click checkbox not working always
    // await collectionInteractor.clickMetadataAvailableCOLLECTIONsCheckbox();
  });

  it('shows the list of collection items', () => {
    expect(collectionInteractor.isVisible).to.equal(true);
  });

  it('renders each collection-instance', () => {
    expect(collectionInteractor.instances().length).to.be.gte(1);
  });

  describe('clicking on the first collection', function () {
    beforeEach(async function () {
      await collectionInteractor.instances(0).click();
    });

    it('displays collection label in the pane header', function () {
      expect(collectionDetailsPage.title).to.include(collection.label);
    });

    it('all accordions in collection-instance are present', function () {
      expect(collectionDetailsPage.managementAccordion.isPresent).to.equal(true);
      expect(collectionDetailsPage.technicalAccordion.isPresent).to.equal(true);
    });
  });
});