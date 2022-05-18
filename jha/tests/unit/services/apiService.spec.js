import apiService from "@/services/api-service";
import dummyData from "@/store/states/enrolment-module-dummy-data.js";
import { mockFile } from "../fixtures.js";
import { stripSpaces, formatISODate } from "common-lib-vue";

const postRequestSuccessResult = {
  data: {
    returnCode: "success",
  },
};
apiService._sendPostRequest = jest.fn(() =>
  Promise.resolve(postRequestSuccessResult)
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Power Of Attorney", () => {
  dummyData.hasPowerOfAttorney = true;

  const getApplicationAttachments = async (data) => {
    await apiService.sendApplication(data);
    const [, , postedFormData] = apiService._sendPostRequest.mock.calls[0];
    const fpcAttachments = postedFormData.fairPharmaCare.attachments;
    const mspAttachments = postedFormData.medicalServicesPlan.attachments;
    const sbAttachments = postedFormData.supplementaryBenefits.attachments;
    return {
      fpcAttachments,
      mspAttachments,
      sbAttachments,
      allData: postedFormData,
    };
  };

  const getAttachmentUrls = async (data) => {
    await apiService.sendAttachments(data);
    return apiService._sendPostRequest.mock.calls.map((call) => call[0]);
  };

  it("Correctly formats payload for FPC", async () => {
    const appData = { ...dummyData, fpcPowerOfAttorneyDocuments: [mockFile] };
    const { fpcAttachments } = await getApplicationAttachments(appData);
    expect(fpcAttachments.length).toBe(1);
    expect(fpcAttachments[0].attachmentDocumentType).toBe("PowerOfAttorney");
  });

  it("Correctly formats payload for MSP", async () => {
    const appData = { ...dummyData, mspPowerOfAttorneyDocuments: [mockFile] };
    const { mspAttachments } = await getApplicationAttachments(appData);
    const supportDocuments = mspAttachments.filter(
      (attachment) => attachment.attachmentDocumentType === "SupportDocument"
    );
    const powerOfAttorneyDocuments = mspAttachments.filter(
      (attachment) => attachment.attachmentDocumentType === "PowerOfAttorney"
    );

    // All non-PoA docs should be support docs
    expect(supportDocuments.length).toBe(mspAttachments.length - 1);
    expect(powerOfAttorneyDocuments.length).toBe(1);
  });

  it("Correctly formats payload for SuppBen", async () => {
    const appData = { ...dummyData, sbPowerOfAttorneyDocuments: [mockFile] };
    const { sbAttachments } = await getApplicationAttachments(appData);
    const supportDocuments = sbAttachments.filter(
      (attachment) => attachment.attachmentDocumentType === "SupportDocument"
    );
    const powerOfAttorneyDocuments = sbAttachments.filter(
      (attachment) => attachment.attachmentDocumentType === "PowerOfAttorney"
    );
    expect(supportDocuments.length).toBe(sbAttachments.length - 1);
    expect(powerOfAttorneyDocuments.length).toBe(1);
  });

  it("Sets account holder PoA and spouse PoA to 'Y' in payload when included", async () => {
    const { allData } = await getApplicationAttachments(dummyData);

    expect(allData.powerOfAttorney).toBe("Y");
    expect(allData.spousePowerOfAttorney).toBe("Y");
  });

  it("Sets account holder PoA and spouse PoA to 'N' in payload when excluded", async () => {
    const appData = { ...dummyData, hasPowerOfAttorney: false };
    const { allData } = await getApplicationAttachments(appData);

    expect(allData.powerOfAttorney).toBe("N");
    expect(allData.spousePowerOfAttorney).toBe("N");
  });

  it("Sends fpc power of attorney documents to maxhub with PHARMANET as the program area", async () => {
    const appData = {
      ...dummyData,
      fpcPowerOfAttorneyDocuments: [mockFile],
    };

    const EXPECTED_POA_CALLS_COUNT = 1;
    const postedUrls = await getAttachmentUrls(appData);
    const fpcPowerOfAttorneyCalls = postedUrls.filter((url) =>
      url.includes(
        "programArea=PHARMANET&attachmentDocumentType=PowerOfAttorney"
      )
    );
    expect(fpcPowerOfAttorneyCalls.length).toBe(EXPECTED_POA_CALLS_COUNT);
    const supportDocumentCalls = postedUrls.filter((url) =>
      url.includes(
        "programArea=ENROLMENT&attachmentDocumentType=SupportDocument"
      )
    );
    expect(supportDocumentCalls.length).toBe(postedUrls.length - EXPECTED_POA_CALLS_COUNT);
  });

  it("Sends msp and sb power of attorney documents to maxhub with ENROLMENT as the program area", async () => {
    const appData = {
      ...dummyData,
      sbPowerOfAttorneyDocuments: [mockFile],
      mspPowerOfAttorneyDocuments: [mockFile],
    };

    const EXPECTED_POA_CALLS_COUNT = 2;
    const postedUrls = await getAttachmentUrls(appData);
    const fpcPowerOfAttorneyCalls = postedUrls.filter((url) =>
      url.includes(
        "programArea=ENROLMENT&attachmentDocumentType=PowerOfAttorney"
      )
    );
    expect(fpcPowerOfAttorneyCalls.length).toBe(EXPECTED_POA_CALLS_COUNT);
    const supportDocumentCalls = postedUrls.filter((url) =>
      url.includes(
        "programArea=ENROLMENT&attachmentDocumentType=SupportDocument"
      )
    );
    // Other calls should be enrolment support docs
    expect(supportDocumentCalls.length).toBe(postedUrls.length - EXPECTED_POA_CALLS_COUNT);
  });
});

describe("FPC Application", () => {
  let children;
  let persons;
  const appData = {
    ...dummyData,
    isApplyingForMSP: false,
    isApplyingForSuppBen: false,
  };

  beforeEach(async () => {
    children = appData.children;
    await apiService.sendApplication(appData);
    const [, , postedFormData] = apiService._sendPostRequest.mock.calls[0];
    persons = postedFormData.fairPharmaCare.persons;
  });

  it("includes children in the persons array of JSON payload when applying for only FPC", () => {
    expect(Array.isArray(persons)).toBe(true);
    expect(persons.length).toBe(children.length);
  });

  it("maps vuex state for children to JSON payload for FPC correctly", () => {
    persons.forEach((person, i) => {
      const child = children[i];
      expect(person.givenName).toBe(child.firstName);
      expect(person.surname).toBe(child.lastName);
      expect(person.postalCode).toBe(stripSpaces(appData.mailPostalCode));
      expect(person.perType).toBe("2");
      expect(person.dateOfBirth).toBe(formatISODate(child.birthDate));
      expect(person.phn).toBe(stripSpaces(child.personalHealthNumber));
    });
  });
});
