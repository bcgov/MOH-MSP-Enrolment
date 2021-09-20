<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Add spouse information and upload documents</h1>
        <p>Do you have a spouse or common-law partner who also needs to enrol for MSP coverage? If so, you are required to provide spouse information and provide supporting documents.</p>
        <hr class="mt-0"/>
        <div class="control-buttons">
          <Button 
            :label="'Add Spouse'"
            :className="'btn-primary'"
            @click="addSpouse"
            :disabled="hasSpouse"
          />
        </div>
        <div v-if="hasSpouse" class="mt-3">
          <h2>Spouse or common-law partner</h2>
          <p>Please provide the spouse's personal information and immigration status in Canada. You will be required to upload supporting documents with your application.</p>
          <hr class="mt-0"/>
          <Select label="Spouse's immigration status in Canada"
                class='mt-3'
                v-model='spouseStatus'
                :options='optionsImmigrationStatus' />
          <Radio v-if="spouseStatus === statusOptions.Citizen || spouseStatus === statusOptions.PermanentResident"
                label=''
                v-model='spouseStatusReason'
                :items='isCitizenOrPermResidentStatusReasons' />
          <h3>Documents</h3>
          <p>Provide one of the required documents to support your spouse's status in Canada. If your spouse's name has changed since their ID was issued you are also required to upload document to support the name change</p>
          <hr class="mt-0"/>
          <!-- INSERT FILE UPLOAD COMPONENT HERE -->

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
  PageContent,
  Button,
  Select,
  Radio
} from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';
import { selectOptionsImmigrationStatus } from '@/constants/select-options';
import { radioOptionsCitizenStatusReasons } from '@/constants/radio-options';
import { StatusInCanada } from '@/constants/immigration-status-types';

export default {
  name: 'SpouseInfoPage',
  mixins: [pageContentMixin],
  components: {
    ContinueBar,
    PageContent,
    Button,
    Select,
    Radio
  },
  data: () => {
    return {
      hasSpouse: false,
      spouseStatus: null,
      spouseStatusReason: null,
      optionsImmigrationStatus: selectOptionsImmigrationStatus,
      statusOptions: StatusInCanada,
      isCitizenOrPermResidentStatusReasons: radioOptionsCitizenStatusReasons
    };
  },
  created() {
    console.log(this.optionsImmigrationStatus);
    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.SPOUSE_INFO_PAGE.path,
      enrolmentRoutes.SPOUSE_INFO_PAGE.title
    );
  },
  validations() {
    const validations = {};
    return validations;
  },
  methods: {
    addSpouse() {
      this.hasSpouse = true;
    },
    validateFields() {
      if (!this.hasSpouse) {
        this.navigateToNextPage();
      }

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
        enrolmentRoutes.CHILD_INFO_PAGE.path
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
        enrolmentRoutes.SPOUSE_INFO_PAGE.path
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
