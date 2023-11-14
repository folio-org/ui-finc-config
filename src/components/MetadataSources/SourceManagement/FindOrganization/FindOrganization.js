import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { useForm } from 'react-final-form';

import {
  Col,
  Label,
  NoValue,
  Row,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';

import BasicCss from '../../../BasicStyle.css';
import css from './OrganizationView.css';

const FindOrganization = ({
  intialOrganization,
}) => {
  const [organization, setOrganization] = useState();

  const { change } = useForm();

  useEffect(() => {
    setOrganization(intialOrganization);
  }, [intialOrganization]);

  const selectOrganization = useCallback((newOrganization) => {
    const organizationUpdated = {
      id: newOrganization.id,
      name: newOrganization.name,
    };

    // change state
    setOrganization(organizationUpdated);

    // change field
    change('organization', organizationUpdated);
  }, [change]);

  const renderVendorName = (vendor) => {
    if (_.isEmpty(vendor?.id)) {
      return null;
    }

    const name = _.isEmpty(vendor.name) ? <NoValue /> : <div>{vendor.name}</div>;

    return (
      <div
        className={`${css.section} ${css.active}`}
        name="organizationName"
      >
        <div>{name}</div>
      </div>);
  };

  const disableRecordCreation = true;
  const vendorName = renderVendorName(organization);
  const buttonProps = { 'marginBottom0': true };
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
          { vendorName }
        </Col>
      </Row>
    </>
  );
};

FindOrganization.propTypes = {
  intialOrganization: PropTypes.object,
};

export default FindOrganization;
