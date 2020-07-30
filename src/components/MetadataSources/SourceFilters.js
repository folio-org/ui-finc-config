import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
} from '@folio/stripes/components';
import { CheckboxFilter } from '@folio/stripes/smart-components';

import filterConfig from './filterConfigData';

class SourceFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    filterHandlers: PropTypes.object,
  };

  static defaultProps = {
    activeFilters: {
      status: [],
      solrShard: [],
    }
  };

  state = {
    status: [],
    solrShard: [],
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    const arr = [];

    filterConfig.forEach(filter => {
      const newValues = [];
      let values = {};
      values = filter.values;

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

  renderCheckboxFilter = (key, props) => {
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
        {...props}
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

  render() {
    return (
      <AccordionSet>
        {this.renderCheckboxFilter('status', 'Implementation status')}
        {this.renderCheckboxFilter('solrShard', 'Solar shard')}
      </AccordionSet>
    );
  }
}

export default SourceFilters;
