export const mockFile = {
  fileName: "dog.jpg",
  contentType: "IMAGE_JPEG",
  source: "data:image/jpeg;base64,/9j/",
  description: null,
  documentType: "PowerOfAttorney",
  hash: "8e19640da86b728e498a8a38de0ea3afb5698dbb",
  height: 825,
  size: 28506,
  uuid: "8f8a8e48-c614-4641-a243-ce7d84b121c8",
  width: 800,
};

export const completedConsentPageState = {
  isLoading: false,
  isSystemUnavailable: false,
  isApplyingForMSP: true,
  isApplyingForFPCare: true,
  isApplyingForSuppBen: true,
  isAuthorizedMSPAH: true,
  isAuthorizedMSPSpouse: true,
  isAuthorizedFPCAH: true,
  isAuthorizedFPCSpouse: true,
  isAuthorizedSBAH: true,
  isAuthorizedSBSpouse: true,
  hasPowerOfAttorney: true,
  powerOfAttorneyDocuments: [mockFile],
};

export const fpcAddressUpdateMiddlewareHTML = `
<h3>You are registered for Fair PharmaCare</h3>\n<p>You have <strong>temporary</strong> coverage. Please provide consent for us to verify your income with the Canada Revenue Agency, or your temporary coverage will end.</p>\n<p><font color=  red  >Unfortunately, we could not update an address you provided. Please contact <a href=\"https://www2.gov.bc.ca/gov/content/health/health-drug-coverage/pharmacare-for-bc-residents/contact-us\" target=  _blank  >Health Insurance BC</a> to confirm your mailing address.</font></p>\n<p><strong>Provide consent</strong></p>\n<p>A consent form will be sent to you soon. Please sign and return the consent form so we can verify your income.</p>\n<p>If you don't return a signed consent form, your temporary coverage will end. Your family's deductible will default to $10,000.</p>\n<p><strong>After we verify your income</strong></p>\n<p>Once we receive your consent form and verify your income, we will send you a confirmation letter within 30 days. It will have details about your level of coverage.</p>\n<p><strong>If we can't verify your income</strong></p>\n<p>If we receive your consent but can't verify your income, we will send you a letter within 30 days asking for new information.</p>\n<ul type=  disc >\n<li>If you send new information, and we verify your income, you will receive a confirmation letter within 30 days. It will have details about your level of coverage.</li>\n<li>If you send new information, and we still can't verify your income, your temporary coverage will end. Your family's deductible will default to $10,000.</li>\n<li>If you do not send new information, your temporary coverage will end. Your family's deductible will default to $10,000.</li>\n</ul>\n<p><strong>Tracking your registration</strong></p>\n<ul type=  disc >\n<li>Write your registration number down, or print this page for your records.</li>\n<li>Go to the <a href=\"http://www.gov.bc.ca/fairpharmacareregistration\" target=  _blank  >Fair PharmaCare registration page</a> and click \"Check Status\".</li>\n</ul> (57)
`