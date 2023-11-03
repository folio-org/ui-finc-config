import _ from 'lodash';
import React from 'react';
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

import SourceInfoForm from './SourceInfo/SourceInfoForm';
import SourceManagementForm from './SourceManagement/SourceManagementForm';
import SourceTechnicalForm from './SourceTechnical/SourceTechnicalForm';
import BasicStyle from '../BasicStyle.css';

class MetadataSourceForm extends React.Component {
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
        editSourceInfo: true,
        editSourceManagement: true,
        editSourceTechnical: true
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
    if (!confirmation) {
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
              id="clickable-closesourcedialog"
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
          <IfPermission perm="finc-config.metadata-sources.item.delete">
            <Button
              buttonStyle="danger"
              disabled={confirmDelete}
              id="clickable-delete-source"
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
        data-test-source-form-cancel-button
        id="clickable-close-source-form"
        marginBottom0
        onClick={onClose}
      >
        <FormattedMessage id="ui-finc-config.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        buttonStyle="primary mega"
        data-test-source-form-submit-button
        disabled={disabled}
        id="clickable-savesource"
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
      const newState = _.cloneDeep(state);

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
    const { initialValues, isLoading, onDelete } = this.props;
    const { confirmDelete, sections } = this.state;
    const footer = this.getPaneFooter();
    const name = initialValues.label;

    if (isLoading) return <Icon icon="spinner-ellipsis" width="10px" />;

    return (
      <form
        className={BasicStyle.styleForFormRoot}
        data-test-source-form-page
        id="form-source"
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
                <SourceInfoForm
                  accordionId="editSourceInfo"
                  expanded={sections.editSourceInfo}
                  onToggle={this.handleSectionToggle}
                  {...this.props}
                />
                <SourceManagementForm
                  accordionId="editSourceManagement"
                  expanded={sections.editSourceManagement}
                  onToggle={this.handleSectionToggle}
                  {...this.props}
                />
                <SourceTechnicalForm
                  accordionId="editSourceTechnical"
                  expanded={sections.editSourceTechnical}
                  onToggle={this.handleSectionToggle}
                  {...this.props}
                />
              </AccordionSet>
              <ConfirmationModal
                heading={<FormattedMessage id="ui-finc-config.form.delete" />}
                id="delete-source-confirmation"
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
  // the form will reinitialize every time the initialValues prop changes
  enableReinitialize: true,
  // set navigationCheck true for confirming changes
  navigationCheck: true,
  mutators: {
    setOrganization: (args, state, tools) => {
      tools.changeValue(state, 'organization', () => args[0]);
    },
  },
})(MetadataSourceForm);
