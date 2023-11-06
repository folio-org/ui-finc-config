import React from 'react';
import { cloneDeep, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  IconButton,
  Pane,
  PaneFooter,
  PaneHeader,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { IfPermission } from '@folio/stripes/core';
import stripesFinalForm from '@folio/stripes/final-form';

import CollectionInfoForm from './CollectionInfo/CollectionInfoForm';
import CollectionManagementForm from './CollectionManagement/CollectionManagementForm';
import CollectionTechnicalForm from './CollectionTechnical/CollectionTechnicalForm';
import BasicStyle from '../BasicStyle.css';

class MetadataCollectionForm extends React.Component {
  static propTypes = {
    handlers: PropTypes.PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    invalid: PropTypes.bool,
    isLoading: PropTypes.bool,
    onDelete: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
  };

  static defaultProps = {
    initialValues: {},
  }

  constructor(props) {
    super(props);

    this.state = {
      confirmDelete: false,
      sections: {
        editCollectionInfo: true,
        editCollectionManagement: true,
        editCollectionTechnical: true
      },
    };

    this.handleExpandAll = this.handleExpandAll.bind(this);
  }

  beginDelete = () => {
    this.setState({
      confirmDelete: true,
    });
  }

  confirmDelete = (confirmation) => {
    if (confirmation) {
      this.deleteCollection();
    } else {
      this.setState({ confirmDelete: false });
    }
  }

  getFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-finc-config.form.close">
          { ([ariaLabel]) => (
            <IconButton
              aria-label={ariaLabel}
              icon="times"
              id="clickable-closecollectiondialog"
              onClick={this.props.handlers.onClose}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  getLastMenu() {
    const { initialValues } = this.props;
    const { confirmDelete } = this.state;
    const isEditing = initialValues && initialValues.id;

    return (
      <PaneMenu>
        {isEditing && (
          <IfPermission perm="finc-config.metadata-collections.item.delete">
            <Button
              buttonStyle="danger"
              disabled={confirmDelete}
              id="clickable-delete-collection"
              marginBottom0
              onClick={this.beginDelete}
              title="delete"
            >
              <FormattedMessage id="ui-finc-config.form.delete" />
            </Button>
          </IfPermission>
        )}
      </PaneMenu>
    );
  }

  getPaneFooter() {
    const {
      handlers: { onClose },
      handleSubmit,
      invalid,
      pristine,
      submitting
    } = this.props;

    const disabled = pristine || submitting || invalid;

    const startButton = (
      <Button
        buttonStyle="default mega"
        data-test-collection-form-cancel-button
        id="clickable-close-collection-form"
        marginBottom0
        onClick={onClose}
      >
        <FormattedMessage id="ui-finc-config.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        data-test-collection-form-submit-button
        disabled={disabled}
        id="clickable-savecollection"
        marginBottom0
        onClick={handleSubmit}
        type="submit"
      >
        <FormattedMessage id="ui-finc-config.form.saveAndClose" />
      </Button>
    );

    return <PaneFooter renderStart={startButton} renderEnd={endButton} />;
  }

  handleExpandAll(sections) {
    this.setState({ sections });
  }

  handleSectionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = cloneDeep(state);

      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  renderFormPaneHeader = () => (
    <PaneHeader
      firstMenu={this.getFirstMenu()}
      lastMenu={this.getLastMenu()}
      paneTitle={this.props.initialValues.id ? this.props.initialValues.label : <FormattedMessage id="ui-finc-config.form.create" />}
    />
  );

  render() {
    const { initialValues, isLoading, onDelete, handleSubmit } = this.props;
    const { confirmDelete, sections } = this.state;
    const footer = this.getPaneFooter();
    const name = initialValues.label;

    if (isLoading) return <Icon icon="spinner-ellipsis" width="10px" />;

    return (
      <form
        className={BasicStyle.styleForFormRoot}
        data-test-collection-form-page
        id="form-collection"
        onSubmit={handleSubmit}
      >
        <Paneset isRoot>
          <Pane
            defaultWidth="100%"
            footer={footer}
            renderHeader={this.renderFormPaneHeader}
          >
            <div className={BasicStyle.styleForFormContent}>
              <AccordionSet>
                <Row end="xs">
                  <Col xs>
                    <ExpandAllButton
                      accordionStatus={sections}
                      id="clickable-expand-all"
                      onToggle={this.handleExpandAll}
                      setStatus={null}
                    />
                  </Col>
                </Row>
                {initialValues.metadata &&
                  initialValues.metadata.createdDate && (
                    <ViewMetaData metadata={initialValues.metadata} />
                )}
                <CollectionInfoForm
                  accordionId="editCollectionInfo"
                  expanded={sections.editCollectionInfo}
                  onToggle={this.handleSectionToggle}
                  {...this.props}
                />
                <CollectionManagementForm
                  accordionId="editCollectionManagement"
                  expanded={sections.editCollectionManagement}
                  onToggle={this.handleSectionToggle}
                  {...this.props}
                />
                <CollectionTechnicalForm
                  accordionId="editCollectionTechnical"
                  expanded={sections.editCollectionTechnical}
                  onToggle={this.handleSectionToggle}
                  {...this.props}
                />
              </AccordionSet>
              <ConfirmationModal
                heading={<FormattedMessage id="ui-finc-config.form.delete" />}
                id="delete-collection-confirmation"
                message={<FormattedMessage
                  id="ui-finc-config.form.delete.confirm.message"
                  values={{ name }}
                />}
                onCancel={() => { this.confirmDelete(false); }}
                onConfirm={() => onDelete()}
                open={confirmDelete}
              />
            </div>
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesFinalForm({
  initialValuesEqual: (a, b) => isEqual(a, b),
  // the form will reinitialize every time the initialValues prop changes
  enableReinitialize: true,
  // set navigationCheck true for confirming changes
  navigationCheck: true,
  mutators: {
    setSource: (args, state, tools) => {
      tools.changeValue(state, 'mdSource', () => args[0]);
    },
    clearPermittedFor: (_args, state, tools) => {
      tools.changeValue(state, 'permittedFor', () => []);
    },
    setUsageRestricted: (args, state, tools) => {
      tools.changeValue(state, 'usageRestricted', () => args[1]);
    }
  },
  // necessary for permittedFor logic
  subscription: {
    values: true
  },
})(MetadataCollectionForm);
