import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  ExpandAllButton,
  Icon,
  IconButton,
  Layout,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

import CollectionInfoView from './CollectionInfo/CollectionInfoView';
import CollectionManagementView from './CollectionManagement/CollectionManagementView';
import CollectionTechnicalView from './CollectionTechnical/CollectionTechnicalView';

class MetadataCollectionView extends React.Component {
  static propTypes = {
    handlers: PropTypes.shape({
      onClose: PropTypes.func.isRequired,
      onEdit: PropTypes.func,
    }).isRequired,
    isLoading: PropTypes.bool,
    record: PropTypes.object,
    stripes: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      accordions: {
        managementAccordion: false,
        technicalAccordion: false
      },
    };
  }

  handleExpandAll = (obj) => {
    this.setState((curState) => {
      const newState = _.cloneDeep(curState);

      newState.accordions = obj;
      return newState;
    });
  }

  handleAccordionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);

      if (!_.has(newState.accordions, id)) newState.accordions[id] = true;
      newState.accordions[id] = !newState.accordions[id];
      return newState;
    });
  }

  renderEditPaneMenu = () => {
    const { record, handlers } = this.props;

    return (
      <IfPermission perm="finc-config.metadata-collections.item.put">
        <PaneMenu>
          <IconButton
            icon="edit"
            id="clickable-edit-collection"
            onClick={handlers.onEdit}
            style={{
              visibility: !record
                ? 'hidden'
                : 'visible'
            }}
            title="Edit Metadata Collection"
          />
        </PaneMenu>
      </IfPermission>
    );
  }

  renderLoadingPane = () => {
    return (
      <Pane
        defaultWidth="40%"
        dismissible
        id="pane-collectiondetails"
        onClose={this.props.handlers.onClose}
        paneTitle={<span data-test-collection-header-title>loading</span>}
      >
        <Layout className="marginTop1">
          <Icon icon="spinner-ellipsis" width="10px" />
        </Layout>
      </Pane>
    );
  }

  render() {
    const { record, isLoading } = this.props;
    const label = _.get(record, 'label', '-');

    if (isLoading) return this.renderLoadingPane();

    return (
      <React.Fragment>
        <Pane
          data-test-collection-pane-details
          defaultWidth="40%"
          dismissible
          id="pane-collectiondetails"
          lastMenu={this.renderEditPaneMenu()}
          onClose={this.props.handlers.onClose}
          paneTitle={<span data-test-collection-header-title>{label}</span>}
        >
          <CollectionInfoView
            id="collectionInfo"
            metadataCollection={record}
            stripes={this.props.stripes}
          />
          <Row end="xs">
            <Col xs>
              <ExpandAllButton
                accordionStatus={this.state.accordions}
                onToggle={this.handleExpandAll}
              />
            </Col>
          </Row>
          <Accordion
            id="managementAccordion"
            label={<FormattedMessage id="ui-finc-config.collection.managementAccordion" />}
            onToggle={this.handleAccordionToggle}
            open={this.state.accordions.managementAccordion}
          >
            <CollectionManagementView
              id="collectionManagement"
              metadataCollection={record}
              stripes={this.props.stripes}
            />
          </Accordion>
          <Accordion
            id="technicalAccordion"
            label={<FormattedMessage id="ui-finc-config.collection.technicalAccordion" />}
            onToggle={this.handleAccordionToggle}
            open={this.state.accordions.technicalAccordion}
          >
            <CollectionTechnicalView
              id="collectionTechnical"
              metadataCollection={record}
              stripes={this.props.stripes}
            />
          </Accordion>
        </Pane>
      </React.Fragment>
    );
  }
}

export default MetadataCollectionView;
