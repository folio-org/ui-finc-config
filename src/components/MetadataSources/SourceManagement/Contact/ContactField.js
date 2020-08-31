import React from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import FindContact from '../FindContact/FindContact';
import FindUser from '../FindUser/FindUser';
import { Required } from '../../../DisplayUtils/Validate';

export default class ContactField extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    selectContact: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    const value = get(this.props, 'input.value');

    if (!isEmpty(value) && !value.id && get(this.inputRef, 'current')) {
      this.inputRef.current.focus();
    }
  }

  render = () => {
    const { index, input: { name } } = this.props;
    const dataContactRole = [
      { value: 'subject specialist', label: 'Subject specialist' },
      { value: 'librarian', label: 'Librarian' },
      { value: 'technical', label: 'Technical' },
      { value: 'vendor', label: 'Vendor' }
    ];

    return (
      <div>
        <Row>
          <Col xs={5}>
            <Field
              component={FindContact}
              index={index}
              name="contacts contact"
              selectContact={this.props.selectContact}
              {...this.props}
            />
          </Col>
          <Col xs={2}>
            <FormattedMessage id="ui-finc-config.source.contact.or" />
          </Col>
          <Col xs={5}>
            <Field
              component={FindUser}
              index={index}
              name="contacts user"
              selectContact={this.props.selectContact}
              {...this.props}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              ariaLabel="Add contact"
              component={TextField}
              fullWidth
              id={`contact-name-${index}`}
              label={<FormattedMessage id="ui-finc-config.source.contact.name" />}
              name={`${name}.name`}
              placeholder="Select a contact or a user"
              readOnly
              required
              validate={Required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              component={Select}
              dataOptions={dataContactRole}
              fullWidth
              id={`contact-role-${index}`}
              label={<FormattedMessage id="ui-finc-config.source.contact.role" />}
              name={`${name}.role`}
              placeholder="Select a role for the contact"
              required
              validate={Required}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
