import { useCallback } from 'react';
import {
  Field,
  useForm,
} from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Label,
  Row,
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import BasicCss from '../../../BasicStyle.css';

const FindOrganization = () => {
  const { change } = useForm();

  const selectOrganization = useCallback((newOrganization) => {
    const organizationUpdated = {
      id: newOrganization.id,
      name: newOrganization.name,
    };

    // change field
    change('organization', organizationUpdated);
  }, [change]);

  const disableRecordCreation = true;
  const buttonProps = { marginBottom0: true };
  const pluggable =
    <Pluggable
      aria-haspopup="true"
      buttonProps={buttonProps}
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
      selectVendor={selectOrganization}
      type="find-organization"
      visibleColumns={['name', 'code', 'description']}
    >
      <div style={{ background: 'red' }}><FormattedMessage id="ui-finc-config.plugin.notFound" /></div>
    </Pluggable>;

  return (
    <>
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
          <Field
            component={TextField}
            disabled
            name="organization.name"
            type="text"
          />
        </Col>
      </Row>
    </>
  );
};

export default FindOrganization;
