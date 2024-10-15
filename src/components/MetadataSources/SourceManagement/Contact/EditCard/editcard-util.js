export const onAddField = (fields) => {
  fields.push({});
};

export const onDeleteField = (fields, index, field) => {
  fields.remove(index);
  if (field?.id) {
    fields.push({ id: field.id, _delete: true });
  }
};

export const onUpdateField = (fields, index, field) => {
  fields.update(index, {
    ...fields.value[index],
    ...field,
  });
};
