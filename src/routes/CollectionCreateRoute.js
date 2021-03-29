import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import MetadataCollectionForm from '../components/MetadataCollections/MetadataCollectionForm';
import urls from '../components/DisplayUtils/urls';

class CollectionCreateRoute extends React.Component {
  static manifest = Object.freeze({
    collections: {
      type: 'okapi',
      path: 'finc-config/metadata-collections',
      fetch: false,
      shouldRefresh: () => false,
    },
  });

  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      collections: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      collection: PropTypes.object,
    }).isRequired,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      okapi: PropTypes.object.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      hasPerms: props.stripes.hasPerm('finc-config.metadata-collections.item.post'),
    };
  }

  handleClose = () => {
    const { location } = this.props;
    this.props.history.push(`${urls.collections()}${location.search}`);
  }

  handleSubmit = (collection) => {
    const { history, location, mutator } = this.props;

    mutator.collections
      .POST(collection)
      .then(({ id }) => {
        history.push(`${urls.collectionView(id)}${location.search}`);
      });
  }

  getInitialSolrMegaCollection = () => {
    // add first field for required repeatable field
    const solrMegaCollections = [''];

    return { solrMegaCollections };
  }

  render() {
    if (!this.state.hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;

    return (
      <MetadataCollectionForm
        handlers={{ onClose: this.handleClose }}
        initialValues={this.getInitialSolrMegaCollection()}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(CollectionCreateRoute);
