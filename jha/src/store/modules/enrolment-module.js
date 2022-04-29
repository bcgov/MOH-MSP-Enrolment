import { v4 as uuidv4 } from 'uuid';
import dummyData from '@/store/states/enrolment-module-dummy-data';
import settings from '@/settings';
import {
  eqMsgCodesMSP,
  eqMsgCodesFPC,
  eqMsgCodesSB,
} from '@/constants/eqMsgCodes';

export const MODULE_NAME = 'enrolmentModule';

// Action names.
export const RESET_FORM = 'resetForm';
export const SET_APPLICATION_UUID = 'setApplicationUuid';
export const SET_MSP_UUID = 'setMSPUuid';
export const SET_FPC_UUID = 'setFPCUuid';
export const SET_SB_UUID = 'setSBUuid';
export const SET_CAPTCHA_TOKEN = 'setCaptchaToken';
export const SET_SUBMISSION_DATE = 'setSubmissionDate';
export const SET_SUBMISSION_API_RESPONSE = 'setSubmissionAPIResponse';
export const SET_MSP_REFERENCE_NUMBER = 'setMSPReferenceNumber';
export const SET_FPC_REFERENCE_NUMBER = 'setFPCReferenceNumber';
export const SET_SB_REFERENCE_NUMBER = 'setSBReferenceNumber';
export const SET_IS_INFO_COLLECTION_NOTICE_OPEN = 'setIsInfoCollectionNoticeOpen';
// Eligibility Questionnaires
export const SET_EQ_MSP_IS_APPLYING = 'setEqMSPIsApplying';
export const SET_EQ_MSP_LIVE_IN_BC = 'setEqMSPLiveInBC';
export const SET_EQ_MSP_AWAY_OVER_30 = 'setEqMSPAwayOver30';
export const SET_EQ_MSP_STUDENT_MINOR_REFUGEE = 'setEqMSPStudentMinorRefugee';
export const SET_EQ_MSP_HAS_DOCUMENTS = 'setEqMSPHasDocuments';
export const SET_EQ_FPC_IS_APPLYING = 'setEqFPCIsApplying';
export const SET_EQ_FPC_MEETS_CRITERIA = 'setEqFPCMeetsCriteria';
export const SET_EQ_FPC_HAS_INFO = 'setEqFPCHasInfo';
export const SET_EQ_SB_IS_APPLYING = 'setEqSBIsApplying';
export const SET_EQ_SB_MEETS_CRITERIA = 'setEqSBMeetsCriteria';
export const SET_EQ_SB_HAS_INFO = 'setEqSBhasInfo';
// Form selection page message codes
export const SET_MSG_CODE_MSP = 'setMsgCodeMSP';
export const SET_MSG_CODE_FPC = 'setMsgCodeFPC';
export const SET_MSG_CODE_SB = 'setMsgCodeSB';
// Form selections
export const SET_IS_APPLYING_FOR_MSP = 'setIsApplyingForMSP';
export const SET_IS_APPLYING_FOR_FPCARE = 'setIsApplyingForFPCare';
export const SET_IS_APPLYING_FOR_SUPP_BEN = 'setIsApplyingForSuppBen';
// Account Holder info.
export const SET_AH_FIRST_NAME = 'setAHFirstName';
export const SET_AH_MIDDLE_NAME = 'setAHMiddleName';
export const SET_AH_LAST_NAME = 'setAHLastName';
export const SET_AH_BIRTHDATE = 'setAHBirthdate';
export const SET_AH_PHN = 'setAHPHN';
export const SET_AH_SIN = 'setAHSIN';
export const SET_AH_GENDER = 'setAHGender';
export const SET_AH_CITIZENSHIP_STATUS = 'setAHCitizenshipStatus';
export const SET_AH_CITIZENSHIP_STATUS_REASON = 'setAHCitizenshipStatusReason';
export const SET_AH_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE = 'setAHCitizenshipSupportDocumentType';
export const SET_AH_GENDER_MATCHES = 'setAHGenderMatches';
export const SET_AH_CITIZENSHIP_SUPPORT_DOCUMENTS = 'setAHCitizenshipSupportDocuments';
export const SET_AH_IS_NAME_CHANGED = 'setAHIsNameChanged';
export const SET_AH_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE = 'setAHNameChangeSupportDocumentType';
export const SET_AH_NAME_CHANGE_SUPPORT_DOCUMENTS = 'setAHNameChangeSupportDocuments';
export const SET_AH_FROM_PROVINCE_OR_COUNTRY = 'setAHFromProvinceOrCountry';
export const SET_AH_HAS_LIVED_IN_BC_SINCE_BIRTH = 'setAHHasLivedInBCSinceBirth';
export const SET_AH_IS_MOVED_TO_BC_PERMANENTLY = 'setAHIsMovedToBCPermanently';
export const SET_AH_MOVE_FROM_ORIGIN = 'setAHMoveFromOrigin';
export const SET_AH_ARRIVAL_DATE_IN_BC = 'setAHArrivalDateInBC';
export const SET_AH_ARRIVAL_DATE_IN_CANADA = 'setAHArrivalDateInCanada';
export const SET_AH_PREVIOUS_HEALTH_NUMBER = 'setAHPreviousHealthNumber';
export const SET_AH_IS_OUTSIDE_BC_LAST_12_MONTHS = 'setAHOutsideBCLast12Months';
export const SET_AH_OUTSIDE_BC_LAST_12_MONTHS_REASON = 'setAHOutsideBCLast12MonthsReason';
export const SET_AH_OUTSIDE_BC_LAST_12_MONTHS_LOCATION = 'setAHOutsideBCLast12MonthsLocation';
export const SET_AH_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE = 'setAHOutsideBCLast12MonthsDepartureDate';
export const SET_AH_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE = 'setAHOutsideBCLast12MonthsReturnDate';
export const SET_AH_HAS_PREVIOUS_PHN = 'setAHHasPreviousPHN';
export const SET_AH_PREVIOUS_PHN = 'setAHPreviousPHN';
export const SET_AH_IS_RELEASED_FROM_ARMED_FORCES = 'setIsReleasedFromArmedForces';
export const SET_AH_ARMED_FORCES_DISCHARGE_DATE = 'setArmedForcesDischargeDate';
export const SET_AH_IS_STUDENT = 'setAHIsStudent';
export const SET_AH_WILL_STUDENT_RESIDE_IN_BC = 'setAHWillStudentResideInBC';
export const SET_AH_CRA_DOCUMENTS = 'setAHCRADocuments';
export const SET_AH_FPC_INCOME = 'setAHFPCIncome';
export const SET_AH_FPC_RDSP = 'setAHFPCRDSP';
// Spouse info
export const SET_HAS_SPOUSE = 'setHasSpouse';
export const SET_SPOUSE_STATUS = 'setSpouseStatus';
export const SET_SPOUSE_STATUS_REASON = 'setSpouseStatusReason';
export const SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE = 'setSpouseCitizenshipSupportDocumentType';
export const SET_SPOUSE_GENDER_MATCHES = 'setSpouseGenderMatches';
export const SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS = 'setSpouseCitizenshipSupportDocuments';
export const SET_SPOUSE_IS_NAME_CHANGED = 'setSpouseIsNameChanged';
export const SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE = 'setSpouseNameChangeSupportDocumentType';
export const SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS = 'setSpouseNameChangeSupportDocuments';
export const SET_SPOUSE_FIRST_NAME = 'setSpouseFirstName';
export const SET_SPOUSE_MIDDLE_NAME = 'setSpouseMiddleName';
export const SET_SPOUSE_LAST_NAME = 'setSpouseLastName';
export const SET_SPOUSE_BIRTH_DATE = 'setSpouseBirthDate';
export const SET_SPOUSE_PHN = 'setSpousePHN';
export const SET_SPOUSE_SIN = 'setSpouseSIN';
export const SET_SPOUSE_GENDER = 'setSpouseGender';
export const SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH = 'setSpouseLivedInBCSinceBirth';
export const SET_SPOUSE_MADE_PERMANENT_MOVE = 'setSpouseMadePermanentMove';
export const SET_SPOUSE_MOVE_FROM_ORIGIN = 'setSpouseMoveFromOrigin';
export const SET_SPOUSE_RECENT_BC_MOVE_DATE = 'setSpouseRecentBCMoveDate';
export const SET_SPOUSE_CANADA_ARRIVAL_DATE = 'setSpouseCanadaArrivalDate';
export const SET_SPOUSE_PREVIOUS_HEALTH_NUMBER = 'setSpousePreviousHealthNumber';
export const SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS = 'setSpouseOutsideBCLast12Months';
export const SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON = 'setSpouseOutsideBCLast12MonthsReason';
export const SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION = 'setSpouseOutsideBCLast12MonthsDestination';
export const SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE = 'setSpouseOutsideBCLast12MonthsDepartureDate';
export const SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE = 'setSpouseOutsideBCLast12MonthsReturnDate';
export const SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER = 'setSpouseHasPreviousBCHealthNumber';
export const SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER = 'setSpousePreviousBCHealthNumber';
export const SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION = 'setSpouseBeenReleasedFromInstitution';
export const SET_SPOUSE_DISCHARGE_DATE = 'setSpouseDischargeDate';
export const SET_SPOUSE_CRA_DOCUMENTS = 'setSpouseCRADocuments';
export const SET_SPOUSE_FPC_INCOME = 'setSpouseFPCIncome';
export const SET_SPOUSE_FPC_RDSP = 'setSpouseFPCRDSP';
// Child info
export const SET_HAS_CHILDREN = 'setHasChildren';
export const SET_NUM_CHILDREN = 'setNumChildren';
export const SET_CHILDREN = 'setChildren';
// SuppBenInfo
export const SET_SELECTED_NOA_YEAR = 'setSelectedNOAYear';
export const SET_AH_SB_INCOME = 'setAHSBIncome';
export const SET_SPOUSE_SB_INCOME = 'setSpouseSBIncome';
export const SET_CLAIMED_CHILD_CARE_EXPENSES = 'setClaimedChildCareExpenses';
export const SET_HAS_DISABILITY_CREDIT = 'setHasDisabilityCredit';
export const SET_SELECTED_DISABILITY_RECIPIENTS = 'setSelectedDisabilityRecipients';
export const SET_NUM_DISABILITY_CHILDREN = 'setNumDisabilityChildren';
export const SET_HAS_RDSP = 'setHasRDSP';
export const SET_SB_RDSP_AMOUNT = 'setSBRDSPAmount';
export const SET_HAS_ATTENDANT_NURSING_EXPENSES = 'setHasAttendantNursingExpenses';
export const SET_SELECTED_ATTENDANT_NURSING_RECIPIENTS = 'setSelectedAttendantNursingRecipients';
export const SET_NUM_ATTENDANT_NURSING_CHILDREN = 'setNumAttendantNursingChildren';
export const SET_ATTENDANT_NURSING_RECEIPTS = 'setAttendantNursingReceipts';
// Calculated SuppBen Widget Values
export const SET_SB_TOTAL_HOUSEHOLD_INCOME = 'setSBTotalHouseholdIncome';
export const SET_AH_65_DEDUCTION = 'setAh65Deduction';
export const SET_SPOUSE_DEDUCTION = 'setSpouseDeduction';
export const SET_SPOUSE_65_DEDUCTION = 'setSpouse65Deduction';
export const SET_CHILD_DEDUCTION = 'setChildDeduction';
export const SET_CHILD_ADJUSTED_DEDUCTION = 'setChildAdjustedDeduction';
export const SET_AH_DISABILITY_CREDIT_DEDUCTION = 'setAHDisabilityCreditDeduction';
export const SET_SPOUSE_DISABILITY_CREDIT_DEDUCTION = 'setSpouseDisabilityCreditDeduction';
export const SET_CHILD_DISABILITY_CREDIT_DEDUCTION = 'setChildDisabilityCreditDeduction';
export const SET_SB_RDSP_DEDUCTION = 'setSBRDSPDeduction';
export const SET_AH_ATTENDANT_NURSING_DEDUCTION = 'setAHAttendantNursingDeduction';
export const SET_SPOUSE_ATTENDANT_NURSING_DEDUCTION = 'setSpouseAttendantNursingDeduction';
export const SET_CHILD_ATTENDANT_NURSING_DEDUCTION = 'setChildAttendantNursingDeduction';
export const SET_SB_TOTAL_DEDUCTIONS = 'setSBTotalDeductions';
export const SET_SB_ADJUSTED_INCOME = 'setSBAdjustedIncome';
export const SET_SB_INCOME_UNDER_THRESHOLD = 'setSBIncomeUnderThreshold';
// Contact info
export const SET_RES_ADDRESS_LINE_1 = 'setResAddressLine1';
export const SET_RES_ADDRESS_LINE_2 = 'setResAddressLine2';
export const SET_RES_ADDRESS_LINE_3 = 'setResAddressLine3';
export const SET_RES_CITY = 'setResCity';
export const SET_RES_PROVINCE = 'setResProvince';
export const SET_RES_COUNTRY = 'setResCountry';
export const SET_RES_POSTAL_CODE = 'setResPostalCode';
export const SET_MAIL_ADDRESS_LINE_1 = 'setMailAddressLine1';
export const SET_MAIL_ADDRESS_LINE_2 = 'setMailAddressLine2';
export const SET_MAIL_ADDRESS_LINE_3 = 'setMailAddressLine3';
export const SET_MAIL_CITY = 'setMailCity';
export const SET_MAIL_PROVINCE = 'setMailProvince';
export const SET_MAIL_COUNTRY = 'setMailCountry';
export const SET_MAIL_POSTAL_CODE = 'setMailPostalCode';
export const SET_IS_MAIL_SAME = 'setIsMailSame';
export const SET_PHONE = 'setPhone';
// Consent Info
export const SET_POWER_OF_ATTORNEY = 'setPowerOfAttorney';
export const SET_FPC_POWER_OF_ATTORNEY_DOCUMENTS = 'setFPCPowerOfAttorneyDocuments';
export const SET_SB_POWER_OF_ATTORNEY_DOCUMENTS = 'setSBPowerOfAttorneyDocuments';
export const SET_MSP_POWER_OF_ATTORNEY_DOCUMENTS = 'setMSPPowerOfAttorneyDocuments';

