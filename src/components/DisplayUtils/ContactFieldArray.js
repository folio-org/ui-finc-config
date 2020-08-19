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
    name: PropTypes.string.isRequired,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
    intialContacts: PropTypes.arrayOf(PropTypes.object),
  }

  // static defaultProps = {
  //   items: [],
  // }

  renderContact = () => {
    const { name, intialContacts } = this.props;

    return intialContacts.map((contact, index) => (
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
        <Button id="add-period-button" onClick={() => this.props.onAddField()}>
          <FormattedMessage id="ui-finc-config.source.contact.add" />
        </Button>
      </div>
    );
  }
}

export default withKiwtFieldArray(ContactFieldArray);
