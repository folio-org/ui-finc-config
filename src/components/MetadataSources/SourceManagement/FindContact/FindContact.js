import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Label,
  Row,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import BasicCss from '../../../BasicStyle.css';

const FindContact = ({
  index,
  selectContact,
}) => {
  const disableRecordCreation = true;
  const buttonProps = { marginBottom0: true };
  const pluggable =
    <Pluggable
      addContacts={selectContact}
      aria-haspopup="true"
      buttonProps={buttonProps}
      dataKey="contact"
      disableRecordCreation={disableRecordCreation}
      id={`clickable-find-contact ${index}`}
      marginTop0
      onCloseModal={(modalProps) => {
        modalProps.parentMutator.query.update({
          query: '',
          filters: '',
          sort: 'Name',
        });
      }}
      searchButtonStyle="default"
      searchLabel={<FormattedMessage id="ui-finc-config.plugin.buttonLabel.contact" />}
      type="find-contact"
      visibleColumns={['name', 'code', 'description']}
    >
      <div style={{ background: 'red' }}><FormattedMessage id="ui-finc-config.plugin.notFound" /></div>
    </Pluggable>;

  return (
    <>
      <Row>
        <Label className={BasicCss.styleForFormLabel}>
          <FormattedMessage id="ui-finc-config.source.contact" />
        </Label>
      </Row>
      <Row>
        { pluggable }
      </Row>
    </>
  );
};

FindContact.propTypes = {
  index: PropTypes.number,
  selectContact: PropTypes.func,
};

export default FindContact;
