import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  IconButton,
  Pane,
  PaneMenu,
  Paneset,
  Row
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';
import stripesForm from '@folio/stripes/form';

import SourceInfoForm from './SourceInfo/SourceInfoForm';
import SourceManagementForm from './SourceManagement/SourceManagementForm';
import SourceTechnicalForm from './SourceTechnical/SourceTechnicalForm';

class MetadataSourceForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    parentResources: PropTypes.shape().isRequired,
    parentMutator: PropTypes.object.isRequired,
    stripes: PropTypes.shape({
      connect: PropTypes.func,
    }).isRequired,
    onCancel: PropTypes.func,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    initialValues: PropTypes.object,
    contentData: PropTypes.object,
    handlers: PropTypes.PropTypes.shape({
      onClose: PropTypes.func.isRequired,
    }),
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
    if (confirmation) {
      this.deleteSource();
    } else {
      this.setState({ confirmDelete: false });
    }
  }

  deleteSource = () => {
    const { parentMutator, initialValues: { id } } = this.props;

    parentMutator.records.DELETE({ id }).then(() => {
      parentMutator.query.update({
        _path: 'finc-config/metadata-sources',
        layer: null
      });
    });
  }

  getAddFirstMenu() {
    const { onCancel } = this.props;

    return (
      <PaneMenu>
        <FormattedMessage id="ui-finc-config.source.form.close">
          { ariaLabel => (
            <IconButton
              id="clickable-closesourcedialog"
              // onClick={onCancel}
              onClick={this.props.handlers.onClose}
              ariaLabel={ariaLabel}
              icon="times"
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  getLastMenu(id, label) {
    const { pristine, submitting, initialValues } = this.props;
    const { confirmDelete } = this.state;
    const isEditing = initialValues && initialValues.id;

    return (
      // set button to save changes
      <PaneMenu>
        {isEditing &&
          <IfPermission perm="finc-config.metadata-sources.item.delete">
            <Button
              id="clickable-delete-udp"
              title="delete"
              buttonStyle="danger"
              onClick={this.beginDelete}
              disabled={confirmDelete}
              marginBottom0
            >
              <FormattedMessage id="ui-finc-config.source.form.deleteSource" />
            </Button>
          </IfPermission>
        }
        <Button
          id={id}
          type="submit"
          title={label}
          disabled={pristine || submitting}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          {label}
        </Button>
      </PaneMenu>
    );
  }

  handleExpandAll(sections) {
    this.setState({ sections });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  handleSectionToggle = ({ id }) => {
    this.setState((state) => {
      const newState = _.cloneDeep(state);

      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  render() {
    const { initialValues, handleSubmit } = this.props;
    const { confirmDelete, sections } = this.state;
    const paneTitle = initialValues.id ? initialValues.label : <FormattedMessage id="ui-finc-config.source.form.createSource" />;
    const lastMenu = initialValues.id ?
      this.getLastMenu('clickable-createnewsource', <FormattedMessage id="ui-finc-config.source.form.updateSource" />) :
      this.getLastMenu('clickable-createnewsource', <FormattedMessage id="ui-finc-config.source.form.createSource" />);

    return (
      <form id="form-source" onSubmit={handleSubmit}>
        <Paneset style={{ position: 'relative' }}>
          <Pane
            defaultWidth="100%"
            firstMenu={this.getAddFirstMenu()}
            lastMenu={lastMenu}
            paneTitle={paneTitle}
          >
            <Row end="xs">
              <Col xs>
                <ExpandAllButton
                  id="clickable-expand-all"
                  accordionStatus={sections}
                  onToggle={this.handleExpandAll}
                />
              </Col>
            </Row>
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

              id="sourceManagement"
              metadataSource={initialValues}
              stripes={this.props.stripes}
            />
            <SourceTechnicalForm
              accordionId="editSourceTechnical"
              expanded={sections.editSourceTechnical}
              onToggle={this.handleSectionToggle}
              {...this.props}
            />
            {/* <ConfirmationModal
              id="delete-source-confirmation"
              heading={<FormattedMessage id="ui-finc-config.source.form.deleteSource" />}
              message={`Do you really want to delete ${initialValues.label}?`}
              open={confirmDelete}
              onConfirm={() => { this.confirmDelete(true); }}
              onCancel={() => { this.confirmDelete(false); }}
            /> */}
          </Pane>
        </Paneset>
      </form>
    );
  }
}

export default stripesForm({
  form: 'form-metadataSource',
  // set navigationCheck true for confirming changes
  navigationCheck: true,
  // the form will reinitialize every time the initialValues prop changes
  enableReinitialize: true,
})(MetadataSourceForm);
