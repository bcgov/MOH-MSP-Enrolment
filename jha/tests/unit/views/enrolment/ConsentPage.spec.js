import { mount } from "@vue/test-utils";
import router from '@/router';
import { createStore } from 'vuex'
import ConsentPage from "@/views/enrolment/ConsentPage.vue";
import apiService from "@/services/api-service.js";
import enrolmentModule from "@/store/modules/enrolment-module.js";
import appModule from "@/store/modules/app-module.js";
import dummyData from "@/store/states/enrolment-module-dummy-data.js";
import { completedConsentPageState /*, mockFile */} from "../../fixtures.js";

const store = createStore({
  modules: {
    appModule,
    enrolmentModule: { ...enrolmentModule, state: () => dummyData },
  }
});

jest.mock("@/services/api-service.js", () => ({
  sendApplication: jest.fn(() => Promise.resolve(true)),
  sendAttachments: jest.fn(() => Promise.resolve(true)),
}));

const getUuid = (doc) => doc.uuid;
const arrayHasUniqueValues = (arr) => new Set(arr).size === arr.length;

describe("Consent Page UI", () => {
  const PoACheckboxId = "#power-of-attorney-checkbox";
  const PoAFileUploaderId = "#power-of-attorney-upload";
  const ahConsentIds = ["msp-ah", "fpc-ah", "sb-ah"];
  const spouseConsentIds = ["msp-spouse", "fpc-spouse", "sb-spouse"];

  it("toggles form widget when Power of Attorney checkbox is toggled", async () => {
    const wrapper = mount(ConsentPage, {
      global: {
        plugins: [router, store]
      }
    });
    const PoACheckbox = wrapper.find(PoACheckboxId);
    expect(PoACheckbox.element.checked).toBeFalsy();
    expect(wrapper.find(PoAFileUploaderId).exists()).toBe(false);

    await PoACheckbox.setChecked();
    expect(PoACheckbox.element.checked).toBeTruthy();
    expect(wrapper.find(PoAFileUploaderId).exists()).toBe(true);
  });

  it('Adds users names to consent labels, and includes "or legal representative" suffix if PoA checked', async () => {
    const wrapper = mount(ConsentPage, {
      global: {
        plugins: [router, store]
      }
    });

    ahConsentIds.forEach((id) => {
      const label = wrapper.find(`label[for=${id}]`);
      expect(label.text()).toBe("John CANALICULATEXB");
    });

    spouseConsentIds.forEach((id) => {
      const label = wrapper.find(`label[for=${id}]`);
      expect(label.text()).toBe("Sarah CANALICULATEXB");
    });

    const PoACheckbox = wrapper.find(PoACheckboxId);
    await PoACheckbox.setChecked();

    ahConsentIds.forEach((id) => {
      const label = wrapper.find(`label[for=${id}]`);
      expect(label.text()).toBe("John CANALICULATEXB or legal representative");
    });

    spouseConsentIds.forEach((id) => {
      const label = wrapper.find(`label[for=${id}]`);
      expect(label.text()).toBe("Sarah CANALICULATEXB or legal representative");
    });
  });
});

describe("form consent and submission", () => {
  let wrapper;
  let submitButton;

  beforeEach(async () => {
    jest.clearAllMocks();
    wrapper = mount(ConsentPage, {
      global: {
        plugins: [router, store]
      },
      data() {
        return completedConsentPageState;
      },
    });

    const buttons = wrapper.findAll("button");
    submitButton = buttons.filter((button) =>
      button.text().includes("Submit")
    )[0];
  });

  it("Saves PoA documents with unique uuids for all application types", async () => {
    await submitButton.trigger("click");

    const {
      fpcPowerOfAttorneyDocuments,
      mspPowerOfAttorneyDocuments,
      sbPowerOfAttorneyDocuments,
    } = store.state.enrolmentModule;

    const uuids = [
      ...fpcPowerOfAttorneyDocuments.map(getUuid),
      ...mspPowerOfAttorneyDocuments.map(getUuid),
      ...sbPowerOfAttorneyDocuments.map(getUuid),
    ];
    expect(arrayHasUniqueValues(uuids)).toBe(true);
  });

  it("triggers api-services with the expected PoA payload", async () => {
    await submitButton.trigger("click");

    expect(apiService.sendAttachments).toHaveBeenCalled();
    expect(apiService.sendApplication).toHaveBeenCalled();

    const sendAttachmentsArgs = apiService.sendAttachments.mock.calls[0][0];
    const {
      fpcPowerOfAttorneyDocuments,
      mspPowerOfAttorneyDocuments,
      sbPowerOfAttorneyDocuments,
    } = sendAttachmentsArgs;

    [
      fpcPowerOfAttorneyDocuments,
      mspPowerOfAttorneyDocuments,
      sbPowerOfAttorneyDocuments,
    ].forEach((documents) => {
      expect(documents.length).toBe(1);
      expect(documents[0].documentType).toBe("PowerOfAttorney");
    });
  });
});
