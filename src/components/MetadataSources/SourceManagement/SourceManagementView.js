import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  Button,
  Col,
  Headline,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import BasicCss from '../../BasicStyle.css';
import css from './SourceManagement.css';
import urls from '../../DisplayUtils/urls';
import DisplayContactsArray from './Contact/DisplayContactsArray';

const SourceManagementView = ({
  id,
  metadataSource,
  organizationId,
}) => {
  const ORGANIZATIONS_API = 'organizations-storage/organizations';

  const useOrganization = () => {
    const ky = useOkapiKy();

    const { isLoading, data: organization = {}, ...rest } = useQuery(
      [ORGANIZATIONS_API, organizationId],
      () => ky.get(`${ORGANIZATIONS_API}/${organizationId}`).json(),
      { enabled: Boolean(organizationId) },
    );

    return ({
      isLoading,
      organization,
      ...rest
    });
  };

  let orgValue = <NoValue />;
  const sourceId = _.get(metadataSource, 'id', <NoValue />);

  const { organization, isLoading: isLoadingOrganization, isError } = useOrganization(organizationId);
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
        <>
          <Link to={{ pathname: `${urls.organizationView(organization.id)}` }}>
            {sourcesOrganization.name}
          </Link>
        </>
      );
    }
  }

  return (
    <>
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
    </>
  );
};

SourceManagementView.propTypes = {
  id: PropTypes.string,
  metadataSource: PropTypes.object,
  organizationId: PropTypes.string,
};

export default SourceManagementView;
