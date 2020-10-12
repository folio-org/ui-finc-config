import React from 'react';
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

class SourceFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    filterData: PropTypes.object,
    filterHandlers: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {
      status: [],
      solrShard: [],
      contact: [],
    }
  };

  state = {
    status: [],
    solrShard: [],
    contact: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    const arr = [];

    filterConfig.forEach(filter => {
      const newValues = [];
      let values = {};
      if (filter === 'contact') {
        // get filter values from okapi
        values = props.filterData[filter] || [];
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

      if (state[filter.name] && arr[filter.name].length !== state[filter.name].length) {
        newState[filter.name] = arr[filter.name];
      }
    });

    if (Object.keys(newState).length) return newState;

    return null;
  }

  renderCheckboxFilter = (key) => {
    const { activeFilters } = this.props;
    const groupFilters = activeFilters[key] || [];

    return (
      <Accordion
        displayClearButton={groupFilters.length > 0}
        header={FilterAccordionHeader}
        id={`filter-accordion-${key}`}
        label={<FormattedMessage id={`ui-finc-config.source.${key}`} />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup(key); }}
        separator={false}
        {...this.props}
      >
        <CheckboxFilter
          dataOptions={this.state[key]}
          name={key}
          onChange={(group) => { this.props.filterHandlers.state({ ...activeFilters, [group.name]: group.values }); }}
          selectedValues={groupFilters}
        />
      </Accordion>
    );
  }

  renderContactsFilter = () => {
    const contacts = this.props.filterData.contacts;
    const dataOptions = contacts.map(contact => ({
      value: contact.externalId,
      label: contact.name,
    }));

    const { activeFilters } = this.props;
    const contactFilters = activeFilters.contact || [];

    return (
      <Accordion
        displayClearButton={contactFilters.length > 0}
        header={FilterAccordionHeader}
        id="filter-accordion-contact"
        label={<FormattedMessage id="ui-finc-config.source.contact" />}
        onClearFilter={() => { this.props.filterHandlers.clearGroup('contact'); }}
        separator={false}
      >
        <Selection
          dataOptions={dataOptions}
          id="contact-filter"
          onChange={value => this.props.filterHandlers.state({ ...activeFilters, contact: [value] })}
          placeholder="Select a contact"
          value={contactFilters[0] || ''}
        />
      </Accordion>
    );
  }

  render() {
    return (
      <AccordionSet>
        {this.renderContactsFilter('contact')}
        {this.renderCheckboxFilter('status')}
        {this.renderCheckboxFilter('solrShard')}
      </AccordionSet>
    );
  }
}

export default SourceFilters;
