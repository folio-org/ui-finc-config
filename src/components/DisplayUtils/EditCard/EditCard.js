import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';

import {
  Card,
  IconButton,
  Tooltip,
} from '@folio/stripes/components';

const EditCard = ({
  children,
  deleteButtonTooltipText,
  header,
  onDelete,
}) => {
  const renderDeleteButton = () => {
    return (
      deleteButtonTooltipText ?
        <Tooltip
          id={uniqueId('delete-contact')}
          text={deleteButtonTooltipText}
        >
          {({ ref, ariaIds }) => (
            <IconButton
              ref={ref}
              aria-label="delete-contact"
              aria-labelledby={ariaIds.text}
              icon="trash"
              onClick={onDelete}
            />
          )}
        </Tooltip>
        :
        <IconButton
          aria-label="delete-contact"
          icon="trash"
          onClick={onDelete}
        />
    );
  };

  return (
    <Card
      headerEnd={onDelete ? renderDeleteButton() : undefined}
      headerStart={<strong>{header}</strong>}
    >
      {children}
    </Card>
  );
};

EditCard.propTypes = {
  children: PropTypes.node.isRequired,
  deleteButtonTooltipText: PropTypes.node,
  header: PropTypes.node.isRequired,
  onDelete: PropTypes.func,
};

export default EditCard;
