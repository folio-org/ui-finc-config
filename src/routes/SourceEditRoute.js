import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';

import MetadataSourceForm from '../components/MetadataSources/MetadataSourceForm';
import urls from '../components/DisplayUtils/urls';

class SourceEditRoute extends React.Component {
  static manifest = Object.freeze({
    sources: {
      type: 'okapi',
      path: 'finc-config/metadata-sources/:{id}',
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
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    mutator: PropTypes.shape({
      sources: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
        DELETE: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    resources: PropTypes.object,
    stripes: PropTypes.shape({
      hasPerm: PropTypes.func.isRequired,
      okapi: PropTypes.object.isRequired,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      hasPerms: props.stripes.hasPerm('finc-config.metadata-sources.item.put')
    };
  }

  getInitialValues = () => {
    const initialValues = _.get(this.props.resources, 'sources.records', []).find(i => i.id === this.props.match.params.id);

    return initialValues;
  }

  handleClose = () => {
    const { location, match } = this.props;
    this.props.history.push(`${urls.sourceView(match.params.id)}${location.search}`);
  }

  handleSubmit = (source) => {
    const { history, location, mutator } = this.props;

    mutator.sources
      .PUT(source)
      .then(({ id }) => {
        history.push(`${urls.sourceView(id)}${location.search}`);
      });
  }

  deleteSource = (source) => {
    const { history, location, mutator } = this.props;

    mutator.sources.DELETE({ source }).then(() => {
      history.push(`${urls.sources()}${location.search}`);
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
      <MetadataSourceForm
        handlers={{ onClose: this.handleClose }}
        initialValues={this.getInitialValues()}
        isLoading={this.fetchIsPending()}
        onDelete={this.deleteSource}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(SourceEditRoute);
