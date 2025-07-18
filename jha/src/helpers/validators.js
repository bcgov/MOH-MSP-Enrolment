import { getISODateString, isValidISODateString } from "common-lib-vue";
import { addDays, isBefore, startOfToday } from "date-fns";

// Wrapping validator with helpers.withParams only required if a reactive value is needed in a returned function.
// See here: https://vuelidate-next.netlify.app/custom_validators.html#passing-extra-reactive-properties
import { helpers } from "@vuelidate/validators";

export const bcPostalCodeValidator = (value) => {
  const criteria = RegExp("^[Vv]\\d[A-Za-z][ ]?\\d[A-Za-z]\\d$");
  return criteria.test(value);
};

export const nameValidator = (value) => {
  const criteria = /^[a-zA-Z][a-zA-Z-.' ]*$/;
  return criteria.test(value);
};

export const yesValidator = (value) => {
  return value === "Y";
};

export const nonBCValidator = (value) => {
  return value !== "BC" && value !== "British Columbia";
};

export const nonCanadaValidator = (value) => {
  return value !== "Canada";
};

export const dateDataRequiredValidator = (dateData) =>
  helpers.withParams(
    {
      type: "dateDataRequiredValidator",
      value: dateData,
    },
    () => {
      if (
        !dateData ||
        (!dateData.year && typeof dateData.month !== "number" && !dateData.day)
      ) {
        return false;
      }
      return true;
    },
  );

export const canadaArrivalDateRequiredChildValidator = (dateData, isRequired) =>
  helpers.withParams(
    {
      type: "canadaArrivalDateRequiredChildValidator",
      dateData: dateData,
      isRequired: isRequired,
    },
    () => {
      //The isRequired logic has been combined into this validator to prevent dynamic validator/nested component reactivity issues
      //In short, the application wasn't properly assigning/unassigning the isRequired validator to the Child component because it uses nested validations 
      //so now the logic is all in one place where it will always run
      if (!isRequired) {
        console.log("not required")
        return true;
      }
      if (
        !dateData ||
        (!dateData.year && typeof dateData.month !== "number" && !dateData.day)
      ) {
        console.log("required, data missing")
        return false;
      }
      console.log("required, data present")
      return true;
    },
  );

export const dateDataValidator = (dateData) =>
  helpers.withParams(
    {
      type: "dateDataValidator",
      value: dateData,
    },
    () => {
      if (
        !dateData ||
        (!dateData.year && typeof dateData.month !== "number" && !dateData.day)
      ) {
        return true;
      }
      const year = dateData.year;
      const month = dateData.month;
      const day = dateData.day;
      if (
        !(year && typeof month === "number" && day) &&
        (year || typeof month === "number" || day)
      ) {
        return false;
      }
      const isoDateString = getISODateString(year, month + 1, day);
      return isValidISODateString(isoDateString);
    },
  );

/* A validator that is initially setup using the withParams helper 
 expects any overwrites of that validator to also use withParams.
 Although this validator does not use paramaters,
 helpers.withParams is required to overwrite the dataDateRequired 
 validator without reference errors */
export const dateDataOptionalValidator = () => {
  return helpers.withParams({}, () => true);
};

export const pastDateValidator = (value) => {
  return isBefore(value, addDays(startOfToday(), 1));
};

export const optionalInvalidDateValidator = (validator) => {
  return (value, vm) => {
    if (!(value instanceof Date) || isNaN(value)) {
      return true;
    }
    return validator(value, vm);
  };
};

export const reasonDestinationContentValidator = (value) => {
  if (value === "" || value === null || value === undefined) {
    // Don't show content error if field is blank.
    return true;
  }
  const criteriaAllowedCharecters = /^[0-9a-zA-Z-.'#& /]*$/;
  const criteriaMustHaveLetter = /.*[a-z].*/i;
  return (
    criteriaAllowedCharecters.test(value) && criteriaMustHaveLetter.test(value)
  );
};

export const phnFirstDigitValidator = (value) => {
  if (typeof value !== "string") {
    return false;
  }
  return value[0] === "9";
};
