import PropTypes from 'prop-types';
import { Switch } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import { Route } from '@folio/stripes/core';

import CollectionCreateRoute from './routes/CollectionCreateRoute';
import CollectionEditRoute from './routes/CollectionEditRoute';
import CollectionsRoute from './routes/CollectionsRoute';
import CollectionViewRoute from './routes/CollectionViewRoute';
import SourceCreateRoute from './routes/SourceCreateRoute';
import SourceEditRoute from './routes/SourceEditRoute';
import SourcesRoute from './routes/SourcesRoute';
import SourceViewRoute from './routes/SourceViewRoute';
import Settings from './settings';

const FincConfig = ({
  location,
  match,
  showSettings,
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
      <Route component={SourceCreateRoute} path={`${match.path}/metadata-sources/create`} />
      <Route component={SourceEditRoute} path={`${match.path}/metadata-sources/:id/edit`} />
      <Route component={SourcesRoute} path={`${match.path}/metadata-sources/:id?`}>
        <Route component={SourceViewRoute} path={`${match.path}/metadata-sources/:id`} />
      </Route>
      <Route component={CollectionCreateRoute} path={`${match.path}/metadata-collections/create`} />
      <Route component={CollectionEditRoute} path={`${match.path}/metadata-collections/:id/edit`} />
      <Route component={CollectionsRoute} path={`${match.path}/metadata-collections/:id?`}>
        <Route component={CollectionViewRoute} path={`${match.path}/metadata-collections/:id`} />
      </Route>
    </Switch>
  );
};

FincConfig.propTypes = {
  location: PropTypes.object.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  showSettings: PropTypes.bool,
  stripes: PropTypes.object.isRequired,
};

export default FincConfig;
