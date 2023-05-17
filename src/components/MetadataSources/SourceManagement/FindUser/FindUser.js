import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Label,
  Row,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import BasicCss from '../../../BasicStyle.css';

class FindUser extends React.Component {
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
        searchLabel={<FormattedMessage id="ui-finc-config.plugin.buttonLabel.user" />}
        selectUser={this.props.selectContact}
        type="find-user"
        visibleColumns={['name', 'code', 'description']}
        {...this.props}
      >
        <div style={{ background: 'red' }}><FormattedMessage id="ui-finc-config.plugin.notFound" /></div>
      </Pluggable>;

    return (
      <>
        <Row>
          <Label className={BasicCss.styleForFormLabel}>
            <FormattedMessage id="ui-finc-config.source.user" />
          </Label>
        </Row>
        <Row>
          { pluggable }
        </Row>
      </>
    );
  }
}

FindUser.propTypes = {
  index: PropTypes.number,
  selectContact: PropTypes.func,
  stripes: PropTypes.object,
};

export default FindUser;
