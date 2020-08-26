import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Label,
  Row,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import BasicCss from '../../../BasicStyle.css';

class FindContact extends React.Component {
  render() {
    const disableRecordCreation = true;
    const buttonProps = { 'marginBottom0': true };
    const pluggable =
      <Pluggable
        aria-haspopup="true"
        buttonProps={buttonProps}
        columnMapping={this.columnMapping}
        dataKey="contact"
        disableRecordCreation={disableRecordCreation}
        id={`clickable-find-user ${this.props.index}`}
        marginTop0
        onCloseModal={(modalProps) => {
          modalProps.parentMutator.query.update({
            query: '',
            filters: '',
            sort: 'Name',
          });
        }}
        searchButtonStyle="default"
        searchLabel="Add User"
        // selectUser={this.props.selectContact}
        addContacts={this.props.selectContact}
        type="find-contact"
        visibleColumns={['name', 'code', 'description']}
        {...this.props}
      >
        <div style={{ background: 'red' }}>Plugin not found</div>
      </Pluggable>;

    return (
      <React.Fragment>
        <Row>
          <Label className={BasicCss.styleForFormLabel}>
            <FormattedMessage id="ui-finc-config.source.contact" />
          </Label>
        </Row>
        <Row>
          { pluggable }
        </Row>
      </React.Fragment>
    );
  }
}

FindContact.propTypes = {
  intialContact: PropTypes.object,
  stripes: PropTypes.object,
  index: PropTypes.number,
  selectContact: PropTypes.func,
};

export default FindContact;
