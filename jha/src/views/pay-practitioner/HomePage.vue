<template>
  <div>
    <ConsentModal v-if="showConsentModal"
                  :applicationUuid="applicationUuid"
                  @close="handleCloseConsentModal"
                  @captchaVerified="handleCaptchaVerified" />
    <PageContent>
      <div class="container pt-3 pt-sm-5 mb-5">
        <h1>Pay Practitioner Claim</h1>
        <hr/>
        <h2>Who Can Use This Form</h2>
        <p>This form is for use by Medical Practitioners registered with MSP who are submitting a claim within 90 days of the date of service and/or Submission Codes, A, C, D, E, I, R, W, or X. This form allows Practitioners to submit claims for services provided to BC residents who are enrolled under MSP. If your claim exceeds 90 days, use the <a href="http://www2.gov.bc.ca/assets/gov/health/forms/2943fil.pdf" target="_blank">Request for Approval of Over-age Claims form (2943)</a>.</p>
        <p>This form is restricted to Medical Practitioners who submit claims for fewer than 2,400 services per year and earn less than $72,000 annually in fee-for-service payments and who do not submit claims to MSP via Teleplan.</p>

        <h2>Form Submission Instructions</h2>
        <p>Fill out this online form and submit your request electronically.</p>
        <p>If you are submitting one of the claim types below, you must submit by mail using this downloadable <a href="http://www2.gov.bc.ca/assets/gov/health/forms/1916fil.pdf" target="_blank">Fill, Print and Mail</a> format:</p>
        <ul>
          <li>Correctional facilities claims</li>
          <li>Claims for patients covered under the Critical Care Coverage Program</li>
        </ul>
        <p>To submit eligible dental surgery claims, use the <a href="http://www2.gov.bc.ca/assets/gov/health/forms/1918fil.pdf" target="_blank">Pay Dentist Claim form</a>.</p>
        <p>To submit reciprocal claims, use the <a href="http://www2.gov.bc.ca/assets/gov/health/forms/1917fil.pdf" target="_blank">Pay Reciprocal Practitioner form</a>.</p>
      
        <h2>About Online Forms</h2>
        <p>At any time before submitting your request you can click the Back button at the bottom of each page to return to a previous page, review and/or edit information. You will not lose any information you have entered.</p>
      
        <h2>Supporting Documentation</h2>
        <p>You may be required to submit photocopies of the applicable supporting documents to substantiate the adjudication of your claim. This can include:</p>
        <ul>
          <li>Operational reports</li>
          <li>Procedural reports</li>
          <li>Additional correspondence</li>
        </ul>
        <p>If you are required to send supporting documentation you will be presented with a printable form, filled out with your information, to print, sign and mail with your supporting documentation to Health Insurance BC.</p>

        <h2>Definitions</h2>
        <p>Medical Services Claims - note that this is per patient. A separate claim form must be filled out for each patient.</p>
        <p>Hospital Visit Claims - note that this is per patient. A separate claim form must be filled out for each patient.</p>
        <p>Called Start - must use 24 hour clock when inputting information i.e. 14:10</p>
        <p>Rendered Finish - must use 24 hour clock when inputting information i.e. 14:10</p>

        <h2>Fee</h2>
        <p>There is no fee for this request.</p>

        <h2>Privacy</h2>
        <p>Personal information on this form is collected under the authority of the <em>Medicare Protection Act</em>. The information will be used to determine residency in BC and determine eligibility for provincial health care benefits. If you have any questions about the collection of this information, contact Health Insurance BC. Personal information is protected from unauthorized use and disclosure in accordance with the <em>Freedom of Information and Protection of Privacy Act</em> and may be disclosed only as provided by that Act.</p>

        <h2>Legislation</h2>
        <p>All information is subject to change in accordance with the <em>Medicare Protection Act</em> and Regulations and the <em>Hospital Insurance Act</em> and Regulations. If a discrepancy exists between the information Health Insurance BC has provided on this application and the legislation, the legislation will prevail.</p>
      </div>
    </PageContent>
    <ContinueBar @continue='nextPage()'/>
  </div>
</template>

<style scoped>
</style>

<script>
import pageStateService from '@/services/page-state-service';
import spaEnvService from '@/services/spa-env-service';
import {
  payPractitionerRoutes,
  commonRoutes,
} from '@/router/routes';
import {
  scrollTo,
  getTopScrollPosition
} from '@/helpers/scroll';
import ContinueBar from '@/components/ContinueBar.vue';
import PageContent from '@/components/PageContent.vue';
import ConsentModal from '@/components/ConsentModal.vue';
import { v4 as uuidv4 } from 'uuid';
import {
  MODULE_NAME as formModule,
  SET_APPLICATION_UUID,
  SET_CAPTCHA_TOKEN,
} from '@/store/modules/pay-practitioner-form';
import logService from '@/services/log-service';
import { getConvertedPath } from '@/helpers/url';

export default {
  name: 'HomePage',
  components: {
    ConsentModal,
    ContinueBar,
    PageContent,
  },
  data: () => {
    return {
      showConsentModal: true,
      applicationUuid: null,
    }
  },
  created() {
    this.applicationUuid = uuidv4();
    this.$store.dispatch(formModule + '/' + SET_APPLICATION_UUID, this.applicationUuid);

    // Load environment variables, and route to maintenance page.
    spaEnvService.loadEnvs()
      .then(() => {
        if (spaEnvService.values && spaEnvService.values.SPA_ENV_OOP_MAINTENANCE_FLAG === 'true') {
          const toPath = commonRoutes.MAINTENANCE_PAGE.path;
          pageStateService.setPageComplete(toPath);
          pageStateService.visitPage(toPath);
          this.$router.push(toPath);
        }
      })
      .catch((error) => {
        logService.logError(this.applicationUuid, {
          event: 'HTTP error getting values from spa-env-server',
          status: error.response.status,
        });
      });
    logService.logNavigation(
      this.applicationUuid,
      payPractitionerRoutes.HOME_PAGE.path,
      payPractitionerRoutes.HOME_PAGE.title
    );
  },
  methods: {
    handleCaptchaVerified(captchaToken) {
      this.$store.dispatch(formModule + '/' + SET_CAPTCHA_TOKEN, captchaToken);
    },
    handleCloseConsentModal() {
      this.showConsentModal = false;
    },
    nextPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        payPractitionerRoutes.CLAIM_COUNT_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    }
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (pageStateService.isPageComplete(to.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        payPractitionerRoutes.HOME_PAGE.path
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
