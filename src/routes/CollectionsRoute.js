import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { Layout } from '@folio/stripes/components';
import {
  makeQueryFunction,
  StripesConnectedSource
} from '@folio/stripes/smart-components';

import MetadataCollections from '../components/MetadataCollections/MetadataCollections';
import filterConfig from '../components/MetadataCollections/filterConfigData';
import urls from '../components/DisplayUtils/urls';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class CollectionsRoute extends React.Component {
  static manifest = Object.freeze({
    collections: {
      type: 'okapi',
      records: 'fincConfigMetadataCollections',
      recordsRequired: '%{resultCount}',
      perRequest: 30,
      path: 'finc-config/metadata-collections',
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(label="%{query.query}*" or description="%{query.query}*" or collectionId="%{query.query}*")',
            {
              'label': 'label',
              'description': 'description',
              'collectionId': 'collectionId',
            },
            filterConfig,
            2,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    mdSources: {
      type: 'okapi',
      records: 'tinyMetadataSources',
      path: 'finc-config/tiny-metadata-sources',
      resourceShouldRefresh: true
    },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
  });

  static propTypes = {
    children: PropTypes.node,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
    mutator: PropTypes.object,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func,
      logger: PropTypes.object,
    }),
  }

  constructor(props) {
    super(props);

    this.logger = props.stripes.logger;
    this.searchField = React.createRef();

    this.state = {
      hasPerms: props.stripes.hasPerm('finc-config.metadata-collections.collection.get'),
    };
  }

  componentDidMount() {
    this.collection = new StripesConnectedSource(this.props, this.logger, 'collections');

    if (this.searchField.current) {
      this.searchField.current.focus();
    }
  }

  componentDidUpdate(prevProps) {
    const newCount = this.collection.totalCount();
    const newRecords = this.collection.records();

    if (newCount === 1) {
      const { history, location } = this.props;

      const prevSource = new StripesConnectedSource(prevProps, this.logger, 'collections');
      const oldCount = prevSource.totalCount();
      const oldRecords = prevSource.records();

      if (oldCount !== 1 || (oldCount === 1 && oldRecords[0].id !== newRecords[0].id)) {
        const record = newRecords[0];
        history.push(`${urls.collectionView(record.id)}${location.search}`);
      }
    }
  }

  querySetter = ({ nsValues }) => {
    this.props.mutator.query.update(nsValues);
  };

  queryGetter = () => {
    return _.get(this.props.resources, 'query', {});
  };

  handleNeedMoreData = () => {
    if (this.collection) {
      this.collection.fetchMore(RESULT_COUNT_INCREMENT);
    }
  };

  // add update if search-selectbox is changing
  onChangeIndex = (qindex) => {
    this.props.mutator.query.update({ qindex });
  };

  render() {
    const { location, match, children, resources } = this.props;

    if (this.collection) {
      this.collection.update(this.props, 'collections');
    }

    if (!this.state.hasPerms) {
      return (
        <Layout className="textCentered">
          <h2><FormattedMessage id="stripes-smart-components.permissionError" /></h2>
          <p><FormattedMessage id="stripes-smart-components.permissionsDoNotAllowAccess" /></p>
        </Layout>
      );
    }

    return (
      <MetadataCollections
        contentData={_.get(resources, 'collections.records', [])}
        collection={this.collection}
        filterData={{ mdSources: _.get(resources, 'mdSources.records', []) }}
        onNeedMoreData={this.handleNeedMoreData}
        queryGetter={this.queryGetter}
        querySetter={this.querySetter}
        searchString={location.search}
        selectedRecordId={match.params.id}
        searchField={this.searchField}
        // add values for search-selectbox
        onChangeIndex={this.onChangeIndex}
      >
        {children}
      </MetadataCollections>
    );
  }
}

export default stripesConnect(CollectionsRoute);
