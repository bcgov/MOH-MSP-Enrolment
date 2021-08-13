<template>
  <div :class="className">

    <div v-if='isCSR'
        class="row align-items-end mt-3">
      <div class="col-9"></div>
      <div v-if='showEditButtons'
          class="col-3 text-right">
        <a href="javascript:void(0)"
           @click="navigateToMainFormPage('plan-reference-number')">Edit 
          <font-awesome-icon icon="pencil-alt" />
        </a>
      </div>
    </div>
    <ReviewTable v-if='isCSR'
                :elements='planReferenceNumberData'
                :backgroundColor='tableBackgroundColor'/>
    
    <div class="row align-items-end mt-3">
      <div class="col-9">
        <h2 class="mb-2">Patient Information</h2>
      </div>
      <div v-if='showEditButtons'
          class="col-3 text-right">
        <a href="javascript:void(0)"
           @click="navigateToMainFormPage('patient')">Edit 
          <font-awesome-icon icon="pencil-alt" />
        </a>
      </div>
    </div>
    <ReviewTable :elements='patientData'
                :backgroundColor='tableBackgroundColor'/>
    
    <div class="row align-items-end mt-3">
      <div class="col-9"></div>
      <div v-if='showEditButtons'
          class="col-3 text-right">
        <a href="javascript:void(0)"
           @click="navigateToMainFormPage('vehicle-accident')">Edit 
          <font-awesome-icon icon="pencil-alt" />
        </a>
      </div>
    </div>
    <ReviewTable :elements='vehicleAccidentData'
                :backgroundColor='tableBackgroundColor'/>

    <div class="row align-items-end mt-3">
      <div class="col-9"></div>
      <div v-if='showEditButtons'
          class="col-3 text-right">
        <a href="javascript:void(0)"
           @click="navigateToMainFormPage('claim-info')">Edit 
          <font-awesome-icon icon="pencil-alt" />
        </a>
      </div>
    </div>
    <ReviewTable :elements='claimInfoData'
                :backgroundColor='tableBackgroundColor'/>

    <div v-for="(claimData, index) in medicalServiceClaims"
        :key="index">
      <div class="row align-items-end mt-3">
        <div class="col-9">
          <h2 class="mb-2">{{getMedicalServiceClaimTitle(index)}}</h2>
        </div>
        <div v-if='showEditButtons'
            class="col-3 text-right">
          <a href="javascript:void(0)"
            @click="navigateToMainFormPage(`medical-service-claim-${index}`)">Edit 
            <font-awesome-icon icon="pencil-alt" />
          </a>
        </div>
      </div>
      <ReviewTable :elements='claimData'
                  :backgroundColor='tableBackgroundColor'/>
    </div>

    <div class="row align-items-end mt-3">
      <div class="col-9">
        <h2 class="mb-2">Payment Mailing Address</h2>
      </div>
      <div v-if='showEditButtons'
          class="col-3 text-right">
        <a href="javascript:void(0)"
           @click="navigateToMainFormPage('mailing-address')">Edit 
          <font-awesome-icon icon="pencil-alt" />
        </a>
      </div>
    </div>
    <ReviewTable :elements='paymentMailAddressData'
                :backgroundColor='tableBackgroundColor'/>
    
    <div class="row align-items-end mt-3">
      <div class="col-9">
        <h2 class="mb-2">Practitioner Information</h2>
      </div>
      <div v-if='showEditButtons'
          class="col-3 text-right">
        <a href="javascript:void(0)"
           @click="navigateToMainFormPage('practitioner')">Edit 
          <font-awesome-icon icon="pencil-alt" />
        </a>
      </div>
    </div>
    <ReviewTable :elements='practitionerData'
                :backgroundColor='tableBackgroundColor'/>

    <div class="row align-items-end mt-3">
      <div class="col-9">
        <h2 class="mb-2">Referred By</h2>
      </div>
      <div v-if='showEditButtons'
          class="col-3 text-right">
        <a href="javascript:void(0)"
           @click="navigateToMainFormPage('referred-by')">Edit 
          <font-awesome-icon icon="pencil-alt" />
        </a>
      </div>
    </div>
    <ReviewTable :elements='referredByData'
                :backgroundColor='tableBackgroundColor'/>
    
    <div class="row align-items-end mt-3">
      <div class="col-9">
        <h2 class="mb-2">Referred To</h2>
      </div>
      <div v-if='showEditButtons'
          class="col-3 text-right">
        <a href="javascript:void(0)"
           @click="navigateToMainFormPage('referred-to')">Edit 
          <font-awesome-icon icon="pencil-alt" />
        </a>
      </div>
    </div>
    <ReviewTable :elements='referredToData'
                :backgroundColor='tableBackgroundColor'/>

  </div>
