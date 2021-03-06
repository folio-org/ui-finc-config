import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Label,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import BasicCss from '../../../BasicStyle.css';
import css from './OrganizationView.css';

class FindOrganization extends React.Component {
  constructor(props) {
    super(props);

    const o = props.intialVendor || {};

    this.state = {
      vendor: {
        id: o.id,
        name: o.name,
      },
    };
    this.inputVendorId = o.id;
    this.inputVendorName = o.name;
  }

  selectVendor = (o) => {
    this.props.form.mutators.setOrganization({
      id: o.id,
      name: o.name,
    });

    this.setState(() => {
      return { vendor: {
        id: o.id,
        name: o.name
      } };
    });
  }

  renderVendorName = (vendor) => {
    if (_.isEmpty(vendor.id)) {
      return null;
    }

    const name = _.isEmpty(vendor.name) ?
      <NoValue /> :
      <div>{vendor.name}</div>;

    return (
      <div
        className={`${css.section} ${css.active}`}
        name="organizationName"
      >
        <div>{name}</div>
      </div>);
  }

  render() {
    const disableRecordCreation = true;
    const vendorName = this.renderVendorName(this.state.vendor);
    const buttonProps = { 'marginBottom0': true };
    const pluggable =
      <Pluggable
        aria-haspopup="true"
        buttonProps={buttonProps}
        columnMapping={this.columnMapping}
        dataKey="vendor"
        disableRecordCreation={disableRecordCreation}
        id="clickable-find-organization"
        marginTop0
        onCloseModal={(modalProps) => {
          modalProps.parentMutator.query.update({
            query: '',
            filters: '',
            sort: 'Name',
          });
        }}
        searchButtonStyle="default"
        searchLabel={<FormattedMessage id="ui-finc-config.plugin.buttonLabel.organization" />}
        selectVendor={this.selectVendor}
        type="find-organization"
        visibleColumns={['name', 'code', 'description']}
        {...this.props}
      >
        <div style={{ background: 'red' }}><FormattedMessage id="ui-finc-config.plugin.notFound" /></div>
      </Pluggable>;

    return (
      <React.Fragment>
        <Row>
          <Label className={BasicCss.styleForFormLabel}>
            <FormattedMessage id="ui-finc-config.source.organization" />
          </Label>
        </Row>
        <Row>
          <Col xs={4}>
            { pluggable }
          </Col>
          <Col xs={4}>
            { vendorName }
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

FindOrganization.propTypes = {
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setOrganization: PropTypes.func,
    }),
  }),
  intialVendor: PropTypes.object,
};

export default FindOrganization;
