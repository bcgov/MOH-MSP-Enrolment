<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Add personal information and upload documents</h1>
        <h2>Account Holder basic information</h2>
        <p>After enrolment, the main applicant will be the Medical Services Plan Account Holder, and will be responsible for maintaining the Medical Services Plan account and requesting any changes.</p>
        <hr class="mt-0"/>
        <Input label="First name"
          id="first-name"
          class="mb-3"
          v-model="firstName" />
        <Input label="Middle name (optional)"
          id="middle-name"
          class="mb-3"
          v-model="middleName" />
        <Input label="Last name"
          id="last-name"
          class="mb-3"
          v-model="lastName" />
        <DateInput label="Birthdate"
          id="birthdate"
          class="mb-3"
          v-model="birthdate" />
        <DigitInput label="Social Insurance Number (SIN)"
          id="social-insurance-number"
          class="mb-3"
          v-model="socialInsuranceNumber"/>
        <Radio label="Gender"
          name="gender"
          class="mb-3"
          v-model="gender"
          :items="genderOptions" />
        
        <h2>Your status in Canada</h2>
        <p>Please provide you immigration status information. You will be required to upload documents to support your status in Canada.</p>
        <hr/>
        <Select label="Immigration status in Canada"
          id="immigration-status"
          class="mb-3"
          v-model="immigrationStatus"
          :options="immigrationStatusOptions"/>
        <Radio name="citizen-status-reason"
          class="mb-3"
          v-model="citizenStatusReason"
          :items="citizenStatusReasonOptions" />
        
        <h2>Documents</h2>
        <p>Provide one of the following documents to support your status in Canada. If your name has changed since your ID was issued you are also required to upload document to support the name change.</p>
        <hr/>
        <Select label="Document Type"
          id="citizen-support-document-type"
          class="mb-3"
          v-model="citizenshipSupportDocumentType"
          :options="citizenshipSupportDocumentsOptions" />
        <div v-if="citizenshipSupportDocumentType">
          <h2>{{citizenshipSupportDocumentType}}</h2>
          <hr/>
          <FileUploader v-model="citizenshipSupportDocuments" />
        </div>



      </div>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import {
  enrolmentRoutes,
  isPastPath,
} from '@/router/routes';
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition
} from '@/helpers/scroll';
import {
  getConvertedPath,
} from '@/helpers/url';
import {
  MODULE_NAME as formModule,
  RESET_FORM,
} from '@/store/modules/enrolment-module';
import logService from '@/services/log-service';
import {
  ContinueBar,
  DateInput,
  DigitInput,
  FileUploader,
  Input,
  PageContent,
  Radio,
  Select,
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';
import {
  radioOptionsGender,
  radioOptionsCitizenStatusReasons,
} from '@/constants/radio-options';
import {
  selectOptionsImmigrationStatus,
  selectOptionsCitizenshipSupportDocuments,
} from '@/constants/select-options';

export default {
  name: 'PersonalInfoPage',
  mixins: [pageContentMixin],
  components: {
    ContinueBar,
    DateInput,
    DigitInput,
    FileUploader,
    Input,
    PageContent,
    Radio,
    Select,
  },
  data: () => {
    return {
      // Radio and Select options.
      genderOptions: radioOptionsGender,
      immigrationStatusOptions: selectOptionsImmigrationStatus,
      citizenStatusReasonOptions: radioOptionsCitizenStatusReasons,
      citizenshipSupportDocumentsOptions: selectOptionsCitizenshipSupportDocuments,
      // Data to be saved.
      firstName: null,
      middleName: null,
      lastName: null,
      birthdate: null,
      socialInsuranceNumber: null,
      gender: null,
      immigrationStatus: null,
      citizenStatusReason: null,
      citizenshipSupportDocumentType: null,
      citizenshipSupportDocuments: [],
    };
  },
  created() {
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.PERSONAL_INFO_PAGE.path,
      enrolmentRoutes.PERSONAL_INFO_PAGE.title
    );
  },
  validations() {
    const validations = {};
    return validations;
  },
  methods: {
    validateFields() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        scrollToError();
        return;
      }

      this.navigateToNextPage();
    },
    navigateToNextPage() {
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.SPOUSE_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
  },
  computed: {},
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (to.path === enrolmentRoutes.HOME_PAGE.path) {
      this.$store.dispatch(formModule + '/' + RESET_FORM);
      next();
    } else if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.PERSONAL_INFO_PAGE.path
      );
      next({
        path: toPath,
        replace: true
      });
      setTimeout(() => {
        scrollTo(topScrollPosition);
      }, 0);
    }
  }
}
</script>

<style scoped>
</style>
