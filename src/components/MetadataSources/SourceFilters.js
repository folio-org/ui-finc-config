import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import useUpdatedFilters from '../hooks/useUpdatedFilters';
import filterConfig from './filterConfigData';

const SourceFilters = ({
  activeFilters = {
    status: [],
    solrShard: [],
    contact: [],
  },
  filterData,
  filterHandlers,
}) => {
  const [filterState, setFilterState] = useState({
    status: [],
    solrShard: [],
    contact: [],
  });

  useUpdatedFilters({
    dynamicKey: 'contact',
    filterConfig,
    filterData,
    filterState,
    setFilterState,
  });

  const renderCheckboxFilter = (key) => {
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-finc-config.source.${key}`} />}
        onClearFilter={() => { filterHandlers.clearGroup(key); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={filterState[key]}
          name={key}
          onChange={(group) => { filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  const renderContactsFilter = () => {
    const contacts = filterData.contacts;
    const dataOptions = contacts.map(contact => ({
      value: contact.externalId,
      label: contact.name,
    }));

    const contactFilters = activeFilters.contact || [];

    return (
      <Accordion
        displayClearButton={contactFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-contact"
        label={<FormattedMessage id="ui-finc-config.source.contact" />}
        onClearFilter={() => { filterHandlers.clearGroup('contact'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          id="contact-filter"
          onChange={value => filterHandlers.state({ ...activeFilters, contact: [value] })}
          placeholder=""
          value={contactFilters[0] || ''}
        />
      </Accordion>
    );
  };

  return (
    <AccordionSet>
      {renderContactsFilter()}
      {renderCheckboxFilter('status')}
      {renderCheckboxFilter('solrShard')}
    </AccordionSet>
  );
};

SourceFilters.propTypes = {
  activeFilters: PropTypes.object,
  filterData: PropTypes.object,
  filterHandlers: PropTypes.object,
};

export default SourceFilters;
