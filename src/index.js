import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';

import { Route } from '@folio/stripes/core';

import SourcesRoute from './routes/SourcesRoute';
import SourceEditRoute from './routes/SourceEditRoute';
import SourceCreateRoute from './routes/SourceCreateRoute';
import SourceViewRoute from './routes/SourceViewRoute';
import CollectionsRoute from './routes/CollectionsRoute';
import CollectionViewRoute from './routes/CollectionViewRoute';
import CollectionCreateRoute from './routes/CollectionCreateRoute';
import CollectionEditRoute from './routes/CollectionEditRoute';
import Settings from './settings';

const FincConfig = ({
  match,
  showSettings,
  location,
  stripes,
}) => {
  if (showSettings) {
    return (
      <Settings
        location={location}
        match={match}
        stripes={stripes}
      />
    );
  }

  return (
    <Switch>
      <Route path={`${match.path}/metadata-sources/create`} component={SourceCreateRoute} />
      <Route path={`${match.path}/metadata-sources/:id/edit`} component={SourceEditRoute} />
      <Route path={`${match.path}/metadata-sources/:id?`} component={SourcesRoute}>
        <Route path={`${match.path}/metadata-sources/:id`} component={SourceViewRoute} />
      </Route>
      <Route path={`${match.path}/metadata-collections/create`} component={CollectionCreateRoute} />
      <Route path={`${match.path}/metadata-collections/:id/edit`} component={CollectionEditRoute} />
      <Route path={`${match.path}/metadata-collections/:id?`} component={CollectionsRoute}>
        <Route path={`${match.path}/metadata-collections/:id`} component={CollectionViewRoute} />
      </Route>
    </Switch>
  );
};

FincConfig.propTypes = {
  match: ReactRouterPropTypes.match.isRequired,
  showSettings: PropTypes.bool,
  location: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

export default FincConfig;
