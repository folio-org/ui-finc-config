import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ExpandAllButton,
  Icon,
  Layout,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
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

    this.editButton = React.createRef();

    this.connectedViewMetaData = this.props.stripes.connect(ViewMetaData);
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
    const { handlers } = this.props;

    return (
      <IfPermission perm="finc-config.metadata-collections.item.put">
        <PaneMenu>
          <Button
            id="clickable-edit-collection"
            buttonStyle="primary"
            onClick={handlers.onEdit}
            aria-label="Edit Collection"
            buttonRef={this.editButton}
            marginBottom0
          >
            <FormattedMessage id="ui-finc-config.edit" />
          </Button>
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
          <AccordionSet>
            <this.connectedViewMetaData
              metadata={_.get(record, 'metadata', {})}
              stripes={this.props.stripes}
            />
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
                  setStatus={null}
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
          </AccordionSet>
        </Pane>
      </React.Fragment>
    );
  }
}

export default MetadataCollectionView;
