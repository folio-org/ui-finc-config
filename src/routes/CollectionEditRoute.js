import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import MetadataCollectionForm from '../components/MetadataCollections/MetadataCollectionForm';
import urls from '../components/DisplayUtils/urls';

class CollectionEditRoute extends React.Component {
  static manifest = Object.freeze({
    collections: {
      type: 'okapi',
      path: 'finc-config/metadata-collections/:{id}',
      shouldRefresh: () => false,
    },
  });

  constructor(props) {
    super(props);

    this.state = {
      hasPerms: props.stripes.hasPerm('finc-config.metadata-collections.item.put')
    };
  }

  getInitialValues = () => {
    const initialValues = _.get(this.props.resources, 'collections.records', []).find(i => i.id === this.props.match.params.id);

    return initialValues;
  }

  handleClose = () => {
    const { location, match } = this.props;
    this.props.history.push(`${urls.collectionView(match.params.id)}${location.search}`);
  }

  handleSubmit = (collection) => {
    const { history, location, mutator } = this.props;

    mutator.collections
      .PUT(collection)
      .then(({ id }) => {
        history.push(`${urls.collectionView(id)}${location.search}`);
      });
  }

  deleteCollection = (collection) => {
    const { history, location, mutator } = this.props;

    mutator.collections.DELETE({ collection }).then(() => {
      history.push(`${urls.collections()}${location.search}`);
    });
  }

  fetchIsPending = () => {
    return Object.values(this.props.resources)
      .filter(resource => resource)
      .some(resource => resource.isPending);
  }

  render() {
    if (!this.state.hasPerms) return <div><FormattedMessage id="ui-finc-config.noPermission" /></div>;
    if (this.fetchIsPending()) return 'loading';

    return (
      <MetadataCollectionForm
        handlers={{ onClose: this.handleClose }}
        initialValues={this.getInitialValues()}
        isLoading={this.fetchIsPending()}
        onDelete={this.deleteCollection}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

CollectionEditRoute.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  mutator: PropTypes.shape({
    collections: PropTypes.shape({
      PUT: PropTypes.func.isRequired,
      DELETE: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  resources: PropTypes.shape({
    collection: PropTypes.object,
  }).isRequired,
  stripes: PropTypes.shape({
    hasPerm: PropTypes.func.isRequired,
  }).isRequired,
};

export default stripesConnect(CollectionEditRoute);
