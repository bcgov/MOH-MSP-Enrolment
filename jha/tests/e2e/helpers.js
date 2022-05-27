import { cloneDeep } from 'lodash';

export const removeUniqueFields = (baseApplicationObj) => {
  const applicationObj = cloneDeep(baseApplicationObj);

  delete applicationObj?.uuid;
  delete applicationObj?.medicalServicesPlan?.uuid;
  delete applicationObj?.fairPharmaCare?.uuid;
  delete applicationObj?.supplementaryBenefits?.uuid;
  delete applicationObj?.medicalServicesPlan?.attachmentUuids;
  delete applicationObj?.medicalServicesPlan?.spouse?.attachmentUuids;
  delete applicationObj?.medicalServicesPlan?.children?.attachmentUuids;
  delete applicationObj?.authorizedByApplicantDate;
  delete applicationObj?.fairPharmaCare?.processDate;

  applicationObj?.medicalServicesPlan?.children?.forEach(child => {
    delete child.attachmentUuids
  })

  applicationObj?.medicalServicesPlan?.attachments?.forEach(attachment => {
    delete attachment.attachmentUuid
  });

  applicationObj?.supplementaryBenefits?.attachments?.forEach(attachment => {
    delete attachment.attachmentUuid
  });

  return applicationObj;
}

export const padInteger = (int, spaces = 2, padChar = '0') => String(int).padStart(spaces, padChar);
export const formatDate = (date) => `${date.getFullYear()}-${padInteger(date.getMonth())}-${date.getDate()}`