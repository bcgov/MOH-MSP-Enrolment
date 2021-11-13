export const bcPostalCodeValidator = (value) => {
  const criteria = RegExp('^[Vv]\\d[A-Za-z][ ]?\\d[A-Za-z]\\d$');
  return criteria.test(value);
};

export const nameValidator = (value) => {
  const criteria = /^[a-zA-Z][a-zA-Z-.' ]*$/;
  return criteria.test(value);
};

export const yesValidator = (value) => {
  return value === 'Y';
};

export const nonBCValidator = (value) => {
  return value !== 'BC'
      && value !== 'British Columbia';
};
