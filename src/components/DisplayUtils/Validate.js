import { FormattedMessage } from 'react-intl';

const Required = value => {
  if (value) return undefined;
  return <FormattedMessage id="ui-finc-config.form.validate.required" />;
};

const ValidateUrl = value => {
  // http not required:
  // const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
  // http required:
  const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,})/;

  if (!value || urlRegex.test(value)) return undefined;
  return <FormattedMessage id="ui-finc-config.form.validate.urlRequired" />;
};

const MdSourceRequired = value => {
  if (value) return undefined;
  return <FormattedMessage id="ui-finc-config.form.validate.sourceRequired" />;
};

const IntRequired = value => {
  const valueInt = parseInt(value, 10);

  if (valueInt === 0 || valueInt > 0) return undefined;
  return <FormattedMessage id="ui-finc-config.form.validate.intRequired" />;
};

export { IntRequired, Required, MdSourceRequired, ValidateUrl };
