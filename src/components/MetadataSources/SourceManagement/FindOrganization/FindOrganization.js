import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Label,
  Row,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import BasicCss from '../../../BasicStyle.css';

class FindOrganization extends React.Component {
  render() {
    const disableRecordCreation = true;
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
        selectVendor={this.props.selectContact}
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
      </React.Fragment>
    );
  }
}

FindOrganization.propTypes = {
  intialContact: PropTypes.object,
  stripes: PropTypes.object,
  index: PropTypes.number,
  selectContact: PropTypes.func,
};

export default FindOrganization;
