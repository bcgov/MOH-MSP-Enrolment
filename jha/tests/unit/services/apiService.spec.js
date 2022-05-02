import apiService from "@/services/api-service";
import dummyData from "@/store/states/enrolment-module-dummy-data.js";
import { mockFile } from "../../fixtures.js";

apiService._sendPostRequest = jest.fn(() => Promise.resolve(true));

describe("Power Of Attorney", () => {
  dummyData.hasPowerOfAttorney = true;
  dummyData.fpcPowerOfAttorneyDocuments = [mockFile];

  const getApplicationAttachments = async (data) => {
    await apiService.sendApplication(dummyData);
    let [, , postedFormData] = apiService._sendPostRequest.mock.calls[0];
    const fpcAttachments = postedFormData.fairPharmaCare.attachments;
    const mspAttachments = postedFormData.medicalServicesPlan.attachments;
    const sbAttachments = postedFormData.supplementaryBenefits.attachments;
    return { fpcAttachments, mspAttachments, sbAttachments, allData: postedFormData };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Correctly formats payload for FPC", async () => {
    const { fpcAttachments } = await getApplicationAttachments(dummyData);
    expect(fpcAttachments.length).toBe(1);
    expect(fpcAttachments[0].attachmentDocumentType).toBe("PowerOfAttorney");
  });

  it("Correctly formats payload for MSP", async () => {
    dummyData.mspPowerOfAttorneyDocuments = [mockFile];
    const { mspAttachments } = await getApplicationAttachments(dummyData);
    const supportDocuments = mspAttachments.filter(attachment => attachment.attachmentDocumentType === 'SupportDocument')
    const powerOfAttorneyDocuments = mspAttachments.filter(attachment => attachment.attachmentDocumentType === 'PowerOfAttorney')

    // All non-PoA docs should be support docs
    expect(supportDocuments.length).toBe(mspAttachments.length -1);
    expect(powerOfAttorneyDocuments.length).toBe(1);
  });

  it("Correctly formats payload for SuppBen", async () => {
    dummyData.sbPowerOfAttorneyDocuments = [mockFile];
    const {sbAttachments} = await getApplicationAttachments(dummyData);
    const supportDocuments = sbAttachments.filter(attachment => attachment.attachmentDocumentType === 'SupportDocument')
    const powerOfAttorneyDocuments = sbAttachments.filter(attachment => attachment.attachmentDocumentType === 'PowerOfAttorney')

    expect(supportDocuments.length).toBe(sbAttachments.length -1);
    expect(powerOfAttorneyDocuments.length).toBe(1);
  });

  it("Sets account holder PoA and spouse PoA to 'Y' in payload when included", async () => {
    const {allData} = await getApplicationAttachments(dummyData);
    
    expect(allData.powerOfAttorney).toBe('Y');
    expect(allData.spousePowerOfAttorney).toBe('Y');
  });

  it("Sets account holder PoA and spouse PoA to 'N' in payload when excluded", async () => {
    dummyData.hasPowerOfAttorney = false;
    const {allData} = await getApplicationAttachments(dummyData);
    
    expect(allData.powerOfAttorney).toBe('N');
    expect(allData.spousePowerOfAttorney).toBe('N');
  });
});
