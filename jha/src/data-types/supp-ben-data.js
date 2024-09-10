import {
  calculateAge,
} from 'common-lib-vue';

export default class SuppBenData{
  #selectedNOAYear;
  #ahIncome;
  #ahAge;
  #hasSpouse;
  #spouseIncome;
  #spouseAge;
  #children;
  #claimedChildCareExpenses;
  #hasDisabilityCredit;
  #selectedDisabilityRecipients;
  #numDisabilityChildren;
  #hasRDSP;
  #rdspAmount;
  #hasAttendantNursingExpenses;
  #selectedAttendantNursingRecipients;
  #numAttendantNursingChildren;
  #attendantNursingReceipts;
  #qualificationThreshhold;

  constructor() {
    this.#selectedNOAYear = (new Date()).getFullYear() - 1;
    this.#ahIncome = 0;
    this.#ahAge = undefined;
    this.#hasSpouse = false;
    this.#spouseIncome = 0;
    this.#spouseAge = 0;
    this.#children = 0;
    this.#claimedChildCareExpenses = 0;
    this.#hasDisabilityCredit = false;
    this.#selectedDisabilityRecipients = [];
    this.#numDisabilityChildren = 0;
    this.#hasRDSP = false;
    this.#rdspAmount = 0;
    this.#hasAttendantNursingExpenses = false;
    this.#selectedAttendantNursingRecipients = [];
    this.#numAttendantNursingChildren = 0;
    this.#attendantNursingReceipts = [];
    this.#qualificationThreshhold = 0;
  }
  // Setters and Getters for Provided Values
  set selectedNOAYear(year) {
    this.#selectedNOAYear = year;
  }
  get selectedNOAYear() {
    return this.#selectedNOAYear;
  }
  set ahIncome(income) {
    this.#ahIncome = this.stringToFloat(income);
  }
  get ahIncome() {
    return `${this.#ahIncome}`;
  }
  set ahBirthdate(date) {
    this.#ahAge = calculateAge(date);
  }
  set hasSpouse(spouse) {
    this.#hasSpouse = spouse === "Y";
  }
  get hasSpouse() {
    return this.#hasSpouse ? "Y" : "N";
  }
  set spouseIncome(income) {
    this.#spouseIncome = this.stringToFloat(income);
  }
  get spouseIncome() {
    return `${this.#spouseIncome}`;
  }
  set spouseBirthdate(date) {
    this.#spouseAge = calculateAge(date);
  }
  set numChildren(num) {
    this.#children = num ? num : 0;
  }
  get numChildren() {
    return this.#children;
  }
  set claimedChildCareExpenses(expenses) {
    this.#claimedChildCareExpenses = this.stringToFloat(expenses);
  }
  get claimedChildCareExpenses() {
    return `${this.#claimedChildCareExpenses}`;
  }
  set hasDisabilityCredit(hasCredit) {
    this.#hasDisabilityCredit = hasCredit === "Y";
  }
  get hasDisabilityCredit() {
    return this.#hasDisabilityCredit ? "Y" : "N";
  }
  set selectedDisabilityRecipients(selected){
    this.#selectedDisabilityRecipients = selected;
  }
  get selectedDisabilityRecipients() {
    return this.#selectedDisabilityRecipients;
  }
  set numDisabilityChildren(numString) {
    this.#numDisabilityChildren = this.stringToInt(numString);
  }
  get numDisabilityChildren() {
    return `${this.#numDisabilityChildren}`;
  }
  set hasRDSP(rdspStatus) {
    this.#hasRDSP = rdspStatus === "Y";
  }
  get hasRDSP() {
    return this.#hasRDSP ? "Y" : "N";
  }
  set rdspAmount(amount) {
    this.#rdspAmount = this.stringToFloat(amount);
  }
  get rdspAmount() {
    return `${this.#rdspAmount}`;
  }
  set hasAttendantNursingExpenses(hasExpenses) {
    this.#hasAttendantNursingExpenses = hasExpenses === "Y";
  }
  get hasAttendantNursingExpenses() {
    return this.#hasAttendantNursingExpenses ? "Y" : "N";
  }
  set selectedAttendantNursingRecipients(selected){
    this.#selectedAttendantNursingRecipients = selected;
  }
  get selectedAttendantNursingRecipients() {
    return this.#selectedAttendantNursingRecipients;
  }
  set numAttendantNursingChildren(numString) {
    this.#numAttendantNursingChildren = this.stringToInt(numString);
  }
  get numAttendantNursingChildren() {
    return `${this.#numAttendantNursingChildren}`;
  }
  set attendantNursingReceipts(receipts) {
    this.#attendantNursingReceipts = receipts;
  }
  get attendantNursingReceipts() {
    return this.#attendantNursingReceipts;
  }
  set qualificationThreshhold(threshold) {
    this.#qualificationThreshhold = threshold;
  }

