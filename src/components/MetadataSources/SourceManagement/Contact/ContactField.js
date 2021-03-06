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
import { IntlConsumer } from '@folio/stripes/core';

import FindContact from '../FindContact/FindContact';
import FindUser from '../FindUser/FindUser';
import { Required } from '../../../DisplayUtils/Validate';
import { contactRoleOptions } from '../../../DataOptions/dataOptions';

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

  getDataOptions(intl, field) {
    return field.map((item) => ({
      label: item.value ? intl.formatMessage({ id: `ui-finc-config.dataOption.${item.value}` }) : '',
      value: item.value,
    }));
  }

  render = () => {
    const { index, input: { name } } = this.props;

    return (
      <div>
        <Row data-test-find-contact-row>
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
              component={TextField}
              fullWidth
              id={`contact-name-${index}`}
              label={<FormattedMessage id="ui-finc-config.source.contact.name" />}
              name={`${name}.name`}
              readOnly
              required
              validate={Required}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <IntlConsumer>
              {intl => (
                <Field
                  component={Select}
                  dataOptions={this.getDataOptions(intl, contactRoleOptions)}
                  fullWidth
                  id={`contact-role-${index}`}
                  label={<FormattedMessage id="ui-finc-config.source.contact.role" />}
                  name={`${name}.role`}
                  placeholder=" "
                  required
                  validate={Required}
                />
              )}
            </IntlConsumer>
          </Col>
        </Row>
      </div>
    );
  }
}
