import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Headline,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';
import ContactField from './ContactField';

class ContactFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.object),
    // items: PropTypes.shape({
    //   contact: PropTypes.arrayOf(PropTypes.object),
    // }),
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    onUpdateField: PropTypes.func.isRequired,
    // intialContacts: PropTypes.arrayOf(PropTypes.object),
  }

  static defaultProps = {
    items: [],
  }

  handleContactSelected = (index, selectedContact = {}) => {
    // console.log('selectedContact');
    // console.log(selectedContact);

    this.props.onUpdateField(index, {
      externalId: selectedContact.id,
      name: selectedContact.name,
      type: 'contact',
    });
  }

  renderContact = () => {
    const { name, items } = this.props;

    return items.map((contact, index) => (
      <EditCard
        key={index}
        data-test-cc-number={index}
        deleteButtonTooltipText={<FormattedMessage id="ui-finc-config.source.contact.remove" values={{ periodNum: index + 1 }} />}
        header={<FormattedMessage id="ui-finc-config.source.contact.title" values={{ number: index + 1 }} />}
        onDelete={index !== 0 ? () => this.props.onDeleteField(index, contact) : undefined}
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
