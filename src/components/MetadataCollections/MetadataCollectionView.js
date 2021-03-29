import _ from 'lodash';
import React from 'react';
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

import CollectionInfoView from './CollectionInfo/CollectionInfoView';
import CollectionManagementView from './CollectionManagement/CollectionManagementView';
import CollectionTechnicalView from './CollectionTechnical/CollectionTechnicalView';

class MetadataCollectionView extends React.Component {
  static propTypes = {
    canEdit: PropTypes.bool,
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
    const { canEdit, handlers } = this.props;

    return (
      <PaneMenu>
        {canEdit && (
          <Button
            aria-label={<FormattedMessage id="ui-finc-config.edit" />}
            buttonRef={this.editButton}
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
    const { record, isLoading, stripes } = this.props;
    const label = _.get(record, 'label', 'No LABEL');

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
              />
            </Accordion>
          </AccordionSet>
        </Pane>
      </React.Fragment>
    );
  }
}

export default MetadataCollectionView;
