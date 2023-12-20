import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useStripes } from '@folio/stripes/core';

import {
  Button,
  ButtonGroup,
} from '@folio/stripes/components';

import urls from '../DisplayUtils/urls';

const FincNavigation = ({
  id,
}) => {
  const stripes = useStripes();
  const hasCollectionsPerms = stripes.hasPerm('finc-config.metadata-collections.collection.get');
  const hasSourcesPerms = stripes.hasPerm('finc-config.metadata-sources.collection.get');

  return (
    <ButtonGroup fullWidth data-test-navigation>
      <Button
        buttonStyle={id === 'source' ? 'primary' : 'default'}
        data-test-navigation-source
        disabled={!hasSourcesPerms}
        id="metadata-sources"
        to={id === 'collection' ? urls.sources() : ''}
      >
        <FormattedMessage id="ui-finc-config.navigation.sources" />
      </Button>
      <Button
        buttonStyle={id === 'collection' ? 'primary' : 'default'}
        data-test-navigation-collection
        disabled={!hasCollectionsPerms}
        id="metadata-collections"
        to={id === 'source' ? urls.collections() : ''}
      >
        <FormattedMessage id="ui-finc-config.navigation.collections" />
      </Button>
    </ButtonGroup>
  );
};

FincNavigation.propTypes = {
  id: PropTypes.string,
};

export default FincNavigation;
