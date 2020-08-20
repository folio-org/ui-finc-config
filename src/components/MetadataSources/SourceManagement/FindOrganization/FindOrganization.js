import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Label,
  Row,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import BasicCss from '../../../BasicStyle.css';
import css from './OrganizationView.css';

class FindOrganization extends React.Component {
  constructor(props) {
    super(props);

    const o = props.intialVendor || {};

    // console.log('intialVendor');
    // console.log(props.intialVendor);

    this.state = {
      vendor: {
        id: o.externalId,
        name: o.name,
        type: 'contact'
      },
    };
    this.inputVendorId = o.externalId;
    this.inputVendorName = o.name;
  }

  // selectVendor = (o) => {
  //   console.log('selectVendor');
  //   console.log(o);
  //   this.props.form.mutators.setOrganization({
  //     externalId: o.id,
  //     name: o.name,
  //     type: 'contact'
  //   });

  //   this.setState(() => {
  //     return { vendor: {
  //       id: o.externalId,
  //       name: o.name,
  //       type: 'contact'
  //     } };
  //   });
  // }

  renderVendorName = (vendor) => {
    if (_.isEmpty(vendor.id)) {
      return null;
    }

    const name = _.isEmpty(vendor.name) ?
      '-' :
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
        dataKey="contacts"
        disableRecordCreation={disableRecordCreation}
        id={`clickable-find-organization ${this.props.index}`}
        marginTop0
        onCloseModal={(modalProps) => {
          modalProps.parentMutator.query.update({
            query: '',
            filters: '',
            sort: 'Name',
          });
        }}
        searchButtonStyle="default"
        searchLabel="Add Organization"
        selectVendor={this.props.selectVendor}
        type="find-organization"
        visibleColumns={['name', 'code', 'description']}
        {...this.props}
      >
        <div style={{ background: 'red' }}>Plugin not found</div>
      </Pluggable>;

    return (
      <React.Fragment>
        <Row>
          <Label className={BasicCss.styleForFormLabel}>
            <FormattedMessage id="ui-finc-config.source.organization" />
          </Label>
        </Row>
        <Row>
          { pluggable }
        </Row>
        <Row>
          { vendorName }
        </Row>
      </React.Fragment>
    );
  }
}

FindOrganization.propTypes = {
  intialVendorId: PropTypes.string,
  intialVendor: PropTypes.object,
  stripes: PropTypes.object,
  form: PropTypes.shape({
    mutators: PropTypes.shape({
      setOrganization: PropTypes.func,
    }),
  }),
  index: PropTypes.number,
  selectVendor: PropTypes.func,
};

export default FindOrganization;
