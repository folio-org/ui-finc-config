import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';

import IsilSettings from './IsilSettings';

const propTypes = {
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
};

const FincConfigSettings = ({
  location,
  match,
  stripes,
}) => {
  const pages = [
    {
      component: IsilSettings,
      label: <FormattedMessage id="ui-finc-config.settings.isils.label" />,
      route: 'isils',
    }
  ];

  return (
    <Settings
      data-test-settings-finc-config
      location={location}
      match={match}
      stripes={stripes}
      pages={pages}
      paneTitle={<FormattedMessage id="ui-finc-config.meta.title" />}
    />
  );
};

FincConfigSettings.propTypes = propTypes;

export default FincConfigSettings;
