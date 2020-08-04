import React from 'react';
import _ from 'lodash';
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
    onCancel: PropTypes.func,
    onDelete: PropTypes.func,
    onSubmit: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    stripes: PropTypes.object,
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
          { ariaLabel => (
            <IconButton
              ariaLabel={ariaLabel}
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
        data-test-source-form-cancel-button
        marginBottom0
        id="clickable-close-source-form"
        buttonStyle="default mega"
        onClick={onClose}
      >
        <FormattedMessage id="ui-finc-config.form.cancel" />
      </Button>
    );

    const endButton = (
      <Button
        data-test-source-form-submit-button
        marginBottom0
        id="clickable-savesource"
        buttonStyle="primary mega"
        type="submit"
        onClick={handleSubmit}
        disabled={disabled}
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

  render() {
    const { initialValues, isLoading, onDelete } = this.props;
    const { confirmDelete, sections } = this.state;
    const paneTitle = initialValues.id ? initialValues.label : <FormattedMessage id="ui-finc-config.form.create" />;

    const firstMenu = this.getFirstMenu();
    const lastMenu = this.getLastMenu();
    const footer = this.getPaneFooter();

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
            firstMenu={firstMenu}
            footer={footer}
            lastMenu={lastMenu}
            paneTitle={paneTitle}
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
                  id="sourceManagement"
                  metadataSource={initialValues}
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
                message={`Do you really want to delete ${initialValues.label}?`}
                onCancel={() => { this.confirmDelete(false); }}
                onConfirm={onDelete}
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
