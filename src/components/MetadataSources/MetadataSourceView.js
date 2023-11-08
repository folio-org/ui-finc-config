import React, { useRef } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStripes } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  Layout,
  NoValue,
  Pane,
  PaneHeader,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import SourceInfoView from './SourceInfo/SourceInfoView';
import SourceManagementView from './SourceManagement/SourceManagementView';
import SourceTechnicalView from './SourceTechnical/SourceTechnicalView';

const MetadataSourceView = ({
  canEdit,
  handlers,
  isLoading,
  record,
}) => {
  const editButton = useRef();

  const stripes = useStripes();

  const initialAccordionStatus = {
    managementAccordion: false,
    technicalAccordion: false,
  };

  const renderEditPaneMenu = () => {
    return (
      <PaneMenu>
        {canEdit && (
          <Button
            aria-label={<FormattedMessage id="ui-finc-config.edit" />}
            buttonRef={editButton}
            buttonStyle="primary"
            id="clickable-edit-source"
            marginBottom0
            onClick={handlers.onEdit}
          >
            <FormattedMessage id="ui-finc-config.edit" />
          </Button>
        )}
      </PaneMenu>
    );
  };

  const renderLoadingPanePaneHeader = () => (
    <PaneHeader
      dismissible
      onClose={handlers.onClose}
      paneTitle={<span data-test-collection-header-title>loading</span>}
    />
  );

  const renderDetailsPanePaneHeader = (label) => (
    <PaneHeader
      dismissible
      lastMenu={renderEditPaneMenu()}
      onClose={handlers.onClose}
      paneTitle={<span data-test-source-header-title>{label}</span>}
    />
  );

  const renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        id="pane-sourcedetails"
        renderHeader={renderLoadingPanePaneHeader}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  };

  const label = _.get(record, 'label', <NoValue />);
  const organizationId = _.get(record, 'organization.id', '');

  if (isLoading) return renderLoadingPane();

  return (
    <>
      <Pane
        data-test-source-pane-details
        defaultWidth="40%"
        id="pane-sourcedetails"
        renderHeader={() => renderDetailsPanePaneHeader(label)}
      >
        <AccordionSet initialStatus={initialAccordionStatus}>
          <ViewMetaData
            metadata={_.get(record, 'metadata', {})}
            stripes={stripes}
          />
          <SourceInfoView
            id="sourceInfo"
            metadataSource={record}
            stripes={stripes}
          />
          <Row end="xs">
            <Col xs>
              <ExpandAllButton id="clickable-expand-all" />
            </Col>
          </Row>
          <Accordion
            id="managementAccordion"
            label={<FormattedMessage id="ui-finc-config.source.managementAccordion" />}
          >
            <SourceManagementView
              id="sourceManagement"
              metadataSource={record}
              organizationId={organizationId}
              stripes={stripes}
            />
          </Accordion>
          <Accordion
            id="technicalAccordion"
            label={<FormattedMessage id="ui-finc-config.source.technicalAccordion" />}
          >
            <SourceTechnicalView
              id="sourceTechnical"
              metadataSource={record}
              stripes={stripes}
            />
          </Accordion>
        </AccordionSet>
      </Pane>
    </>
  );
};

MetadataSourceView.propTypes = {
  canEdit: PropTypes.bool,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
  }).isRequired,
  isLoading: PropTypes.bool,
  record: PropTypes.object,
};

export default MetadataSourceView;
