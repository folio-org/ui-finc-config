import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  ButtonGroup,
} from '@folio/stripes/components';

import urls from '../DisplayUtils/urls';

const FincNavigation = ({
  id,
}) => {
  const collectionsSearchString = localStorage.getItem('finc-config-collections-search-string') || '';
  const sourcesSearchString = localStorage.getItem('finc-config-sources-search-string') || '';

  return (
    <ButtonGroup fullWidth data-test-navigation>
      <Button
        buttonStyle={id === 'source' ? 'primary' : 'default'}
        data-test-navigation-source
        id="metadata-sources"
        to={id === 'collection' ? `${urls.sources()}${sourcesSearchString}` : ''}
      >
        <FormattedMessage id="ui-finc-config.navigation.sources" />
      </Button>
      <Button
        buttonStyle={id === 'collection' ? 'primary' : 'default'}
        data-test-navigation-collection
        id="metadata-collections"
        to={id === 'source' ? `${urls.collections()}${collectionsSearchString}` : ''}
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
