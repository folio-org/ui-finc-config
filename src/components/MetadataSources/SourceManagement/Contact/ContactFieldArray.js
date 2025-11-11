import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { useFieldArray } from 'react-final-form-arrays';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Headline,
} from '@folio/stripes/components';
import { EditCard } from '@folio/stripes-leipzig-components';

import handleContactSelected from './contact-util';
import ContactField from './ContactField';

const ContactFieldArray = ({ name }) => {
  const { fields } = useFieldArray(name);
  const { formatMessage } = useIntl();

  const renderContact = () => {
    return fields.map((field, index) => (
      <EditCard
        deleteButtonTooltipText={formatMessage(
          { id: 'ui-finc-config.source.contact.delete' },
          { amount: index + 1 }
        )}
        header={formatMessage(
          { id: 'ui-finc-config.source.contact.title.singular' },
          { amount: index + 1 }
        )}
        key={field}
        onDelete={() => fields.remove(index)}
      >
        <Field
          component={ContactField}
          index={index}
          name={field}
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
  name: PropTypes.string.isRequired,
};

export default ContactFieldArray;
