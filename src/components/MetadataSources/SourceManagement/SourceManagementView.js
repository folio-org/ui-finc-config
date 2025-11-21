import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useOkapiKyQuery } from '@folio/stripes-leipzig-components';
import {
  Button,
  Col,
  Headline,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import {
  API_ORGANIZATIONS,
  QK_ORGANIZATIONS,
} from '../../../util/constants';
import BasicCss from '../../BasicStyle.css';
import urls from '../../DisplayUtils/urls';
import DisplayContactsArray from './Contact/DisplayContactsArray';
import css from './SourceManagement.css';

const SourceManagementView = ({
  id,
  metadataSource,
  organizationId,
}) => {
  let orgValue;
  const sourceId = _.get(metadataSource, 'id', <NoValue />);

  const { data: organization, isLoading: isLoadingOrganization, isError } = useOkapiKyQuery({
    queryKey: [QK_ORGANIZATIONS, organizationId],
    id: organizationId,
    api: API_ORGANIZATIONS,
  });
  const sourcesOrganization = _.get(metadataSource, 'organization', <NoValue />);

  if (!_.isEmpty(organizationId) && !isLoadingOrganization) {
    if (isError) {
      if (sourcesOrganization.name) {
        orgValue = sourcesOrganization.name;
      } else {
        orgValue = <NoValue />;
      }
    } else {
      orgValue = (
        <Link to={{ pathname: `${urls.organizationView(organization.id)}` }}>
          {sourcesOrganization.name}
        </Link>
      );
    }
  }

  return (
    <div id={id}>
      <Row>
        <Col xs={6}>
          <Button
            buttonStyle="primary"
            id="showAllCollections"
            to={urls.showAllCollections(sourceId)}
          >
            <FormattedMessage id="ui-finc-config.source.button.showAllCollections" />
          </Button>
        </Col>
      </Row>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-config.source.organization" />}
          value={orgValue}
        />
      </Row>
      <Row>
        <Headline
          className={BasicCss.styleForViewHeadline}
          size="medium"
        >
          <FormattedMessage id="ui-finc-config.source.contact.title" />
        </Headline>
      </Row>
      <Row className={css.addMarginForContacts}>
        <DisplayContactsArray
          metadataSource={metadataSource}
        />
      </Row>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-config.source.indexingLevel" />}
          value={_.get(metadataSource, 'indexingLevel', <NoValue />)}
        />
      </Row>
      <Row>
        <KeyValue
          label={<FormattedMessage id="ui-finc-config.source.generalNotes" />}
          value={_.get(metadataSource, 'generalNotes', <NoValue />)}
        />
      </Row>
    </div>
  );
};

SourceManagementView.propTypes = {
  id: PropTypes.string,
  metadataSource: PropTypes.object,
  organizationId: PropTypes.string,
};

export default SourceManagementView;
