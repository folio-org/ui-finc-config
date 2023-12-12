import _ from 'lodash';
import React, { useRef, useState } from 'react';
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
  Pane,
  PaneHeader,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import CollectionInfoView from './CollectionInfo/CollectionInfoView';
import CollectionManagementView from './CollectionManagement/CollectionManagementView';
import CollectionTechnicalView from './CollectionTechnical/CollectionTechnicalView';

const MetadataCollectionView = ({
  canEdit,
  handlers,
  isLoading,
  record,
}) => {
  const editButton = useRef();

  const stripes = useStripes();

  const [accordionsState, setAccordionsState] = useState({
    managementAccordion: false,
    technicalAccordion: false,
  });

  const handleExpandAll = (obj) => {
    setAccordionsState(obj);
  };

  const handleAccordionToggle = ({ id }) => {
    setAccordionsState({ ...accordionsState, [id]: !accordionsState[id] });
  };

  const renderEditPaneMenu = () => {
    return (
      <PaneMenu>
        {canEdit && (
          <Button
            aria-label={<FormattedMessage id="ui-finc-config.edit" />}
            buttonRef={editButton}
            buttonStyle="primary"
            id="clickable-edit-collection"
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
      paneTitle={<span data-test-collection-header-title>{label}</span>}
    />
  );

  const renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        id="pane-collectiondetails"
        renderHeader={renderLoadingPanePaneHeader}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  };

  const label = _.get(record, 'label', 'No LABEL');

  if (isLoading) return renderLoadingPane();

  return (
    <>
      <Pane
        data-test-collection-pane-details
        defaultWidth="40%"
        id="pane-collectiondetails"
        renderHeader={() => renderDetailsPanePaneHeader(label)}
      >
        <AccordionSet>
          <ViewMetaData
            metadata={_.get(record, 'metadata', {})}
            stripes={stripes}
          />
          <CollectionInfoView
            id="collectionInfo"
            metadataCollection={record}
          />
          <Row end="xs">
            <Col xs>
              <ExpandAllButton
                accordionStatus={accordionsState}
                onToggle={handleExpandAll}
                setStatus={null}
              />
            </Col>
          </Row>
          <Accordion
            id="managementAccordion"
            label={<FormattedMessage id="ui-finc-config.collection.managementAccordion" />}
            onToggle={handleAccordionToggle}
            open={accordionsState.managementAccordion}
          >
            <CollectionManagementView
              id="collectionManagement"
              metadataCollection={record}
            />
          </Accordion>
          <Accordion
            id="technicalAccordion"
            label={<FormattedMessage id="ui-finc-config.collection.technicalAccordion" />}
            onToggle={handleAccordionToggle}
            open={accordionsState.technicalAccordion}
          >
            <CollectionTechnicalView
              id="collectionTechnical"
              metadataCollection={record}
            />
          </Accordion>
        </AccordionSet>
      </Pane>
    </>
  );
};

MetadataCollectionView.propTypes = {
  canEdit: PropTypes.bool,
  handlers: PropTypes.shape({
    onClose: PropTypes.func.isRequired,
    onEdit: PropTypes.func,
  }).isRequired,
  isLoading: PropTypes.bool,
  record: PropTypes.object,
};

export default MetadataCollectionView;
