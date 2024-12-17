import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Headline,
} from '@folio/stripes/components';

import EditCard from '../../../DisplayUtils/EditCard/EditCard';
import handleContactSelected from './contact-util';
import ContactField from './ContactField';

const ContactFieldArray = ({
  fields: { name },
}) => {
  const { fields } = useFieldArray(name);

  const renderContact = () => {
    return fields.map((contact, index) => (
      <EditCard
        key={index}
        data-test-source-contact-number={index}
        deleteButtonTooltipText={<FormattedMessage id="ui-finc-config.source.contact.remove" />}
        header={<FormattedMessage id="ui-finc-config.source.contact.title.singular" values={{ amount: index + 1 }} />}
        onDelete={() => fields.remove(index)}
      >
        <Field
          component={ContactField}
          index={index}
          name={`${name}[${index}]`}
          selectContact={selectedContact => handleContactSelected(fields, index, selectedContact)}
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
      <Button id="add-contact-button" onClick={() => fields.push({})}>
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
