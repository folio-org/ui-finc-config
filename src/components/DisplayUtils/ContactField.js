import React from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  Row,
  TextArea,
} from '@folio/stripes/components';
import FindOrganization from '../MetadataSources/SourceManagement/FindOrganization/FindOrganization';

export default class ContactField extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    input: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
    intialContact: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.inputRef = React.createRef();

    const intialVendor = props.intialContact || {};

    this.state = {
      organization: intialVendor,
    };
  }

  componentDidMount() {
    const value = get(this.props, 'input.value');

    /* Focus only when add agreement period button is clicked in which case the value object
    would look like value:{ _delete: false }. Prevent focus on initial mount (value === {}) or
    when value.id is defined */

    if (!isEmpty(value) && !value.id && get(this.inputRef, 'current')) {
      this.inputRef.current.focus();
    }
  }

  render = () => {
    const { index, input: { name } } = this.props;

    return (
      <div>
        <Row>
          <Col xs={5}>
            <Field
              component={FindOrganization}
              name="organization"
              intialVendor={this.state.organization}
              // stripes={this.props.stripes}
              {...this.props}
            />
          </Col>
          <Col xs={2}>
            or
          </Col>
          <Col xs={5}>
            user
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <Field
              component={TextArea}
              id={`contact-role-${index}`}
              label={<FormattedMessage id="ui-finc-config.source.contact.role" />}
              name={`${name}.role`}
              parse={v => v} // Lets us send an empty string instead of `undefined`
            />
          </Col>
        </Row>
      </div>
    );
  }
}