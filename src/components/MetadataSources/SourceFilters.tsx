import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  FilterAccordionHeaderProps,
  Selection,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import {
  ActiveFilters,
  Contact,
  FilterHandlers,
} from '../../types';
import { buildFilterState } from '../../util/filterUtils';
import filterConfig from './filterConfigData';

export interface SourceFiltersProps {
  activeFilters?: ActiveFilters;
  filterData: {
    contacts?: Contact[];
  };
  filterHandlers: FilterHandlers;
}

const SourceFilters = ({
  activeFilters = {
    status: [],
    solrShard: [],
    contact: [],
  },
  filterData,
  filterHandlers,
}: SourceFiltersProps) => {
  const { formatMessage } = useIntl();

  const filterState = useMemo(
    // skip for contact filter as it is dynamic and handled separately
    () => buildFilterState(
      filterConfig.filter(f => f.name !== 'contact'),
      formatMessage
    ),
    [formatMessage]
  );

  const renderCheckboxFilter = (key: string) => {
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion<FilterAccordionHeaderProps>
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={formatMessage({ id: `ui-finc-config.source.${key}` })}
        onClearFilter={() => { filterHandlers.clearGroup(key); }}
        separator={false}
      >
        <CheckboxFilter
          dataOptions={filterState[key] ?? []}
          name={key}
          onChange={(group) => { filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  };

  const renderContactsFilter = () => {
    // use dynamic filter values from okapi
    const dataOptions = (filterData.contacts || []).map((contact: Contact) => ({
      value: contact.externalId,
      label: contact.name,
    }));

    const contactFilters = activeFilters.contact || [];

    return (
      <Accordion<FilterAccordionHeaderProps>
        displayClearButton={contactFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-contact"
        label={formatMessage({ id: 'ui-finc-config.source.contact' })}
        onClearFilter={() => { filterHandlers.clearGroup('contact'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          id="contact-filter"
          onChange={(value: string) => filterHandlers.state({ ...activeFilters, contact: [value] })}
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

export default SourceFilters;
