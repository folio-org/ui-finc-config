import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';

import {
  Button,
  Headline,
} from '@folio/stripes/components';

import EditCard from './EditCard/EditCard';
import {
  onAddField,
  onDeleteField,
  onUpdateField,
} from './EditCard/editcard-util';
import ContactField from './ContactField';

const ContactFieldArray = ({
  fields: { name },
}) => {
  const { fields } = useFieldArray(name);

  const handleContactSelected = (index, selectedContact) => {
    let cName = '';
    let cId = '';
    let cPlugin = '';

    if (Array.isArray(selectedContact)) {
      // receiving name from contact-plugin
      // just get the first object of returning array
      cPlugin = 'contact';
      cId = get(selectedContact[0], 'id', '');
      cName = get(selectedContact[0], 'lastName', '') + ', ' + get(selectedContact[0], 'firstName', '');
    } else if (get(selectedContact.personal, 'lastName', '') !== '') {
      // receiving name from user-plugin
      cPlugin = 'user';
      cId = get(selectedContact, 'id', '');
      cName = get(selectedContact.personal, 'lastName', '') + ', ' + get(selectedContact.personal, 'firstName', '');
    }

    onUpdateField(fields, index, {
      externalId: cId,
      name: cName,
      type: cPlugin,
    });
  };

  const renderContact = () => {
    return fields.map((contact, index) => (
      <EditCard
        data-test-source-contact-number={index}
        deleteButtonTooltipText={<FormattedMessage id="ui-finc-config.source.contact.remove" />}
        header={<FormattedMessage id="ui-finc-config.source.contact.title.singular" values={{ amount: index + 1 }} />}
        key={`${name}[${index}]`}
        onDelete={() => onDeleteField(fields, index, contact)}
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
      <Button id="add-contact-button" onClick={() => onAddField(fields)}>
        <FormattedMessage id="ui-finc-config.source.contact.add" />
      </Button>
    </div>
  );
};

ContactFieldArray.propTypes = {
  fields: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default ContactFieldArray;
