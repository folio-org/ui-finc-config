import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Headline,
} from '@folio/stripes/components';
import {
  EditCard,
  withKiwtFieldArray
} from '@folio/stripes-erm-components';

import ContactField from './ContactField';

class ContactFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    onUpdateField: PropTypes.func.isRequired,
  }

  static defaultProps = {
    items: [],
  }

  handleContactSelected = (index, selectedContact = {}) => {
    const orgName = _.get(selectedContact, 'name', '');
    const userName = _.get(selectedContact.personal, 'lastName', '') + ', ' + _.get(selectedContact.personal, 'firstName', '');
    let contactName = '';
    let contactPlugin = '';
    if (orgName !== '') {
      // receiving name from organization-plugin
      contactPlugin = 'contact';
      contactName = orgName;
    } else if (_.get(selectedContact.personal, 'lastName', '') !== '') {
      // receiving name from user-plugin
      contactPlugin = 'user';
      contactName = userName;
    }

    this.props.onUpdateField(index, {
      externalId: selectedContact.id,
      name: contactName,
      type: contactPlugin,
    });
  }

  renderContact = () => {
    const { name, items } = this.props;

    return items.map((contact, index) => (
      <EditCard
        key={index}
        data-test-cc-number={index}
        deleteButtonTooltipText={<FormattedMessage id="ui-finc-config.source.contact.remove" />}
        header={<FormattedMessage id="ui-finc-config.source.contact.title.singular" values={{ amount: index + 1 }} />}
        onDelete={() => this.props.onDeleteField(index, contact)}
      >
        <Field
          component={ContactField}
          index={index}
          name={`${name}[${index}]`}
          intialContact={contact}
          selectVendor={selectedContact => this.handleContactSelected(index, selectedContact)}
        />
      </EditCard>
    ));
  }

  render = () => {
    return (
      <div>
        <Headline>
          <FormattedMessage id="ui-finc-config.source.contact.title" />
        </Headline>
        <div id="source-form-contacts">
          {this.renderContact()}
        </div>
        <Button id="add-contact-button" onClick={() => this.props.onAddField()}>
          <FormattedMessage id="ui-finc-config.source.contact.add" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(ContactFieldArray);
