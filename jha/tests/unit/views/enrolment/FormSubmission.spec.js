import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import VueRouter from "vue-router";
import Vue from "vue";
import Vuelidate from "vuelidate";
import ConsentPage from "@/views/enrolment/ConsentPage.vue";
import apiService from "@/services/api-service.js";
import enrolmentModule from "@/store/modules/enrolment-module.js";
import dummyData from '@/store/states/enrolment-module-dummy-data.js'

jest.mock("@/services/api-service.js", () => ({
  sendApplication: jest.fn(() => Promise.resolve(true)),
  sendAttachments: jest.fn(() => Promise.resolve(true)),
}))

const mockFile = {
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

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
Vue.use(Vuelidate);

const getUuid = doc => doc.uuid;
const arrayHasUniqueValues = arr => new Set(arr).size === arr.length;

describe("Enrolment - Submission", () => {
  let state;
  let router;
  let store;

  const PoACheckboxId = "#power-of-attorney-checkbox";
  const PoAFileUploaderId = "#power-of-attorney-upload";
  const ahConsentIds = ["msp-ah", "fpc-ah", "sb-ah"];
  const spouseConsentIds = ["msp-spouse", "fpc-spouse", "sb-spouse"];

  beforeEach(() => {
    state = {
      applicationUuid: null,
    };

    store = new Vuex.Store({
      modules: {
        appModule: {
          state: {
            showMobileStepperDetails: false,
          },
        },
        enrolmentModule: {...enrolmentModule, state: () => dummyData},
      },
    });

    router = new VueRouter();
  });

  it('toggles form widget when Power of Attorney checkbox is toggled', async () => {
    const wrapper = mount(ConsentPage, {
      store,
      router,
      localVue,
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
      store,
      router,
      localVue,
    });

    ahConsentIds.forEach(id => {
      const label = wrapper.find(`label[for=${id}]`)
      expect(label.text()).toBe('John CANALICULATEXB')
    })

    spouseConsentIds.forEach(id => {
      const label = wrapper.find(`label[for=${id}]`)
      expect(label.text()).toBe('Sarah CANALICULATEXB')
    })

    const PoACheckbox = wrapper.find(PoACheckboxId);
    await PoACheckbox.setChecked();

    ahConsentIds.forEach(id => {
      const label = wrapper.find(`label[for=${id}]`)
      expect(label.text()).toBe('John CANALICULATEXB or legal representative')
    })

    spouseConsentIds.forEach(id => {
      const label = wrapper.find(`label[for=${id}]`)
      expect(label.text()).toBe('Sarah CANALICULATEXB or legal representative')
    })
  })

  it("Saves PoA documents with unique uuids for all application types", async () => {
    const wrapper = mount(ConsentPage, {
      store,
      router,
      localVue,
      data() {
        return {
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
      },
    });

    const buttons = wrapper.findAll('button');
    const submitButton = buttons.wrappers.filter(button => button.text().includes('Submit'))[0]
    await submitButton.trigger('click')

    const {
      fpcPowerOfAttorneyDocuments,
      mspPowerOfAttorneyDocuments,
      sbPowerOfAttorneyDocuments,
    } = store.state.enrolmentModule;

    const uuids = [...fpcPowerOfAttorneyDocuments.map(getUuid), ...mspPowerOfAttorneyDocuments.map(getUuid), ...sbPowerOfAttorneyDocuments.map(getUuid)];
    expect(arrayHasUniqueValues(uuids)).toBe(true);
    expect(apiService.sendAttachments).toHaveBeenCalled();
  });
});
