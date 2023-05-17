import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { noop } from 'lodash';
import { render } from '@testing-library/react';

import { StripesContext, useStripes } from '@folio/stripes/core';
import { StripesConnectedSource } from '@folio/stripes/smart-components';

import withIntlConfiguration from '../../../test/jest/helpers/withIntlConfiguration';
import metadatasources from '../../../test/fixtures/metadatasources';
import MetadataSources from './MetadataSources';

const filterData = { contacts: [
  {
    'externalId': 'fcfaca0b-12e7-467e-b503-d44a44d60a62',
    'name': 'Doe, John',
  },
  {
    'externalId': '01771c0a-a890-4488-b5e9-366aa697bd93',
    'name': 'Doe, Jane',
  }
] };

const testSource = {
  logger: { log: noop },
  mutator: { sources: {}, query: {}, resultCount: {} },
  props: { history: {}, location: {}, match: {}, staticContext: undefined, children: {} },
  recordsObj: {},
  resources: {
    sources: {},
    query: { query: '', filters: 'status.active,status.implementation', sort: 'label' },
    resultCount: 30
  }
};

const connectedTestSource = new StripesConnectedSource(testSource.props, testSource.logger, 'sources');

const renderMetadataSources = (stripes) => (
  render(withIntlConfiguration(
    <Router>
      <StripesContext.Provider value={stripes}>
        <MetadataSources
          contentData={metadatasources}
          source={connectedTestSource}
          filterData={filterData}
          onNeedMoreData={jest.fn()}
          queryGetter={jest.fn()}
          querySetter={jest.fn()}
          searchString={'status.active,status.implementation'}
          selectedRecordId={''}
          onChangeIndex={jest.fn()}
        />
      </StripesContext.Provider>
    </Router>
  ))
);

jest.unmock('react-intl');

describe('Sources SASQ View', () => {
  let stripes;

  beforeEach(() => {
    stripes = useStripes();
    renderMetadataSources(stripes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('pane sourceresults should be visible', () => {
    expect(document.querySelector('#pane-sourceresults-content')).toBeInTheDocument();
  });

  describe('check the source filter elements', () => {
    it('contact filter should be present', () => {
      expect(document.querySelector('#filter-accordion-contact')).toBeInTheDocument();
    });

    it('status filter should be present', () => {
      expect(document.querySelector('#filter-accordion-status')).toBeInTheDocument();
    });

    it('solrShard filter should be present', () => {
      expect(document.querySelector('#filter-accordion-solrShard')).toBeInTheDocument();
    });

    it('reset all button should be present', () => {
      expect(document.querySelector('#clickable-reset-all')).toBeInTheDocument();
    });

    it('submit button should be present', () => {
      expect(document.querySelector('#sourceSubmitSearch')).toBeInTheDocument();
    });

    it('search field should be present', () => {
      expect(document.querySelector('#sourceSearchField')).toBeInTheDocument();
    });
  });

  // TODO: list of results will not rendered yet
  it('should have proper list results size', () => {
    // pane is rendered:
    expect(document.querySelector('#pane-sourceresults')).toBeInTheDocument();
    // MultiColumnList is NOT rendered:
    // expect(document.querySelector('#list-sources')).toBeInTheDocument();
  });
});
