import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

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

  useEffect(() => {
    const newState = {};
    const arr = [];

    filterConfig.forEach(filter => {
      const newValues = [];
      let values = {};
      if (filter === 'contact') {
        // get filter values from okapi
        values = filterData[filter] || [];
      } else {
        // get filte values from filterConfig
        values = filter.values;
      }

      values.forEach((key) => {
        let newValue = {};
        newValue = {
          'value': key.cql,
          'label': key.name,
        };
        newValues.push(newValue);
      });

      arr[filter.name] = newValues;

      if (filterState[filter.name] && arr[filter.name].length !== filterState[filter.name].length) {
        newState[filter.name] = arr[filter.name];
      }
    });

    if (Object.keys(newState).length) {
      setFilterState((prevState) => ({ ...prevState, ...newState }));
    }
  }, [filterData, filterState]);

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
