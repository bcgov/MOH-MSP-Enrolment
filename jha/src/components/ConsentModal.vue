<template>
  <div ref="modal">
    <div class="modal fade show"
        id="exampleModal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title" id="exampleModalLabel">Information collection notice</h2>
          </div>
          <div class="modal-body">
            <p v-if="isMSPNoticeShown"><b>{{mspNoticeTitle}}:</b> Personal information is collected under the authority of the Medicare Protection Act and section 26 (a), (c) and (e) of the Freedom of Information and Protection of Privacy Act (FOIPPA) for the purposes of administration of the Medical Services Plan. Information may be disclosed pursuant to section 33 of FOIPPA. If you have any questions about the collection and use of your personal information, please contact the Health Insurance BC Chief Privacy Office at Health Insurance BC, Chief Privacy Office, PO Box 9035 STN PROV GOVT, Victoria, BC V8W 9E3 or call 604 683-7151 (Vancouver) or 1 800 663-7100 (toll-free).</p>
            <p v-if="isFPCNoticeShown"><b>FAIR PHARMACARE:</b> Personal information is collected, used, disclosed and provided security in accordance with the British Columbia Freedom of Information and Protection of Privacy Act. If you have any questions about the collection or use of this information, contact Health Insurance BC or the Health Insurance BC Chief Privacy Office.</p>
            <Captcha v-if="!isCaptchaValid"
                    class="mt-4"
                    :apiBasePath="captchaAPIBasePath"
                    :nonce="applicationUuid"
                    @captchaLoaded="handleCaptchaLoaded()"
                    @captchaVerified="handleCaptchaVerified($event)" />
            <div v-if="isCaptchaValid"
                class="text-success">Captcha successfully verified.</div>
            <div class="mt-3">
              <input type="checkbox"
                    id="is-terms-accepted"
                    class="d-inline"
                    v-model="isTermsAccepted" />
              <label for="is-terms-accepted"
                    class="mt-3 ml-2 d-inline"><b>I have read and understand this information</b></label>
            </div>
            
          </div>
          <div class="modal-footer justify-content-center">
            <Button label="Continue"
                    @click="closeModal()"
                    :disabled="!isCaptchaValid || !isTermsAccepted"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Button,
  Captcha,
} from "common-lib-vue";
import {
  MODULE_NAME as enrolmentModule,
  SET_CAPTCHA_TOKEN
} from '../store/modules/enrolment-module';

export default {
  name: "ConsentModal",
  components: {
    Button,
    Captcha,
  },
  data: () => {
    return {
      focusableEls: [],
      focusedEl: null,
      applicationUuid: null,
      captchaAPIBasePath: '/ahdc/api/captcha',
      isCaptchaValid: false,
      isTermsAccepted: false,
    };
  },
  created() {
    this.applicationUuid = this.$store.state.enrolmentModule.applicationUuid;
    window.addEventListener('keydown', this.handleKeyDown);
    document.body.classList.add('no-scroll');
  },
  destroyed() {
    window.removeEventListener('keydown', this.handleKeyDown);
    document.body.classList.remove('no-scroll');
  },
  mounted() {
    this.focusableEls = this.getFocusableEls();
  },
  methods: {
    getFocusableEls() {
      // Create an array of focusable elements from the contents of the modal
      return Array.from(this.$refs.modal.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button, [tabindex="0"]'));
    },
    handleCaptchaLoaded() {
      this.focusableEls = this.getFocusableEls();
    },
    handleCaptchaVerified(captchaToken) {
      this.$store.dispatch(`${enrolmentModule}/${SET_CAPTCHA_TOKEN}`, captchaToken);
      this.isCaptchaValid = true;
      setTimeout(() => {
        this.focusableEls = this.getFocusableEls();
      }, 0);
    },
    closeModal() {
      this.$emit('close', true);
    },
    handleKeyDown(event) {
      // Handle tabbing
      if (event.key === 'Tab') {
        // Prevent usual tabbing, manually set focus
        event.preventDefault();
        if (event.shiftKey) {
          this.handleTabBackwards();
        } else {
          this.handleTab();
        }
      }
    },
    // Move to next focusable element, if at last element, move to first
    handleTab() {
      if (!this.focusedEl && this.focusableEls.length > 0) {
        this.focusedEl = this.focusableEls[0];
        this.focusedEl.focus();
        return;
      }
      const position = this.focusableEls.indexOf(this.focusedEl);
      if (position === this.focusableEls.length - 1) {
        this.focusedEl = this.focusableEls[0];
      } else {
        this.focusedEl = this.focusableEls[position + 1];
      }
      this.focusedEl.focus();
    },
    // Move to next focusable element, if at last element, move to first
    handleTabBackwards() {
      if (!this.focusedEl && this.focusableEls.length > 0) {
        this.focusedEl = this.focusableEls[this.focusableEls.length - 1];
        this.focusedEl.focus();
        return;
      }
      const position = this.focusableEls.indexOf(this.focusedEl);
      if (position === 0) {
        this.focusedEl = this.focusableEls[this.focusableEls.length - 1];
      } else {
        this.focusedEl = this.focusableEls[position - 1];
      }
      this.focusedEl.focus();
    },
  },
  computed: {
    isMSPNoticeShown() {
      return this.$store.state.enrolmentModule.isApplyingForMSP
          || this.$store.state.enrolmentModule.isApplyingForSuppBen;
    },
    isFPCNoticeShown() {
      return this.$store.state.enrolmentModule.isApplyingForFPCare;
    },
    mspNoticeTitle() {
      if (this.$store.state.enrolmentModule.isApplyingForMSP
        && this.$store.state.enrolmentModule.isApplyingForSuppBen) {
        return 'MEDICAL SERVICES PLAN (MSP) AND MSP SUPPLEMENTARY BENEFITS';
      } else if (this.$store.state.enrolmentModule.isApplyingForMSP) {
        return 'MEDICAL SERVICES PLAN (MSP)';
      } else if (this.$store.state.enrolmentModule.isApplyingForSuppBen) {
        return 'MSP SUPPLEMENTARY BENEFITS';
      }
      return '';
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal.show {
  display: block;
  background-color: rgba(0, 0, 0, 0.4);
  overflow-y: scroll;
}
.modal-header {
  background: #036;
  color: #FFF;
}
</style>