export default {
  namespaced: true,
  state: () => {
    const state = {
      applicationUuid: uuidv4(),
      mspUuid: null,
      fpcUuid: null,
      sbUuid: null,
      captchaToken: null,
      submissionDate: null,
      submissionAPIResponse: null,
      mspReferenceNumber: null,
      fpcReferenceNumber: null,
      sbReferenceNumber: null,
      isInfoCollectionNoticeOpen: true,
      // Eligibility Questionnaires
      eqMSPIsApplying: null,
      eqMSPLiveInBC: null,
      eqMSPAwayOver30: null,
      eqMSPStudentMinorRefugee: null,
      eqMSPHasDocuments: null,
      eqFPCIsApplying: null,
      eqFPCMeetsCriteria: null,
      eqFPCHasInfo: null,
      eqSBIsApplying: null,
      eqSBMeetsCriteria: null,
      eqSBhasInfo: null,
      // Form selection page message codes
      msgCodeMSP: eqMsgCodesMSP.NotApplying,
      msgCodeFPC: eqMsgCodesFPC.NotApplying,
      msgCodeSB: eqMsgCodesSB.NotApplying,
      // Form selections
      isApplyingForMSP: null,
      isApplyingForFPCare: null,
      isApplyingForSuppBen: null,
      // Account Holder info.
      ahFirstName: null,
      ahMiddleName: null,
      ahLastName: null,
      ahBirthdate: null,
      ahPHN: null,
      ahSIN: null,
      ahGender: null,
      ahCitizenshipStatus: null,
      ahCitizenshipStatusReason: null,
      ahCitizenshipSupportDocumentType: null,
      ahGenderMatches: null,
      ahCitizenshipSupportDocuments: [],
      ahIsNameChanged: null,
      ahNameChangeSupportDocumentType: null,
      ahNameChangeSupportDocuments: [],
      ahFromProvinceOrCountry: null,
      ahHasLivedInBCSinceBirth: null,
      ahIsMovedToBCPermanently: null,
      ahMoveFromOrigin: null,
      ahArrivalDateInBC: null,
      ahArrivalDateInCanada: null,
      ahPreviousHealthNumber: null,
      ahIsOutsideBCLast12Months: null,
      ahOutsideBCLast12MonthsReason: null,
      ahOutsideBCLast12MonthsLocation: null,
      ahOutsideBCLast12MonthsDepartureDate: null,
      ahOutsideBCLast12MonthsReturnDate: null,
      ahHasPreviousPHN: null,
      ahPreviousPHN: null,
      ahIsReleasedFromArmedForces: null,
      ahArmedForcesDischargeDate: null,
      ahIsStudent: null,
      ahWillStudentResideInBC: null,
      ahCRADocuments: [],
      ahFPCIncome: null,
      ahFPCRDSP: null,
      // Spouse info
      hasSpouse: null,
      spouseStatus: null,
      spouseStatusReason: null,
      spouseCitizenshipSupportDocumentType: null,
      spouseGenderMatches: null,
      spouseCitizenshipSupportDocuments: [],
      spouseIsNameChanged: null,
      spouseNameChangeSupportDocumentType: null,
      spouseNameChangeSupportDocuments: [],
      spouseFirstName: null,
      spouseMiddleName: null,
      spouseLastName: null,
      spouseBirthDate: null,
      spousePHN: null,
      spouseSIN: null,
      spouseGender: null,
      spouseLivedInBCSinceBirth: null,
      spouseMadePermanentMove: null,
      spouseMoveFromOrigin: null,
      spouseRecentBCMoveDate: null,
      spouseCanadaArrivalDate: null,
      spousePreviousHealthNumber: null,
      spouseOutsideBCLast12Months: null,
      spouseOutsideBCLast12MonthsReason: null,
      spouseOutsideBCLast12MonthsDestination: null,
      spouseOutsideBCLast12MonthsDepartureDate: null,
      spouseOutsideBCLast12MonthsReturnDate: null,
      spouseHasPreviousBCHealthNumber: null,
      spousePreviousBCHealthNumber: null,
      spouseBeenReleasedFromInstitution: null,
      spouseDischargeDate: null,
      spouseCRADocuments: [],
      spouseFPCIncome: null,
      spouseFPCRDSP: null,
      // Child info
      hasChildren: null,
      numChildren: 0,
      children: [],
      // SuppBenInfo
      selectedNOAYear: null,
      ahSBIncome: null,
      spouseSBIncome: null,
      claimedChildCareExpenses: null,
      hasDisabilityCredit: null,
      selectedDisabilityRecipients: [],
      numDisabilityChildren: null,
      hasRDSP: null,
      sbRDSPAmount: null,
      hasAttendantNursingExpenses: null,
      selectedAttendantNursingRecipients: [],
      numAttendantNursingChildren: null,
      attendantNursingReceipts: [],
      // Calculated SuppBen Widget Values
      sbTotalHouseholdIncome: 0,
      ah65Deduction: 0,
      spouseDeduction: 0,
      spouse65Deduction: 0,
      childDeduction: 0,
      childAdjustedDeduction: 0,
      ahDisabilityCreditDeduction: 0,
      spouseDisabilityCreditDeduction: 0,
      childDisabilityCreditDeduction: 0,
      sbRDSPDeduction: 0,
      ahAttendantNursingDeduction: 0,
      spouseAttendantNursingDeduction: 0,
      childAttendantNursingDeduction: 0,
      sbTotalDeductions: 0,
      sbAdjustedIncome: 0,
      sbIncomeUnderThreshold: null,
      // Contact info
      resAddressLine1: null,
      resAddressLine2: null,
      resAddressLine3: null,
      resCity: null,
      resProvince: "British Columbia",
      resCountry: "Canada",
      resPostalCode: null,
      mailAddressLine1: null,
      mailAddressLine2: null,
      mailAddressLine3: null,
      mailCity: null,
      mailProvince: "British Columbia",
      mailCountry: "Canada",
      mailPostalCode: null,
      isMailSame: true,
      phone: null,
      // Consent Info
      hasPowerOfAttorney: null,
      fpcPowerOfAttorneyDocuments: [],
      mspPowerOfAttorneyDocuments: [],
      sbPowerOfAttorneyDocuments: [],
    };
    if (settings.useDummyData) {
      Object.assign(state, dummyData);
    }
    return state;
  },
  mutations: {
    [SET_APPLICATION_UUID](state, payload) {
      state.applicationUuid = payload;
    },
    [SET_MSP_UUID](state, payload) {
      state.mspUuid = payload;
    },
    [SET_FPC_UUID](state, payload) {
      state.fpcUuid = payload;
    },
    [SET_SB_UUID](state, payload) {
      state.sbUuid = payload;
    },
    [SET_CAPTCHA_TOKEN](state, payload) {
      state.captchaToken = payload;
    },
    [SET_SUBMISSION_DATE](state, payload) {
      state.submissionDate = payload;
    },
    [SET_SUBMISSION_API_RESPONSE](state, payload) {
      state.submissionAPIResponse = payload;
    },
    [SET_MSP_REFERENCE_NUMBER](state, payload) {
      state.mspReferenceNumber = payload;
    },
    [SET_FPC_REFERENCE_NUMBER](state, payload) {
      state.fpcReferenceNumber = payload;
    },
    [SET_SB_REFERENCE_NUMBER](state, payload) {
      state.sbReferenceNumber = payload;
    },
    [SET_IS_INFO_COLLECTION_NOTICE_OPEN](state, payload) {
      state.isInfoCollectionNoticeOpen = payload;
    },
    // Eligibility Questionnaires
    [SET_EQ_MSP_IS_APPLYING](state, payload) {
      state.eqMSPIsApplying = payload;
    },
    [SET_EQ_MSP_LIVE_IN_BC](state, payload) {
      state.eqMSPLiveInBC = payload;
    },
    [SET_EQ_MSP_AWAY_OVER_30](state, payload) {
      state.eqMSPAwayOver30 = payload;
    },
    [SET_EQ_MSP_STUDENT_MINOR_REFUGEE](state, payload) {
      state.eqMSPStudentMinorRefugee = payload;
    },
    [SET_EQ_MSP_HAS_DOCUMENTS](state, payload) {
      state.eqMSPHasDocuments = payload;
    },
    [SET_EQ_FPC_IS_APPLYING](state, payload) {
      state.eqFPCIsApplying = payload;
    },
    [SET_EQ_FPC_MEETS_CRITERIA](state, payload) {
      state.eqFPCMeetsCriteria = payload;
    },
    [SET_EQ_FPC_HAS_INFO](state, payload) {
      state.eqFPCHasInfo = payload;
    },
    [SET_EQ_SB_IS_APPLYING](state, payload) {
      state.eqSBIsApplying = payload;
    },
    [SET_EQ_SB_MEETS_CRITERIA](state, payload) {
      state.eqSBMeetsCriteria = payload;
    },
    [SET_EQ_SB_HAS_INFO](state, payload) {
      state.eqSBhasInfo = payload;
    },
    // Form selection page message codes
    [SET_MSG_CODE_MSP](state, payload) {
      state.msgCodeMSP = payload;
    },
    [SET_MSG_CODE_FPC](state, payload) {
      state.msgCodeFPC = payload;
    },
    [SET_MSG_CODE_SB](state, payload) {
      state.msgCodeSB = payload;
    },
    // Form selections
    [SET_IS_APPLYING_FOR_MSP](state, payload) {
      state.isApplyingForMSP = payload;
    },
    [SET_IS_APPLYING_FOR_FPCARE](state, payload) {
      state.isApplyingForFPCare = payload;
    },
    [SET_IS_APPLYING_FOR_SUPP_BEN](state, payload) {
      state.isApplyingForSuppBen = payload;
    },
    // Account Holder info.
    [SET_AH_FIRST_NAME](state, payload) {
      state.ahFirstName = payload;
    },
    [SET_AH_MIDDLE_NAME](state, payload) {
      state.ahMiddleName = payload;
    },
    [SET_AH_LAST_NAME](state, payload) {
      state.ahLastName = payload;
    },
    [SET_AH_BIRTHDATE](state, payload) {
      state.ahBirthdate = payload;
    },
    [SET_AH_PHN](state, payload) {
      state.ahPHN = payload;
    },
    [SET_AH_SIN](state, payload) {
      state.ahSIN = payload;
    },
    [SET_AH_GENDER](state, payload) {
      state.ahGender = payload;
    },
    [SET_AH_CITIZENSHIP_STATUS](state, payload) {
      state.ahCitizenshipStatus = payload;
    },
    [SET_AH_CITIZENSHIP_STATUS_REASON](state, payload) {
      state.ahCitizenshipStatusReason = payload;
    },
    [SET_AH_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE](state, payload) {
      state.ahCitizenshipSupportDocumentType = payload;
    },
    [SET_AH_GENDER_MATCHES](state, payload) {
      state.ahGenderMatches = payload;
    },
    [SET_AH_CITIZENSHIP_SUPPORT_DOCUMENTS](state, payload) {
      state.ahCitizenshipSupportDocuments = payload;
    },
    [SET_AH_IS_NAME_CHANGED](state, payload) {
      state.ahIsNameChanged = payload;
    },
    [SET_AH_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE](state, payload) {
      state.ahNameChangeSupportDocumentType = payload;
    },
    [SET_AH_NAME_CHANGE_SUPPORT_DOCUMENTS](state, payload) {
      state.ahNameChangeSupportDocuments = payload;
    },
    [SET_AH_FROM_PROVINCE_OR_COUNTRY](state, payload) {
      state.ahFromProvinceOrCountry = payload;
    },
    [SET_AH_HAS_LIVED_IN_BC_SINCE_BIRTH](state, payload) {
      state.ahHasLivedInBCSinceBirth = payload;
    },
    [SET_AH_IS_MOVED_TO_BC_PERMANENTLY](state, payload) {
      state.ahIsMovedToBCPermanently = payload;
    },
    [SET_AH_MOVE_FROM_ORIGIN](state, payload) {
      state.ahMoveFromOrigin = payload;
    },
    [SET_AH_ARRIVAL_DATE_IN_BC](state, payload) {
      state.ahArrivalDateInBC = payload;
    },
    [SET_AH_ARRIVAL_DATE_IN_CANADA](state, payload) {
      state.ahArrivalDateInCanada = payload;
    },
    [SET_AH_PREVIOUS_HEALTH_NUMBER](state, payload) {
      state.ahPreviousHealthNumber = payload;
    },
    [SET_AH_IS_OUTSIDE_BC_LAST_12_MONTHS](state, payload) {
      state.ahIsOutsideBCLast12Months = payload;
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_REASON](state, payload) {
      state.ahOutsideBCLast12MonthsReason = payload;
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_LOCATION](state, payload) {
      state.ahOutsideBCLast12MonthsLocation = payload;
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE](state, payload) {
      state.ahOutsideBCLast12MonthsDepartureDate = payload;
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE](state, payload) {
      state.ahOutsideBCLast12MonthsReturnDate = payload;
    },
    [SET_AH_HAS_PREVIOUS_PHN](state, payload) {
      state.ahHasPreviousPHN = payload;
    },
    [SET_AH_PREVIOUS_PHN](state, payload) {
      state.ahPreviousPHN = payload;
    },
    [SET_AH_IS_RELEASED_FROM_ARMED_FORCES](state, payload) {
      state.ahIsReleasedFromArmedForces = payload;
    },
    [SET_AH_ARMED_FORCES_DISCHARGE_DATE](state, payload) {
      state.ahArmedForcesDischargeDate = payload;
    },
    [SET_AH_IS_STUDENT](state, payload) {
      state.ahIsStudent = payload;
    },
    [SET_AH_WILL_STUDENT_RESIDE_IN_BC](state, payload) {
      state.ahWillStudentResideInBC = payload;
    },
    [SET_AH_CRA_DOCUMENTS](state, payload) {
      state.ahCRADocuments = payload;
    },
    [SET_AH_FPC_INCOME](state, payload) {
      state.ahFPCIncome = payload;
    },
    [SET_AH_FPC_RDSP](state, payload) {
      state.ahFPCRDSP = payload;
    },
    // Spouse info
    [SET_HAS_SPOUSE](state, payload) {
      state.hasSpouse = payload;
    },
    [SET_SPOUSE_STATUS](state, payload) {
      state.spouseStatus = payload;
    },
    [SET_SPOUSE_STATUS_REASON](state, payload) {
      state.spouseStatusReason = payload;
    },
    [SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE](state, payload) {
      state.spouseCitizenshipSupportDocumentType = payload;
    },
    [SET_SPOUSE_GENDER_MATCHES](state, payload) {
      state.spouseGenderMatches = payload;
    },
    [SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS](state, payload) {
      state.spouseCitizenshipSupportDocuments = payload;
    },
    [SET_SPOUSE_IS_NAME_CHANGED](state, payload) {
      state.spouseIsNameChanged = payload;
    },
    [SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE](state, payload) {
      state.spouseNameChangeSupportDocumentType = payload;
    },
    [SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS](state, payload) {
      state.spouseNameChangeSupportDocuments = payload;
    },
    [SET_SPOUSE_FIRST_NAME](state, payload) {
      state.spouseFirstName = payload;
    },
    [SET_SPOUSE_MIDDLE_NAME](state, payload) {
      state.spouseMiddleName = payload;
    },
    [SET_SPOUSE_LAST_NAME](state, payload) {
      state.spouseLastName = payload;
    },
    [SET_SPOUSE_BIRTH_DATE](state, payload) {
      state.spouseBirthDate = payload;
    },
    [SET_SPOUSE_PHN](state, payload) {
      state.spousePHN = payload;
    },
    [SET_SPOUSE_SIN](state, payload) {
      state.spouseSIN = payload;
    },
    [SET_SPOUSE_GENDER](state, payload) {
      state.spouseGender = payload;
    },
    [SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH](state, payload) {
      state.spouseLivedInBCSinceBirth = payload;
    },
    [SET_SPOUSE_MADE_PERMANENT_MOVE](state, payload) {
      state.spouseMadePermanentMove = payload;
    },
    [SET_SPOUSE_MOVE_FROM_ORIGIN](state, payload) {
      state.spouseMoveFromOrigin = payload;
    },
    [SET_SPOUSE_RECENT_BC_MOVE_DATE](state, payload) {
      state.spouseRecentBCMoveDate = payload;
    },
    [SET_SPOUSE_CANADA_ARRIVAL_DATE](state, payload) {
      state.spouseCanadaArrivalDate = payload;
    },
    [SET_SPOUSE_PREVIOUS_HEALTH_NUMBER](state, payload) {
      state.spousePreviousHealthNumber = payload;
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS](state, payload) {
      state.spouseOutsideBCLast12Months = payload;
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON](state, payload) {
      state.spouseOutsideBCLast12MonthsReason = payload;
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION](state, payload) {
      state.spouseOutsideBCLast12MonthsDestination = payload;
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE](state, payload) {
      state.spouseOutsideBCLast12MonthsDepartureDate = payload;
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE](state, payload) {
      state.spouseOutsideBCLast12MonthsReturnDate = payload;
    },
    [SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER](state, payload) {
      state.spouseHasPreviousBCHealthNumber = payload;
    },
    [SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER](state, payload) {
      state.spousePreviousBCHealthNumber = payload;
    },
    [SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION](state, payload) {
      state.spouseBeenReleasedFromInstitution = payload;
    },
    [SET_SPOUSE_DISCHARGE_DATE](state, payload) {
      state.spouseDischargeDate = payload;
    },
    [SET_SPOUSE_CRA_DOCUMENTS](state, payload) {
      state.spouseCRADocuments = payload;
    },
    [SET_SPOUSE_FPC_INCOME](state, payload) {
      state.spouseFPCIncome = payload;
    },
    [SET_SPOUSE_FPC_RDSP](state, payload) {
      state.spouseFPCRDSP = payload;
    },
    // Child info
    [SET_HAS_CHILDREN](state, payload) {
      state.hasChildren = payload;
    },
    [SET_NUM_CHILDREN](state, payload) {
      state.numChildren = payload;
    },
    [SET_CHILDREN](state, payload) {
      state.children = payload;
    },
    // SuppBenInfo
    [SET_SELECTED_NOA_YEAR](state, payload) {
      state.selectedNOAYear = payload;
    },
    [SET_AH_SB_INCOME](state, payload) {
      state.ahSBIncome = payload;
    },
    [SET_SPOUSE_SB_INCOME](state, payload) {
      state.spouseSBIncome = payload;
    },
    [SET_CLAIMED_CHILD_CARE_EXPENSES](state, payload) {
      state.claimedChildCareExpenses = payload;
    },
    [SET_HAS_DISABILITY_CREDIT](state, payload) {
      state.hasDisabilityCredit = payload;
    },
    [SET_SELECTED_DISABILITY_RECIPIENTS](state, payload) {
      state.selectedDisabilityRecipients = payload;
    },
    [SET_NUM_DISABILITY_CHILDREN](state, payload) {
      state.numDisabilityChildren = payload;
    },
    [SET_HAS_RDSP](state, payload) {
      state.hasRDSP = payload;
    },
    [SET_SB_RDSP_AMOUNT](state, payload) {
      state.sbRDSPAmount = payload;
    },
    [SET_HAS_ATTENDANT_NURSING_EXPENSES](state, payload) {
      state.hasAttendantNursingExpenses = payload;
    },
    [SET_SELECTED_ATTENDANT_NURSING_RECIPIENTS](state, payload) {
      state.selectedAttendantNursingRecipients = payload;
    },
    [SET_NUM_ATTENDANT_NURSING_CHILDREN](state, payload) {
      state.numAttendantNursingChildren = payload;
    },
    [SET_ATTENDANT_NURSING_RECEIPTS](state, payload) {
      state.attendantNursingReceipts = payload;
    },
    // Calculated SuppBen Widget Values
    [SET_SB_TOTAL_HOUSEHOLD_INCOME](state, payload) {
      state.sbTotalHouseholdIncome = payload;
    },
    [SET_AH_65_DEDUCTION](state, payload) {
      state.ah65Deduction = payload;
    },
    [SET_SPOUSE_DEDUCTION](state, payload) {
      state.spouseDeduction = payload;
    },
    [SET_SPOUSE_65_DEDUCTION](state, payload) {
      state.spouse65Deduction = payload;
    },
    [SET_CHILD_DEDUCTION](state, payload) {
      state.childDeduction = payload;
    },
    [SET_CHILD_ADJUSTED_DEDUCTION](state, payload) {
      state.childAdjustedDeduction = payload;
    },
    [SET_AH_DISABILITY_CREDIT_DEDUCTION](state, payload) {
      state.ahDisabilityCreditDeduction = payload;
    },
    [SET_SPOUSE_DISABILITY_CREDIT_DEDUCTION](state, payload) {
      state.spouseDisabilityCreditDeduction = payload;
    },
    [SET_CHILD_DISABILITY_CREDIT_DEDUCTION](state, payload) {
      state.childDisabilityCreditDeduction = payload;
    },
    [SET_SB_RDSP_DEDUCTION](state, payload) {
      state.sbRDSPDeduction = payload;
    },
    [SET_AH_ATTENDANT_NURSING_DEDUCTION](state, payload) {
      state.ahAttendantNursingDeduction = payload;
    },
    [SET_SPOUSE_ATTENDANT_NURSING_DEDUCTION](state, payload) {
      state.spouseAttendantNursingDeduction = payload;
    },
    [SET_CHILD_ATTENDANT_NURSING_DEDUCTION](state, payload) {
      state.childAttendantNursingDeduction = payload;
    },
    [SET_SB_TOTAL_DEDUCTIONS](state, payload) {
      state.sbTotalDeductions = payload;
    },
    [SET_SB_ADJUSTED_INCOME](state, payload) {
      state.sbAdjustedIncome = payload;
    },
    [SET_SB_INCOME_UNDER_THRESHOLD](state, payload) {
      state.sbIncomeUnderThreshold = payload;
    },
    // Contact info
    [SET_RES_ADDRESS_LINE_1](state, payload) {
      state.resAddressLine1 = payload;
    },
    [SET_RES_ADDRESS_LINE_2](state, payload) {
      state.resAddressLine2 = payload;
    },
    [SET_RES_ADDRESS_LINE_3](state, payload) {
      state.resAddressLine3 = payload;
    },
    [SET_RES_CITY](state, payload) {
      state.resCity = payload;
    },
    [SET_RES_PROVINCE](state, payload) {
      state.resProvince = payload;
    },
    [SET_RES_COUNTRY](state, payload) {
      state.resCountry = payload;
    },
    [SET_RES_POSTAL_CODE](state, payload) {
      state.resPostalCode = payload;
    },
    [SET_MAIL_ADDRESS_LINE_1](state, payload) {
      state.mailAddressLine1 = payload;
    },
    [SET_MAIL_ADDRESS_LINE_2](state, payload) {
      state.mailAddressLine2 = payload;
    },
    [SET_MAIL_ADDRESS_LINE_3](state, payload) {
      state.mailAddressLine3 = payload;
    },
    [SET_MAIL_CITY](state, payload) {
      state.mailCity = payload;
    },
    [SET_MAIL_PROVINCE](state, payload) {
      state.mailProvince = payload;
    },
    [SET_MAIL_COUNTRY](state, payload) {
      state.mailCountry = payload;
    },
    [SET_MAIL_POSTAL_CODE](state, payload) {
      state.mailPostalCode = payload;
    },
    [SET_IS_MAIL_SAME](state, payload) {
      state.isMailSame = payload;
    },
    [SET_PHONE](state, payload) {
      state.phone = payload;
    },
    // Consent
    [SET_POWER_OF_ATTORNEY](state, payload) {
      state.hasPowerOfAttorney = payload;
    },
    [SET_FPC_POWER_OF_ATTORNEY_DOCUMENTS](state, payload) {
      state.fpcPowerOfAttorneyDocuments = payload;
    },
    [SET_MSP_POWER_OF_ATTORNEY_DOCUMENTS](state, payload) {
      state.mspPowerOfAttorneyDocuments = payload;
    },
    [SET_SB_POWER_OF_ATTORNEY_DOCUMENTS](state, payload) {
      state.sbPowerOfAttorneyDocuments = payload;
    },
  },
  actions: {
    [RESET_FORM]({ commit }) {
      commit(SET_APPLICATION_UUID, uuidv4());
      commit(SET_MSP_UUID, null);
      commit(SET_FPC_UUID, null);
      commit(SET_SB_UUID, null);
      commit(SET_CAPTCHA_TOKEN, null);
      commit(SET_SUBMISSION_DATE, null);
      commit(SET_SUBMISSION_API_RESPONSE, null);
      commit(SET_MSP_REFERENCE_NUMBER, null);
      commit(SET_FPC_REFERENCE_NUMBER, null);
      commit(SET_SB_REFERENCE_NUMBER, null);
      commit(SET_IS_INFO_COLLECTION_NOTICE_OPEN, true);
      // Eligibility Questionnaires
      commit(SET_EQ_MSP_IS_APPLYING, null);
      commit(SET_EQ_MSP_LIVE_IN_BC, null);
      commit(SET_EQ_MSP_AWAY_OVER_30, null);
      commit(SET_EQ_MSP_STUDENT_MINOR_REFUGEE, null);
      commit(SET_EQ_MSP_HAS_DOCUMENTS, null);
      commit(SET_EQ_FPC_IS_APPLYING, null);
      commit(SET_EQ_FPC_MEETS_CRITERIA, null);
      commit(SET_EQ_FPC_HAS_INFO, null);
      commit(SET_EQ_SB_IS_APPLYING, null);
      commit(SET_EQ_SB_MEETS_CRITERIA, null);
      commit(SET_EQ_SB_HAS_INFO, null);
      // Form selection page message codes
      commit(SET_MSG_CODE_MSP, 0);
      commit(SET_MSG_CODE_FPC, 0);
      commit(SET_MSG_CODE_SB, 0);
      // Form selections
      commit(SET_IS_APPLYING_FOR_MSP, null);
      commit(SET_IS_APPLYING_FOR_FPCARE, null);
      commit(SET_IS_APPLYING_FOR_SUPP_BEN, null);
      // Account Holder info.
      commit(SET_AH_FIRST_NAME, null);
      commit(SET_AH_MIDDLE_NAME, null);
      commit(SET_AH_LAST_NAME, null);
      commit(SET_AH_BIRTHDATE, null);
      commit(SET_AH_PHN, null);
      commit(SET_AH_SIN, null);
      commit(SET_AH_GENDER, null);
      commit(SET_AH_CITIZENSHIP_STATUS, null);
      commit(SET_AH_CITIZENSHIP_STATUS_REASON, null);
      commit(SET_AH_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE, null);
      commit(SET_AH_GENDER_MATCHES, null);
      commit(SET_AH_CITIZENSHIP_SUPPORT_DOCUMENTS, []);
      commit(SET_AH_IS_NAME_CHANGED, null);
      commit(SET_AH_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE, null);
      commit(SET_AH_NAME_CHANGE_SUPPORT_DOCUMENTS, []);
      commit(SET_AH_FROM_PROVINCE_OR_COUNTRY, null);
      commit(SET_AH_HAS_LIVED_IN_BC_SINCE_BIRTH, null);
      commit(SET_AH_IS_MOVED_TO_BC_PERMANENTLY, null);
      commit(SET_AH_MOVE_FROM_ORIGIN, null);
      commit(SET_AH_ARRIVAL_DATE_IN_BC, null);
      commit(SET_AH_ARRIVAL_DATE_IN_CANADA, null);
      commit(SET_AH_PREVIOUS_HEALTH_NUMBER, null);
      commit(SET_AH_IS_OUTSIDE_BC_LAST_12_MONTHS, null);
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_REASON, null);
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_LOCATION, null);
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE, null);
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE, null);
      commit(SET_AH_HAS_PREVIOUS_PHN, null);
      commit(SET_AH_PREVIOUS_PHN, null);
      commit(SET_AH_IS_RELEASED_FROM_ARMED_FORCES, null);
      commit(SET_AH_ARMED_FORCES_DISCHARGE_DATE, null);
      commit(SET_AH_IS_STUDENT, null);
      commit(SET_AH_WILL_STUDENT_RESIDE_IN_BC, null);
      commit(SET_AH_CRA_DOCUMENTS, []);
      commit(SET_AH_FPC_INCOME, null);
      commit(SET_AH_FPC_RDSP, null);
      // Spouse info
      commit(SET_HAS_SPOUSE, null);
      commit(SET_SPOUSE_STATUS, null);
      commit(SET_SPOUSE_STATUS_REASON, null);
      commit(SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE, null);
      commit(SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS, []);
      commit(SET_SPOUSE_IS_NAME_CHANGED, null);
      commit(SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE, null);
      commit(SET_SPOUSE_GENDER_MATCHES, null);
      commit(SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS, []);
      commit(SET_SPOUSE_FIRST_NAME, null);
      commit(SET_SPOUSE_MIDDLE_NAME, null);
      commit(SET_SPOUSE_LAST_NAME, null);
      commit(SET_SPOUSE_BIRTH_DATE, null);
      commit(SET_SPOUSE_PHN, null);
      commit(SET_SPOUSE_SIN, null);
      commit(SET_SPOUSE_GENDER, null);
      commit(SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH, null);
      commit(SET_SPOUSE_MADE_PERMANENT_MOVE, null);
      commit(SET_SPOUSE_MOVE_FROM_ORIGIN, null);
      commit(SET_SPOUSE_RECENT_BC_MOVE_DATE, null);
      commit(SET_SPOUSE_CANADA_ARRIVAL_DATE, null);
      commit(SET_SPOUSE_PREVIOUS_HEALTH_NUMBER, null);
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS, null);
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON, null);
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION, null);
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE, null);
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE, null);
      commit(SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER, null);
      commit(SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER, null);
      commit(SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION, null);
      commit(SET_SPOUSE_DISCHARGE_DATE, null);
      commit(SET_SPOUSE_CRA_DOCUMENTS, []);
      commit(SET_SPOUSE_FPC_INCOME, null);
      commit(SET_SPOUSE_FPC_RDSP, null);
      // SuppBen info
      commit(SET_SELECTED_NOA_YEAR, null);
      commit(SET_AH_SB_INCOME, null);
      commit(SET_SPOUSE_SB_INCOME, null);
      commit(SET_CLAIMED_CHILD_CARE_EXPENSES, null);
      commit(SET_HAS_DISABILITY_CREDIT, null);
      commit(SET_SELECTED_DISABILITY_RECIPIENTS, []);
      commit(SET_NUM_DISABILITY_CHILDREN, null);
      commit(SET_HAS_RDSP, null);
      commit(SET_SB_RDSP_AMOUNT, null);
      commit(SET_HAS_ATTENDANT_NURSING_EXPENSES, null);
      commit(SET_SELECTED_ATTENDANT_NURSING_RECIPIENTS, []);
      commit(SET_NUM_ATTENDANT_NURSING_CHILDREN, null);
      commit(SET_ATTENDANT_NURSING_RECEIPTS, []);
      // Calculated SuppBen Widget Values
      commit(SET_SB_TOTAL_HOUSEHOLD_INCOME, 0);
      commit(SET_AH_65_DEDUCTION, 0);
      commit(SET_SPOUSE_DEDUCTION, 0);
      commit(SET_SPOUSE_65_DEDUCTION, 0);
      commit(SET_CHILD_DEDUCTION, 0);
      commit(SET_CHILD_ADJUSTED_DEDUCTION, 0);
      commit(SET_AH_DISABILITY_CREDIT_DEDUCTION, 0);
      commit(SET_SPOUSE_DISABILITY_CREDIT_DEDUCTION, 0);
      commit(SET_CHILD_DISABILITY_CREDIT_DEDUCTION, 0);
      commit(SET_SB_RDSP_DEDUCTION, 0);
      commit(SET_AH_ATTENDANT_NURSING_DEDUCTION, 0);
      commit(SET_SPOUSE_ATTENDANT_NURSING_DEDUCTION, 0);
      commit(SET_CHILD_ATTENDANT_NURSING_DEDUCTION, 0);
      commit(SET_SB_TOTAL_DEDUCTIONS, 0);
      commit(SET_SB_ADJUSTED_INCOME, 0);
      commit(SET_SB_INCOME_UNDER_THRESHOLD, null);
      // Child info
      commit(SET_HAS_CHILDREN, null);
      commit(SET_NUM_CHILDREN, null);
      commit(SET_CHILDREN, []);
      //contact info
      commit(SET_RES_ADDRESS_LINE_1, null);
      commit(SET_RES_ADDRESS_LINE_2, null);
      commit(SET_RES_ADDRESS_LINE_3, null);
      commit(SET_RES_CITY, null);
      commit(SET_RES_PROVINCE, 'British Columbia');
      commit(SET_RES_COUNTRY, 'Canada');
      commit(SET_RES_POSTAL_CODE, null);
      commit(SET_MAIL_ADDRESS_LINE_1, null);
      commit(SET_MAIL_ADDRESS_LINE_2, null);
      commit(SET_MAIL_ADDRESS_LINE_3, null);
      commit(SET_MAIL_CITY, null);
      commit(SET_MAIL_PROVINCE, 'British Columbia');
      commit(SET_MAIL_COUNTRY, 'Canada');
      commit(SET_MAIL_POSTAL_CODE, null);
      commit(SET_IS_MAIL_SAME, true);
      commit(SET_PHONE, null);
      // consent
      commit(SET_FPC_POWER_OF_ATTORNEY_DOCUMENTS, []);
      commit(SET_MSP_POWER_OF_ATTORNEY_DOCUMENTS, []);
      commit(SET_SB_POWER_OF_ATTORNEY_DOCUMENTS, []);
      commit(SET_POWER_OF_ATTORNEY, null);
    },
    [SET_APPLICATION_UUID]({ commit }, payload) {
      commit(SET_APPLICATION_UUID, payload);
    },
    [SET_MSP_UUID]({ commit }, payload) {
      commit(SET_MSP_UUID, payload);
    },
    [SET_FPC_UUID]({ commit }, payload) {
      commit(SET_FPC_UUID, payload);
    },
    [SET_SB_UUID]({ commit }, payload) {
      commit(SET_SB_UUID, payload);
    },
    [SET_CAPTCHA_TOKEN]({ commit }, payload) {
      commit(SET_CAPTCHA_TOKEN, payload);
    },
    [SET_SUBMISSION_DATE]({ commit }, payload) {
      commit(SET_SUBMISSION_DATE, payload);
    },
    [SET_SUBMISSION_API_RESPONSE]({ commit }, payload) {
      commit(SET_SUBMISSION_API_RESPONSE, payload);
    },
    [SET_MSP_REFERENCE_NUMBER]({ commit }, payload) {
      commit(SET_MSP_REFERENCE_NUMBER, payload);
    },
    [SET_FPC_REFERENCE_NUMBER]({ commit }, payload) {
      commit(SET_FPC_REFERENCE_NUMBER, payload);
    },
    [SET_SB_REFERENCE_NUMBER]({ commit }, payload) {
      commit(SET_SB_REFERENCE_NUMBER, payload);
    },
    [SET_IS_INFO_COLLECTION_NOTICE_OPEN]({ commit }, payload) {
      commit(SET_IS_INFO_COLLECTION_NOTICE_OPEN, payload);
    },
    // Eligibility Questionnaires
    [SET_EQ_MSP_IS_APPLYING]({commit}, payload) {
      commit(SET_EQ_MSP_IS_APPLYING, payload);
    },
    [SET_EQ_MSP_LIVE_IN_BC]({commit}, payload) {
      commit(SET_EQ_MSP_LIVE_IN_BC, payload);
    },
    [SET_EQ_MSP_AWAY_OVER_30]({commit}, payload) {
      commit(SET_EQ_MSP_AWAY_OVER_30, payload);
    },
    [SET_EQ_MSP_STUDENT_MINOR_REFUGEE]({commit}, payload) {
      commit(SET_EQ_MSP_STUDENT_MINOR_REFUGEE, payload);
    },
    [SET_EQ_MSP_HAS_DOCUMENTS]({commit}, payload) {
      commit(SET_EQ_MSP_HAS_DOCUMENTS, payload);
    },
    [SET_EQ_FPC_IS_APPLYING]({commit}, payload) {
      commit(SET_EQ_FPC_IS_APPLYING, payload);
    },
    [SET_EQ_FPC_MEETS_CRITERIA]({commit}, payload) {
      commit(SET_EQ_FPC_MEETS_CRITERIA, payload);
    },
    [SET_EQ_FPC_HAS_INFO]({commit}, payload) {
      commit(SET_EQ_FPC_HAS_INFO, payload);
    },
    [SET_EQ_SB_IS_APPLYING]({commit}, payload) {
      commit(SET_EQ_SB_IS_APPLYING, payload);
    },
    [SET_EQ_SB_MEETS_CRITERIA]({commit}, payload) {
      commit(SET_EQ_SB_MEETS_CRITERIA, payload);
    },
    [SET_EQ_SB_HAS_INFO]({commit}, payload) {
      commit(SET_EQ_SB_HAS_INFO, payload);
    },
    // Form selection page message codes
    [SET_MSG_CODE_MSP]({commit}, payload) {
      commit(SET_MSG_CODE_MSP, payload);
    },
    [SET_MSG_CODE_FPC]({commit}, payload) {
      commit(SET_MSG_CODE_FPC, payload);
    },
    [SET_MSG_CODE_SB]({commit}, payload) {
      commit(SET_MSG_CODE_SB, payload);
    },
    // Form selections
    [SET_IS_APPLYING_FOR_MSP]({commit}, payload) {
      commit(SET_IS_APPLYING_FOR_MSP, payload);
    },
    [SET_IS_APPLYING_FOR_FPCARE]({commit}, payload) {
      commit(SET_IS_APPLYING_FOR_FPCARE, payload);
    },
    [SET_IS_APPLYING_FOR_SUPP_BEN]({commit}, payload) {
      commit(SET_IS_APPLYING_FOR_SUPP_BEN, payload);
    },
    // Account Holder info.
    [SET_AH_FIRST_NAME]({ commit }, payload) {
      commit(SET_AH_FIRST_NAME, payload);
    },
    [SET_AH_MIDDLE_NAME]({ commit }, payload) {
      commit(SET_AH_MIDDLE_NAME, payload);
    },
    [SET_AH_LAST_NAME]({ commit }, payload) {
      commit(SET_AH_LAST_NAME, payload);
    },
    [SET_AH_BIRTHDATE]({ commit }, payload) {
      commit(SET_AH_BIRTHDATE, payload);
    },
    [SET_AH_PHN]({ commit }, payload) {
      commit(SET_AH_PHN, payload);
    },
    [SET_AH_SIN]({ commit }, payload) {
      commit(SET_AH_SIN, payload);
    },
    [SET_AH_GENDER]({ commit }, payload) {
      commit(SET_AH_GENDER, payload);
    },
    [SET_AH_CITIZENSHIP_STATUS]({ commit }, payload) {
      commit(SET_AH_CITIZENSHIP_STATUS, payload);
    },
    [SET_AH_CITIZENSHIP_STATUS_REASON]({ commit }, payload) {
      commit(SET_AH_CITIZENSHIP_STATUS_REASON, payload);
    },
    [SET_AH_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE]({ commit }, payload) {
      commit(SET_AH_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE, payload);
    },
    [SET_AH_GENDER_MATCHES]({ commit }, payload) {
      commit(SET_AH_GENDER_MATCHES, payload);
    },
    [SET_AH_CITIZENSHIP_SUPPORT_DOCUMENTS]({ commit }, payload) {
      commit(SET_AH_CITIZENSHIP_SUPPORT_DOCUMENTS, payload);
    },
    [SET_AH_IS_NAME_CHANGED]({ commit }, payload) {
      commit(SET_AH_IS_NAME_CHANGED, payload);
    },
    [SET_AH_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE]({ commit }, payload) {
      commit(SET_AH_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE, payload);
    },
    [SET_AH_NAME_CHANGE_SUPPORT_DOCUMENTS]({ commit }, payload) {
      commit(SET_AH_NAME_CHANGE_SUPPORT_DOCUMENTS, payload);
    },
    [SET_AH_FROM_PROVINCE_OR_COUNTRY]({ commit }, payload) {
      commit(SET_AH_FROM_PROVINCE_OR_COUNTRY, payload);
    },
    [SET_AH_HAS_LIVED_IN_BC_SINCE_BIRTH]({ commit }, payload) {
      commit(SET_AH_HAS_LIVED_IN_BC_SINCE_BIRTH, payload);
    },
    [SET_AH_IS_MOVED_TO_BC_PERMANENTLY]({ commit }, payload) {
      commit(SET_AH_IS_MOVED_TO_BC_PERMANENTLY, payload);
    },
    [SET_AH_MOVE_FROM_ORIGIN]({ commit }, payload) {
      commit(SET_AH_MOVE_FROM_ORIGIN, payload);
    },
    [SET_AH_ARRIVAL_DATE_IN_BC]({ commit }, payload) {
      commit(SET_AH_ARRIVAL_DATE_IN_BC, payload);
    },
    [SET_AH_ARRIVAL_DATE_IN_CANADA]({ commit }, payload) {
      commit(SET_AH_ARRIVAL_DATE_IN_CANADA, payload);
    },
    [SET_AH_PREVIOUS_HEALTH_NUMBER]({ commit }, payload) {
      commit(SET_AH_PREVIOUS_HEALTH_NUMBER, payload);
    },
    [SET_AH_IS_OUTSIDE_BC_LAST_12_MONTHS]({ commit }, payload) {
      commit(SET_AH_IS_OUTSIDE_BC_LAST_12_MONTHS, payload);
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_REASON]({ commit }, payload) {
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_REASON, payload);
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_LOCATION]({ commit }, payload) {
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_LOCATION, payload);
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE]({ commit }, payload) {
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE, payload);
    },
    [SET_AH_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE]({ commit }, payload) {
      commit(SET_AH_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE, payload);
    },
    [SET_AH_HAS_PREVIOUS_PHN]({ commit }, payload) {
      commit(SET_AH_HAS_PREVIOUS_PHN, payload);
    },
    [SET_AH_PREVIOUS_PHN]({ commit }, payload) {
      commit(SET_AH_PREVIOUS_PHN, payload);
    },
    [SET_AH_IS_RELEASED_FROM_ARMED_FORCES]({ commit }, payload) {
      commit(SET_AH_IS_RELEASED_FROM_ARMED_FORCES, payload);
    },
    [SET_AH_ARMED_FORCES_DISCHARGE_DATE]({ commit }, payload) {
      commit(SET_AH_ARMED_FORCES_DISCHARGE_DATE, payload);
    },
    [SET_AH_IS_STUDENT]({ commit }, payload) {
      commit(SET_AH_IS_STUDENT, payload);
    },
    [SET_AH_WILL_STUDENT_RESIDE_IN_BC]({ commit }, payload) {
      commit(SET_AH_WILL_STUDENT_RESIDE_IN_BC, payload);
    },
    [SET_AH_CRA_DOCUMENTS]({ commit }, payload) {
      commit(SET_AH_CRA_DOCUMENTS, payload);
    },
    [SET_AH_FPC_INCOME]({ commit }, payload) {
      commit(SET_AH_FPC_INCOME, payload);
    },
    [SET_AH_FPC_RDSP]({ commit }, payload) {
      commit(SET_AH_FPC_RDSP, payload);
    },
    // Spouse info
    [SET_HAS_SPOUSE]({ commit }, payload) {
      commit(SET_HAS_SPOUSE, payload);
    },
    [SET_SPOUSE_STATUS]({ commit }, payload) {
      commit(SET_SPOUSE_STATUS, payload);
    },
    [SET_SPOUSE_STATUS_REASON]({ commit }, payload) {
      commit(SET_SPOUSE_STATUS_REASON, payload);
    },
    [SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE]({ commit }, payload) {
      commit(SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE, payload);
    },
    [SET_SPOUSE_GENDER_MATCHES]({ commit }, payload) {
      commit(SET_SPOUSE_GENDER_MATCHES, payload);
    },
    [SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS]({ commit }, payload) {
      commit(SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS, payload);
    },
    [SET_SPOUSE_IS_NAME_CHANGED]({ commit }, payload) {
      commit(SET_SPOUSE_IS_NAME_CHANGED, payload);
    },
    [SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE]({ commit }, payload) {
      commit(SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE, payload);
    },
    [SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS]({ commit }, payload) {
      commit(SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS, payload);
    },
    [SET_SPOUSE_FIRST_NAME]({ commit }, payload) {
      commit(SET_SPOUSE_FIRST_NAME, payload);
    },
    [SET_SPOUSE_MIDDLE_NAME]({ commit }, payload) {
      commit(SET_SPOUSE_MIDDLE_NAME, payload);
    },
    [SET_SPOUSE_LAST_NAME]({ commit }, payload) {
      commit(SET_SPOUSE_LAST_NAME, payload);
    },
    [SET_SPOUSE_BIRTH_DATE]({ commit }, payload) {
      commit(SET_SPOUSE_BIRTH_DATE, payload);
    },
    [SET_SPOUSE_PHN]({ commit }, payload) {
      commit(SET_SPOUSE_PHN, payload);
    },
    [SET_SPOUSE_SIN]({ commit }, payload) {
      commit(SET_SPOUSE_SIN, payload);
    },
    [SET_SPOUSE_GENDER]({ commit }, payload) {
      commit(SET_SPOUSE_GENDER, payload);
    },
    [SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH]({ commit }, payload) {
      commit(SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH, payload);
    },
    [SET_SPOUSE_MADE_PERMANENT_MOVE]({ commit }, payload) {
      commit(SET_SPOUSE_MADE_PERMANENT_MOVE, payload);
    },
    [SET_SPOUSE_MOVE_FROM_ORIGIN]({ commit }, payload) {
      commit(SET_SPOUSE_MOVE_FROM_ORIGIN, payload);
    },
    [SET_SPOUSE_RECENT_BC_MOVE_DATE]({ commit }, payload) {
      commit(SET_SPOUSE_RECENT_BC_MOVE_DATE, payload);
    },
    [SET_SPOUSE_CANADA_ARRIVAL_DATE]({ commit }, payload) {
      commit(SET_SPOUSE_CANADA_ARRIVAL_DATE, payload);
    },
    [SET_SPOUSE_PREVIOUS_HEALTH_NUMBER]({ commit }, payload) {
      commit(SET_SPOUSE_PREVIOUS_HEALTH_NUMBER, payload);
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS]({ commit }, payload) {
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS, payload);
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON]({ commit }, payload) {
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON, payload);
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION]({ commit }, payload) {
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION, payload);
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE]({ commit }, payload) {
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE, payload);
    },
    [SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE]({ commit }, payload) {
      commit(SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE, payload);
    },
    [SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER]({ commit }, payload) {
      commit(SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER, payload);
    },
    [SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER]({ commit }, payload) {
      commit(SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER, payload);
    },
    [SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION]({ commit }, payload) {
      commit(SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION, payload);
    },
    [SET_SPOUSE_DISCHARGE_DATE]({ commit }, payload) {
      commit(SET_SPOUSE_DISCHARGE_DATE, payload);
    },
    [SET_SPOUSE_CRA_DOCUMENTS]({ commit }, payload) {
      commit(SET_SPOUSE_CRA_DOCUMENTS, payload);
    },
    [SET_SPOUSE_FPC_INCOME]({ commit }, payload) {
      commit(SET_SPOUSE_FPC_INCOME, payload);
    },
    [SET_SPOUSE_FPC_RDSP]({ commit }, payload) {
      commit(SET_SPOUSE_FPC_RDSP, payload);
    },
    // Child info
    [SET_HAS_CHILDREN]({ commit }, payload) {
      commit(SET_HAS_CHILDREN, payload);
    },
    [SET_NUM_CHILDREN]({ commit }, payload) {
      commit(SET_NUM_CHILDREN, payload);
    },
    [SET_CHILDREN]({ commit }, payload) {
      commit(SET_CHILDREN, payload);
    },
    // SuppBen info
    [SET_SELECTED_NOA_YEAR]({ commit }, payload) {
      commit(SET_SELECTED_NOA_YEAR, payload);
    },
    [SET_AH_SB_INCOME]({ commit }, payload) {
      commit(SET_AH_SB_INCOME, payload);
    },
    [SET_SPOUSE_SB_INCOME]({ commit }, payload) {
      commit(SET_SPOUSE_SB_INCOME, payload);
    },
    [SET_CLAIMED_CHILD_CARE_EXPENSES]({ commit }, payload) {
      commit(SET_CLAIMED_CHILD_CARE_EXPENSES, payload);
    },
    [SET_HAS_DISABILITY_CREDIT]({ commit }, payload) {
      commit(SET_HAS_DISABILITY_CREDIT, payload);
    },
    [SET_SELECTED_DISABILITY_RECIPIENTS]({ commit }, payload) {
      commit(SET_SELECTED_DISABILITY_RECIPIENTS, payload);
    },
    [SET_NUM_DISABILITY_CHILDREN]({ commit }, payload) {
      commit(SET_NUM_DISABILITY_CHILDREN, payload);
    },
    [SET_HAS_RDSP]({ commit }, payload) {
      commit(SET_HAS_RDSP, payload);
    },
    [SET_SB_RDSP_AMOUNT]({ commit }, payload) {
      commit(SET_SB_RDSP_AMOUNT, payload);
    },
    [SET_HAS_ATTENDANT_NURSING_EXPENSES]({ commit }, payload) {
      commit(SET_HAS_ATTENDANT_NURSING_EXPENSES, payload);
    },
    [SET_SELECTED_ATTENDANT_NURSING_RECIPIENTS]({ commit }, payload) {
      commit(SET_SELECTED_ATTENDANT_NURSING_RECIPIENTS, payload);
    },
    [SET_NUM_ATTENDANT_NURSING_CHILDREN]({ commit }, payload) {
      commit(SET_NUM_ATTENDANT_NURSING_CHILDREN, payload);
    },
    [SET_ATTENDANT_NURSING_RECEIPTS]({ commit }, payload) {
      commit(SET_ATTENDANT_NURSING_RECEIPTS, payload);
    },
    // Calculated SuppBen Widget Values
    [SET_SB_TOTAL_HOUSEHOLD_INCOME]({ commit }, payload) {
      commit(SET_SB_TOTAL_HOUSEHOLD_INCOME, payload);
    },
    [SET_AH_65_DEDUCTION]({ commit }, payload) {
      commit(SET_AH_65_DEDUCTION, payload);
    },
    [SET_SPOUSE_DEDUCTION]({ commit }, payload) {
      commit(SET_SPOUSE_DEDUCTION, payload);
    },
    [SET_SPOUSE_65_DEDUCTION]({ commit }, payload) {
      commit(SET_SPOUSE_65_DEDUCTION, payload);
    },
    [SET_CHILD_DEDUCTION]({ commit }, payload) {
      commit(SET_CHILD_DEDUCTION, payload);
    },
    [SET_CHILD_ADJUSTED_DEDUCTION]({ commit }, payload) {
      commit(SET_CHILD_ADJUSTED_DEDUCTION, payload);
    },
    [SET_AH_DISABILITY_CREDIT_DEDUCTION]({ commit }, payload) {
      commit(SET_AH_DISABILITY_CREDIT_DEDUCTION, payload);
    },
    [SET_SPOUSE_DISABILITY_CREDIT_DEDUCTION]({ commit }, payload) {
      commit(SET_SPOUSE_DISABILITY_CREDIT_DEDUCTION, payload);
    },
    [SET_CHILD_DISABILITY_CREDIT_DEDUCTION]({ commit }, payload) {
      commit(SET_CHILD_DISABILITY_CREDIT_DEDUCTION, payload);
    },
    [SET_SB_RDSP_DEDUCTION]({ commit }, payload) {
      commit(SET_SB_RDSP_DEDUCTION, payload);
    },
    [SET_AH_ATTENDANT_NURSING_DEDUCTION]({ commit }, payload) {
      commit(SET_AH_ATTENDANT_NURSING_DEDUCTION, payload);
    },
    [SET_SPOUSE_ATTENDANT_NURSING_DEDUCTION]({ commit }, payload) {
      commit(SET_SPOUSE_ATTENDANT_NURSING_DEDUCTION, payload);
    },
    [SET_CHILD_ATTENDANT_NURSING_DEDUCTION]({ commit }, payload) {
      commit(SET_CHILD_ATTENDANT_NURSING_DEDUCTION, payload);
    },
    [SET_SB_TOTAL_DEDUCTIONS]({ commit }, payload) {
      commit(SET_SB_TOTAL_DEDUCTIONS, payload);
    },
    [SET_SB_ADJUSTED_INCOME]({ commit }, payload) {
      commit(SET_SB_ADJUSTED_INCOME, payload);
    },
    [SET_SB_INCOME_UNDER_THRESHOLD]({ commit }, payload) {
      commit(SET_SB_INCOME_UNDER_THRESHOLD, payload);
    },
    // Contact info
    [SET_RES_ADDRESS_LINE_1]({ commit }, payload) {
      commit(SET_RES_ADDRESS_LINE_1, payload);
    },
    [SET_RES_ADDRESS_LINE_2]({ commit }, payload) {
      commit(SET_RES_ADDRESS_LINE_2, payload);
    },
    [SET_RES_ADDRESS_LINE_3]({ commit }, payload) {
      commit(SET_RES_ADDRESS_LINE_3, payload);
    },
    [SET_RES_CITY]({ commit }, payload) {
      commit(SET_RES_CITY, payload);
    },
    [SET_RES_PROVINCE]({ commit }, payload) {
      commit(SET_RES_PROVINCE, payload);
    },
    [SET_RES_COUNTRY]({ commit }, payload) {
      commit(SET_RES_COUNTRY, payload);
    },
    [SET_RES_POSTAL_CODE]({ commit }, payload) {
      commit(SET_RES_POSTAL_CODE, payload);
    },
    [SET_MAIL_ADDRESS_LINE_1]({ commit }, payload) {
      commit(SET_MAIL_ADDRESS_LINE_1, payload);
    },
    [SET_MAIL_ADDRESS_LINE_2]({ commit }, payload) {
      commit(SET_MAIL_ADDRESS_LINE_2, payload);
    },
    [SET_MAIL_ADDRESS_LINE_3]({ commit }, payload) {
      commit(SET_MAIL_ADDRESS_LINE_3, payload);
    },
    [SET_MAIL_CITY]({ commit }, payload) {
      commit(SET_MAIL_CITY, payload);
    },
    [SET_MAIL_PROVINCE]({ commit }, payload) {
      commit(SET_MAIL_PROVINCE, payload);
    },
    [SET_MAIL_COUNTRY]({ commit }, payload) {
      commit(SET_MAIL_COUNTRY, payload);
    },
    [SET_MAIL_POSTAL_CODE]({ commit }, payload) {
      commit(SET_MAIL_POSTAL_CODE, payload);
    },
    [SET_IS_MAIL_SAME]({ commit }, payload) {
      commit(SET_IS_MAIL_SAME, payload);
    },
    [SET_PHONE]({ commit }, payload) {
      commit(SET_PHONE, payload);
    },
    // Consent
    [SET_POWER_OF_ATTORNEY]({commit}, payload) {
      commit(SET_POWER_OF_ATTORNEY, payload)
    },
    [SET_FPC_POWER_OF_ATTORNEY_DOCUMENTS]({commit}, payload) {
      commit(SET_FPC_POWER_OF_ATTORNEY_DOCUMENTS, payload)
    },
    [SET_MSP_POWER_OF_ATTORNEY_DOCUMENTS]({commit}, payload) {
      commit(SET_MSP_POWER_OF_ATTORNEY_DOCUMENTS, payload)
    },
    [SET_SB_POWER_OF_ATTORNEY_DOCUMENTS]({commit}, payload) {
      commit(SET_SB_POWER_OF_ATTORNEY_DOCUMENTS, payload)
    },
  },
  getters: {
    isEligibleForMSP: state => {
      return state.eqMSPLiveInBC === 'Y' 
        && state.eqMSPAwayOver30 === 'N' 
        && state.eqMSPStudentMinorRefugee === 'N'
        && state.eqMSPHasDocuments === 'Y'; 
    },
    isEligibleForFPCare: state => {
      return state.eqFPCMeetsCriteria === 'Y'
        && state.eqFPCHasInfo === 'Y';
    },
    isEligibleForSuppBen: state => {
      return state.eqSBMeetsCriteria === 'Y'
        && state.eqSBhasInfo === 'Y';
    }
  }
};
