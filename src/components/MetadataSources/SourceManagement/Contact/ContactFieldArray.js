import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Headline,
} from '@folio/stripes/components';
import { EditCard } from '@folio/stripes-erm-components';
import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import ContactField from './ContactField';

const ContactFieldArray = ({
  fields: { name },
}) => {
  const { items, onAddField, onDeleteField, onUpdateField } = useKiwtFieldArray(name);

  const handleContactSelected = (index, selectedContact) => {
    let cName = '';
    let cId = '';
    let cPlugin = '';

    if (Array.isArray(selectedContact)) {
      // receiving name from contact-plugin
      // just get the first object of returning array
      cPlugin = 'contact';
      cId = _.get(selectedContact[0], 'id', '');
      cName = _.get(selectedContact[0], 'lastName', '') + ', ' + _.get(selectedContact[0], 'firstName', '');
    } else if (_.get(selectedContact.personal, 'lastName', '') !== '') {
      // receiving name from user-plugin
      cPlugin = 'user';
      cId = _.get(selectedContact, 'id', '');
      cName = _.get(selectedContact.personal, 'lastName', '') + ', ' + _.get(selectedContact.personal, 'firstName', '');
    }

    onUpdateField(index, {
      externalId: cId,
      name: cName,
      type: cPlugin,
    });
  };

  const renderContact = () => {
    return items.map((contact, index) => (
      <EditCard
        data-test-source-contact-number={index}
        deleteButtonTooltipText={<FormattedMessage id="ui-finc-config.source.contact.remove" />}
        header={<FormattedMessage id="ui-finc-config.source.contact.title.singular" values={{ amount: index + 1 }} />}
        key={index}
        onDelete={() => onDeleteField(index, contact)}
      >
        <Field
          component={ContactField}
          index={index}
          name={`${name}[${index}]`}
          selectContact={selectedContact => handleContactSelected(index, selectedContact)}
        />
      </EditCard>
    ));
  };

  return (
    <div>
      <Headline>
        <FormattedMessage id="ui-finc-config.source.contact.title" />
      </Headline>
      <div id="source-form-contacts">
        {renderContact()}
      </div>
      <Button id="add-contact-button" onClick={() => onAddField()}>
        <FormattedMessage id="ui-finc-config.source.contact.add" />
      </Button>
    </div>
  );
};

ContactFieldArray.propTypes = {
  name: PropTypes.string,
  fields: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default ContactFieldArray;
