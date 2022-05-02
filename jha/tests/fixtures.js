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