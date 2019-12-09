import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../helpers/setup-application';
import ApplicationInteractor from '../interactors/application';
import SourceInteractor from '../interactors/source';
import CollectionInteractor from '../interactors/collection';

describe('Navigation', () => {
  const app = new ApplicationInteractor();

  setupApplication();

  describe('open default tab', () => {
    beforeEach(async function () {
      this.visit('/finc-config/metadata-sources?filters=status.Active');
    });

    it('navigation should be present', () => {
      expect(app.navigation.isPresent).to.be.true;
    });

    describe('click on Collection Tab', () => {
      const collectionInteractor = new CollectionInteractor();

      beforeEach(async function () {
        await app.navigation.collectionNavBtn.click();
        await collectionInteractor.whenLoaded();
      });

      it('should open the collections list', () => {
        expect(collectionInteractor.isPresent).to.be.true;
      });

      it('collection tab should be primary', () => {
        expect(app.navigation.sourceNavBtn.isPrimary).to.be.false;
        expect(app.navigation.collectionNavBtn.isPrimary).to.be.true;
      });
    });

    describe('click on Source Tab', () => {
      const sourceInteractor = new SourceInteractor();

      beforeEach(async function () {
        await app.navigation.sourceNavBtn.click();
        await sourceInteractor.whenLoaded();
      });

      it('should open the sources list', () => {
        expect(sourceInteractor.isPresent).to.be.true;
      });

      it('source tab should be primary', () => {
        expect(app.navigation.sourceNavBtn.isPrimary).to.be.true;
        expect(app.navigation.collectionNavBtn.isPrimary).to.be.false;
      });
    });
  });
});