</template>

<script>
import ReviewTable from '@/components/ReviewTable.vue';
import { payPatientRoutes } from '@/router/routes';
import {
  scrollTo,
  scrollToElement,
} from '@/helpers/scroll';
import pageStateService from '@/services/page-state-service';
import {
  capitalCaseWord,
  formatDate,
} from 'common-lib-vue';
import {
  getConvertedPath,
  isCSR,
} from '@/helpers/url';

export default {
  name: 'PayPatientReviewTableList',
  components: {
    ReviewTable,
  },
  props: {
    showEditButtons: {
      type: Boolean,
      default: false,
    },
    className: {
      type: String,
      default: '',
    },
    tableBackgroundColor: {
      type: String,
    }
  },
  computed: {
    planReferenceNumberData() {
      const items = [];
      items.push({
        label: 'Plan Reference Number:',
        value: this.$store.state.payPatientForm.planReferenceNumber,
      });
      return items;
    },
    patientData() {
      const items = [];
      items.push({
        label: 'Personal Health Number (PHN):',
        value: this.$store.state.payPatientForm.phn,
      });
      items.push({
        label: 'Dependant:',
        value: this.$store.state.payPatientForm.dependentNumber,
      });
      items.push({
        label: 'Patient Legal First Name:',
        value: this.$store.state.payPatientForm.firstName,
      });
      items.push({
        label: 'Second Name Initial:',
        value: this.$store.state.payPatientForm.middleInitial,
      });
      items.push({
        label: 'Patient Legal Last Name:',
        value: this.$store.state.payPatientForm.lastName,
      });
      items.push({
        label: 'Patient Birth Date:',
        value: formatDate(this.$store.state.payPatientForm.birthDate),
      });
      return items;
    },
    paymentMailAddressData() {
      const items = [];
      items.push({
        label: 'Whose address is this?',
        value: capitalCaseWord(this.$store.state.payPatientForm.addressOwner),
      });
      items.push({
        label: 'Apartment / Unit:',
        value: this.$store.state.payPatientForm.unitNumber,
      });
      items.push({
        label: 'Street Number:',
        value: this.$store.state.payPatientForm.streetNumber,
      });
      items.push({
        label: 'Street Name:',
        value: this.$store.state.payPatientForm.streetName,
      });
      items.push({
        label: 'City:',
        value: this.$store.state.payPatientForm.city,
      });
      items.push({
        label: 'Province:',
        value: 'British Columbia',
      });
      items.push({
        label: 'Postal Code:',
        value: this.$store.state.payPatientForm.postalCode,
      });
      return items;
    },
    vehicleAccidentData() {
      const items = [];
      items.push({
        label: 'Is this claim related to a motor vehicle accident?',
        value: this.$store.state.payPatientForm.isVehicleAccident === 'Y' ? 'Yes' : 'No',
      });
      items.push({
        label: 'Motor Vehicle Accident Claim Number:',
        value: this.$store.state.payPatientForm.vehicleAccidentClaimNumber,
      });
      return items;
    },
    claimInfoData() {
      const items = [];
      items.push({
        label: 'Plan Reference Number of Original Claim:',
        value: this.$store.state.payPatientForm.planReferenceNumberOfOriginalClaim,
      });
      return items;
    },
    medicalServiceClaims() {
      const claims = [];
      const numClaims = this.$store.state.payPatientForm.medicalServiceClaims.length;

      for (let i=0; i<numClaims; i++) {
        const itemData = [];
        itemData.push({
          label: 'Service Date:',
          value: formatDate(this.$store.state.payPatientForm.medicalServiceClaims[i].serviceDate),
        });
        itemData.push({
          label: 'Number of Services:',
          value: this.$store.state.payPatientForm.medicalServiceClaims[i].numberOfServices,
        });
        itemData.push({
          label: 'Service Clarification Code:',
          value: this.$store.state.payPatientForm.medicalServiceClaims[i].serviceClarificationCode,
        });
        itemData.push({
          label: 'Fee Item:',
          value: this.$store.state.payPatientForm.medicalServiceClaims[i].feeItem,
        });
        itemData.push({
          label: 'Amount Billed:',
          value: this.$store.state.payPatientForm.medicalServiceClaims[i].amountBilled,
        });
        const calledStartTime = this.$store.state.payPatientForm.medicalServiceClaims[i].calledStartTime;
        itemData.push({
          label: 'Called Start Time:',
          value: calledStartTime && calledStartTime.time ? calledStartTime.time : '',
        });
        const renderedFinishTime = this.$store.state.payPatientForm.medicalServiceClaims[i].renderedFinishTime;
        itemData.push({
          label: 'Rendered Finish Time:',
          value: renderedFinishTime && renderedFinishTime.time ? renderedFinishTime.time : '',
        });
        itemData.push({
          label: 'Diagnostic Code:',
          value: this.$store.state.payPatientForm.medicalServiceClaims[i].diagnosticCode,
        });
        itemData.push({
          label: 'Service Location Code:',
          value: this.$store.state.payPatientForm.medicalServiceClaims[i].locationOfService,
        });
        itemData.push({
          label: 'Correspondence Attached:',
          value: this.$store.state.payPatientForm.medicalServiceClaims[i].correspondenceAttached,
        });
        itemData.push({
          label: 'Submission Code:',
          value: this.$store.state.payPatientForm.medicalServiceClaims[i].submissionCode,
        });
        itemData.push({
          label: 'Notes/Additional Information:',
          value: this.$store.state.payPatientForm.medicalServiceClaims[i].notes,
        });
        claims.push(itemData);
      }
      return claims;
    },
    practitionerData() {
      const items = [];
      items.push({
        label: 'Practitioner Last Name:',
        value: this.$store.state.payPatientForm.practitionerLastName,
      });
      items.push({
        label: 'Practitioner First Name:',
        value: this.$store.state.payPatientForm.practitionerFirstName,
      });
      items.push({
        label: 'Payment Number:',
        value: this.$store.state.payPatientForm.practitionerPaymentNumber,
      });
      items.push({
        label: 'Practitioner Number:',
        value: this.$store.state.payPatientForm.practitionerPractitionerNumber,
      });
      items.push({
        label: 'Specialty Code:',
        value: this.$store.state.payPatientForm.practitionerSpecialtyCode,
      });
      items.push({
        label: 'Facility Number:',
        value: this.$store.state.payPatientForm.practitionerFacilityNumber,
      });
      return items;
    },
    referredByData() {
      const items = [];
      items.push({
        label: 'Referred By Practitioner Number:',
        value: this.$store.state.payPatientForm.referredByPractitionerNumber,
      });
      items.push({
        label: 'Referred By Practitioner Last Name:',
        value: this.$store.state.payPatientForm.referredByLastName,
      });
      items.push({
        label: 'Referred By Practitioner First Name Initial:',
        value: this.$store.state.payPatientForm.referredByFirstNameInitial,
      });
      return items;
    },
    referredToData() {
      const items = [];
      items.push({
        label: 'Referred To Practitioner Number:',
        value: this.$store.state.payPatientForm.referredToPractitionerNumber,
      });
      items.push({
        label: 'Referred To Practitioner Last Name:',
        value: this.$store.state.payPatientForm.referredToLastName,
      });
      items.push({
        label: 'Referred To Practitioner First Name Initial:',
        value: this.$store.state.payPatientForm.referredToFirstNameInitial,
      });
      return items;
    },
    isCSR() {
      return isCSR(this.$router.currentRoute.path);
    }
  },
  methods: {
    navigateToClaimCountPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        payPatientRoutes.CLAIM_COUNT_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      this.$router.push(toPath);
      scrollTo();
    },
    navigateToMainFormPage(anchorName) {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        payPatientRoutes.MAIN_FORM_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      this.$router.push(toPath);
      this.$nextTick(() => {
        const anchorEl = document.querySelector(`a[name="${anchorName}"`);
        scrollToElement(anchorEl, false, 0);
      }, 0);
    },
    getMedicalServiceClaimTitle(index) {
      const claims = this.$store.state.payPatientForm.medicalServiceClaims;
      if (claims && claims.length > 1) {
        return `Service (${index + 1} of ${this.medicalServiceClaims.length})`;
      }
      return 'Service';
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
/* Setting the size of the edit icons. */
a svg {
  width: 16px;
  height: 16px;
}
</style>