  // Getters for Calculated Values
  get totalHouseholdIncome() {
    let income = this.#ahIncome;
    if( this.#hasSpouse ) {
      income += this.#spouseIncome;
    }
    return (income > 0) ? income : 0;
  }
  get ah65Deduction() {
    return this.#ahAge && this.#ahAge >= 65 ? 3000 : 0;
  }
  get spouseDeduction() {
    return (this.#hasSpouse) ? 3000 : 0;
  }
  get spouse65Deduction() {
    return this.#spouseAge && this.#spouseAge >= 65 ? 3000 : 0;
  }
  get childDeduction() {
    return 3000 * this.#children;
  }
  get claimedChildCareExpensesReduction() {
    return this.#claimedChildCareExpenses > 0 && this.#children > 0 ?
      (this.#claimedChildCareExpenses / 2) * -1 : 0;
  }
  get childAdjustedDeduction() {
    let adjusted = this.childDeduction + this.claimedChildCareExpensesReduction
    return adjusted > 0 ? adjusted : 0;
  }
  get ahDisabilityCreditDeduction() {
    return this.#hasDisabilityCredit && this.#selectedDisabilityRecipients
      && this.#selectedDisabilityRecipients.includes('ah') ?
        3000 : 0;
  }
  get spouseDisabilityCreditDeduction() {
    return this.#hasSpouse
      && this.#hasDisabilityCredit
      && this.#selectedDisabilityRecipients
      && this.#selectedDisabilityRecipients.includes('spouse') ?
        3000 : 0;
  }
  get childDisabilityCreditDeduction() {
    return this.#children > 0
      && this.#hasDisabilityCredit
      && this.#selectedDisabilityRecipients
      && this.#selectedDisabilityRecipients.includes('child')
      && this.#numDisabilityChildren > 0
      && this.#numDisabilityChildren <= this.#children ?
        this.#numDisabilityChildren * 3000 : 0;
  }
  get rdspDeduction() {
    return this.#hasRDSP && this.#rdspAmount > 0 ? this.#rdspAmount : 0;
  }
  get ahAttendantNursingDeduction() {
    return this.#hasAttendantNursingExpenses
      && this.#selectedAttendantNursingRecipients
      && this.#selectedAttendantNursingRecipients.includes('ah') ?
        3000 : 0;
  }
  get spouseAttendantNursingDeduction() {
    return this.#hasSpouse
      && this.#hasAttendantNursingExpenses
      && this.#selectedAttendantNursingRecipients
      && this.#selectedAttendantNursingRecipients.includes('spouse') ?
        3000 : 0;
  }
  get childAttendantNursingDeduction() {
    return this.#children > 0
      && this.#hasAttendantNursingExpenses
      && this.#selectedAttendantNursingRecipients
      && this.#selectedAttendantNursingRecipients.includes('child')
      && this.#numAttendantNursingChildren > 0
      && this.#numAttendantNursingChildren <= this.#children ?
        this.#numAttendantNursingChildren * 3000 : 0;
  }
  get totalDeductions() {
    return this.ah65Deduction
      + this.spouseDeduction
      + this.spouse65Deduction
      + this.childAdjustedDeduction
      + this.ahDisabilityCreditDeduction
      + this.spouseDisabilityCreditDeduction
      + this.childDisabilityCreditDeduction
      + this.rdspDeduction
      + this.ahAttendantNursingDeduction
      + this.spouseAttendantNursingDeduction
      + this.childAttendantNursingDeduction;
  }
  get adjustedIncome() {
    let adjusted = this.totalHouseholdIncome - this.totalDeductions;
    return (adjusted > 0) ? adjusted : 0;
  }
  get incomeUnderThreshold() {
    return this.adjustedIncome <= this.#qualificationThreshhold;
  }

  // Helpers
  stringToInt(stringNumber) {
    return (stringNumber && !isNaN(stringNumber)) ? 
      parseInt(this.removeCommas(stringNumber)) : 0;
  }
  stringToFloat(stringNumber) {
    return (stringNumber && !isNaN(stringNumber)) ? 
      parseFloat(this.removeCommas(stringNumber)) : 0;
  }
  removeCommas(stringNumber) {
    if (typeof stringNumber === 'string' || stringNumber instanceof String) {
      return stringNumber.replace(/[,]/g, '');
    }
    return stringNumber;
  }
}