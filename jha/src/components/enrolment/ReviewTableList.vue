<template>
  <div :class="className + ' row'">
    <div class="col-lg-6">
      <div class="row align-items-end mt-3">
        <div class="col-9">
          <h2 class="mb-2">Account Holder</h2>
        </div>
        <div v-if='showEditButtons'
            class="col-3 text-right">
          <a href="javascript:void(0)"
            @click="navigateToPersonalInfoPage()">Edit 
            <font-awesome-icon icon="pencil-alt" />
          </a>
        </div>
      </div>
      <ReviewTable :elements='accountHolderData'
                  :backgroundColor='tableBackgroundColor'/>
    </div>
    
    <div class="col-lg-6">
      <div class="row align-items-end mt-3">
        <div class="col-9">
          <h2 class="mb-2">Spouse</h2>
        </div>
        <div v-if='showEditButtons'
            class="col-3 text-right">
          <a href="javascript:void(0)"
            @click="navigateToMainFormPage()">Edit 
            <font-awesome-icon icon="pencil-alt" />
          </a>
        </div>
      </div>
      <ReviewTable :elements='spouseData'
                  :backgroundColor='tableBackgroundColor'/>
    </div>

    <div class="col-lg-6" v-for="(childData, index) in childrenData"
        :key="'child-data-' + index">
      <div class="row align-items-end mt-3">
        <div class="col-9">
          <h2 class="mb-2">{{getChildTitle(index)}}</h2>
        </div>
        <div v-if='showEditButtons'
            class="col-3 text-right">
          <a href="javascript:void(0)"
            @click="navigateToChildInfoPage()">Edit 
            <font-awesome-icon icon="pencil-alt" />
          </a>
        </div>
      </div>
      <ReviewTable :elements='childData'
                  :backgroundColor='tableBackgroundColor'/>
    </div>
    
    <div v-if="isApplyingForFPCare" class="col-lg-6">
      <div class="row align-items-end mt-3">
        <div class="col-9">
          <h2 class="mb-2">Fair PharmaCare Financial Info</h2>
        </div>
        <div v-if='showEditButtons'
            class="col-3 text-right">
          <a href="javascript:void(0)"
            @click="navigateToFPCInfoPage()">Edit 
            <font-awesome-icon icon="pencil-alt" />
          </a>
        </div>
      </div>
      <ReviewTable :elements='fpcData'
                  :backgroundColor='tableBackgroundColor'/>
    </div>
    
    <div v-if="isApplyingForSuppBen" class="col-lg-6">
      <div class="row align-items-end mt-3">
        <div class="col-9">
          <h2 class="mb-2">Supplementary Benefits Financial Info</h2>
        </div>
        <div v-if='showEditButtons'
            class="col-3 text-right">
          <a href="javascript:void(0)"
            @click="navigateToSuppBenInfoPage()">Edit 
            <font-awesome-icon icon="pencil-alt" />
          </a>
        </div>
      </div>
      <ReviewTable :elements='suppBenData'
                  :backgroundColor='tableBackgroundColor'/>
    </div>

    <div class="col-lg-6">
      <div class="row align-items-end mt-3">
        <div class="col-9">
          <h2 class="mb-2">Contact Info</h2>
        </div>
        <div v-if='showEditButtons'
            class="col-3 text-right">
          <a href="javascript:void(0)"
            @click="navigateToContactInfoPage()">Edit 
            <font-awesome-icon icon="pencil-alt" />
          </a>
        </div>
      </div>
      <ReviewTable :elements='contactData'
                  :backgroundColor='tableBackgroundColor'/>
    </div>

  </div>
</template>

<script>
import ReviewTable from '@/components/ReviewTable.vue';
import { enrolmentRoutes } from '@/router/routes';
import { scrollTo } from '@/helpers/scroll';
import pageStateService from '@/services/page-state-service';
import { formatDate } from 'common-lib-vue';
import { getConvertedPath } from '@/helpers/url';
import { ChildAgeTypes } from '../../constants/child-age-types';

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default {
  name: 'ReviewTableList',
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
  data: () => {
    return {
      isApplyingForFPCare: false,
      isApplyingForSuppBen: false,
    }
  },
  created() {
    this.isApplyingForFPCare = this.$store.state.enrolmentModule.isApplyingForFPCare;
    this.isApplyingForSuppBen = this.$store.state.enrolmentModule.isApplyingForSuppBen;
  },
  computed: {
    accountHolderData() {
      const items = [];
      const firstName = this.$store.state.enrolmentModule.ahFirstName;
      const middleName = this.$store.state.enrolmentModule.ahMiddleName ? this.$store.state.enrolmentModule.ahMiddleName + ' ' : '';
      const lastName = this.$store.state.enrolmentModule.ahLastName;
      const name = `${firstName} ${middleName}${lastName} `;
      items.push({
        label: 'Name',
        value: name,
      });
      const gender = this.$store.state.enrolmentModule.ahGender === 'F' ? 'Female' : 'Male';
      items.push({
        label: 'Gender',
        value: gender,
      });
      const birthdate = formatDate(this.$store.state.enrolmentModule.ahBirthdate);
      items.push({
        label: 'Birthdate',
        value: birthdate,
      });
      const statusInCanada = this.$store.state.enrolmentModule.ahCitizenshipStatus + ' > ' + this.$store.state.enrolmentModule.ahCitizenshipStatusReason;
      items.push({
        label: 'Status in Canada',
        value: statusInCanada,
      });
      if (this.$store.state.enrolmentModule.ahHasLivedInBCSinceBirth !== 'Y') {
        items.push({
          label: 'Date arrived in B.C.',
          value: formatDate(this.$store.state.enrolmentModule.ahArrivalDateInBC),
        });
        items.push({
          label: 'Date arrived in Canada',
          value: formatDate(this.$store.state.enrolmentModule.ahArrivalDateInCanada),
        });
        items.push({
          label: 'Moved from province/country',
          value: this.$store.state.enrolmentModule.ahMoveFromOrigin,
        });
      }
      if (this.$store.state.enrolmentModule.ahIsOutsideBCLast12Months === 'Y') {
        items.push({
          label: 'Outside B.C. for more than 30 days',
          value: 'Yes',
        });
        items.push({
          label: 'Reason for leaving',
          value: this.$store.state.enrolmentModule.ahOutsideBCLast12MonthsReason,
        });
        items.push({
          label: 'Location',
          value: this.$store.state.enrolmentModule.ahOutsideBCLast12MonthsLocation,
        });
        items.push({
          label: 'Departure date',
          value: formatDate(this.$store.state.enrolmentModule.ahOutsideBCLast12MonthsDepartureDate),
        });
        items.push({
          label: 'Return date',
          value: formatDate(this.$store.state.enrolmentModule.ahOutsideBCLast12MonthsReturnDate),
        });
      }
      const releasedFromForces = this.$store.state.enrolmentModule.ahIsReleasedFromArmedForces === 'Y';
      items.push({
        label: 'Released from Canadian Forces',
        value: releasedFromForces ? 'Yes' : 'No',
      });
      if (releasedFromForces) {
        items.push({
          label: 'Date discharged',
          value: formatDate(this.$store.state.enrolmentModule.ahArmedForcesDischargeDate),
        });
      }
      const isFullTimeStudent = this.$store.state.enrolmentModule.ahIsStudent === 'Y';
      items.push({
        label: 'Full-time student',
        value: isFullTimeStudent ? 'Yes' : 'No',
      });
      if (isFullTimeStudent) {
        const willResideInBC = this.$store.state.enrolmentModule.ahWillStudentResideInBC === 'Y';
        items.push({
          label: 'Will you reside in BC upon completion of your studies',
          value: willResideInBC ? 'Yes' : 'No',
        });
      }
      const documentCount = this.$store.state.enrolmentModule.ahCitizenshipSupportDocuments.length + this.$store.state.enrolmentModule.ahNameChangeSupportDocuments.length;
      const fileLabel = ' file' + documentCount > 1 ? 's' : '';
      items.push({
        label: 'Documents',
        value: documentCount + fileLabel,
      });

      return items;
    },
    spouseData() {
      const items = [];
      const firstName = this.$store.state.enrolmentModule.spouseFirstName;
      const middleName = this.$store.state.enrolmentModule.spouseMiddleName ? this.$store.state.enrolmentModule.spouseMiddleName + ' ' : '';
      const lastName = this.$store.state.enrolmentModule.spouseLastName;
      const name = `${firstName} ${middleName}${lastName} `;
      items.push({
        label: 'Name',
        value: name,
      });
      const gender = this.$store.state.enrolmentModule.spouseGender === 'F' ? 'Female' : 'Male';
      items.push({
        label: 'Gender',
        value: gender,
      });
      const birthdate = formatDate(this.$store.state.enrolmentModule.spouseBirthDate);
      items.push({
        label: 'Birthdate',
        value: birthdate,
      });
      const statusInCanada = this.$store.state.enrolmentModule.spouseStatus + ' > ' + this.$store.state.enrolmentModule.spouseStatusReason;
      items.push({
        label: 'Status in Canada',
        value: statusInCanada,
      });
      if (this.$store.state.enrolmentModule.spouseLivedInBCSinceBirth !== 'Y') {
        items.push({
          label: 'Date arrived in B.C.',
          value: formatDate(this.$store.state.enrolmentModule.spouseRecentBCMoveDate),
        });
        items.push({
          label: 'Date arrived in Canada',
          value: formatDate(this.$store.state.enrolmentModule.spouseCanadaArrivalDate),
        });
        items.push({
          label: 'Moved from province/country',
          value: this.$store.state.enrolmentModule.spouseMovedFrom,
        });
      }
      if (this.$store.state.enrolmentModule.spouseOutsideBCLast12Months === 'Y') {
        items.push({
          label: 'Outside B.C. for more than 30 days',
          value: 'Yes',
        });
        items.push({
          label: 'Reason for leaving',
          value: this.$store.state.enrolmentModule.spouseOutsideBCLast12MonthsReason,
        });
        items.push({
          label: 'Location',
          value: this.$store.state.enrolmentModule.spouseOutsideBCLast12MonthsLocation,
        });
        items.push({
          label: 'Departure date',
          value: formatDate(this.$store.state.enrolmentModule.spouseOutsideBCLast12MonthsDepartureDate),
        });
        items.push({
          label: 'Return date',
          value: formatDate(this.$store.state.enrolmentModule.spouseOutsideBCLast12MonthsReturnDate),
        });
      }
      const releasedFromForces = this.$store.state.enrolmentModule.spouseBeenReleasedFromInstitution === 'Y';
      items.push({
        label: 'Released from Canadian Forces',
        value: releasedFromForces ? 'Yes' : 'No',
      });
      if (releasedFromForces) {
        items.push({
          label: 'Date discharged',
          value: formatDate(this.$store.state.enrolmentModule.spouseDischargeDate),
        });
      }
      const documentCount = this.$store.state.enrolmentModule.spouseCitizenshipSupportDocuments.length + this.$store.state.enrolmentModule.spouseNameChangeSupportDocuments.length;
      const fileLabel = ' file' + documentCount > 1 ? 's' : '';
      items.push({
        label: 'Documents',
        value: documentCount + fileLabel,
      });
      return items;
    },
    childrenData() {
      const chldrnData = [];
      const children = this.$store.state.enrolmentModule.children;

      for (let child of children) {
        const childData = [];
        const firstName = child.firstName;
        const middleName = child.middleName ? child.middleName + ' ' : '';
        const lastName = child.lastName;
        const name = `${firstName} ${middleName}${lastName}`;
        childData.push({
          label: 'Name',
          value: name,
        });
        const gender = child.gender === 'F' ? 'Female' : 'Male';
        childData.push({
          label: 'Gender',
          value: gender,
        });
        const birthdate = formatDate(child.birthDate);
        childData.push({
          label: 'Birthdate',
          value: birthdate,
        });
        const statusInCanada = child.status + ' > ' + child.statusReason;
        childData.push({
          label: 'Status in Canada',
          value: statusInCanada,
        });
        if (child.arrivalToBCDate) {
          childData.push({
            label: 'Date arrived in B.C.',
            value: formatDate(child.arrivalToBCDate),
          });
        }
        if (child.arrivalToCanadaDate) {
          childData.push({
            label: 'Date arrived in Canada',
            value: formatDate(child.arrivalToCanadaDate),
          });
        }
        if (child.movedFrom) {
          childData.push({
            label: 'Moved from province/country',
            value: child.movedFrom,
          });
        }
        if (child.outsideBCLast12Months === 'Y') {
          childData.push({
            label: 'Outside B.C. for more than 30 days',
            value: 'Yes',
          });
          childData.push({
            label: 'Reason for leaving',
            value: child.outsideBCLast12MonthsReason,
          });
          childData.push({
            label: 'Location',
            value: child.outsideBCLast12MonthsDestination,
          });
          childData.push({
            label: 'Departure date',
            value: formatDate(child.outsideBCLast12MonthsDepartureDate),
          });
          childData.push({
            label: 'Return date',
            value: formatDate(child.outsideBCLast12MonthsReturnDate),
          });
        }
        const isFullTimeStudent = child.ageRange === ChildAgeTypes.Child19To24;
        if (isFullTimeStudent) {
          childData.push({
            label: 'Full-time student',
            value: 'Yes',
          });
          const willResideInBC = child.willResideInBCAfterStudies === 'Y';
          childData.push({
            label: 'Will you reside in BC upon completion of your studies',
            value: willResideInBC ? 'Yes' : 'No',
          });
          childData.push({
            label: 'School name',
            value: child.schoolName,
          });
          childData.push({
            label: 'Street address 1',
            value: child.schoolAddressLine1,
          });
          childData.push({
            label: 'Street address 2',
            value: child.schoolAddressLine2,
          });
          childData.push({
            label: 'Street address 3',
            value: child.schoolAddressLine3,
          });
          childData.push({
            label: 'City',
            value: child.schoolCity,
          });
          childData.push({
            label: 'Province/State',
            value: child.schoolProvinceOrState,
          });
          childData.push({
            label: 'Postal code',
            value: child.schoolPostalCode,
          });
          childData.push({
            label: 'Country',
            value: child.schoolCountry,
          });
        }
        const documentCount = child.citizenshipSupportDocuments.length + child.nameChangeSupportDocuments.length;
        const fileLabel = ' file' + documentCount > 1 ? 's' : '';
        childData.push({
          label: 'Documents',
          value: documentCount + fileLabel,
        });
        chldrnData.push(childData);
      }
      return chldrnData;
    },
    fpcData() {
      const items = [];
      items.push({
        label: 'Account holder net income for 2019',
        value: moneyFormatter.format(this.$store.state.enrolmentModule.ahFPCIncome),
      });
      if (this.$store.state.enrolmentModule.hasSpouse === 'Y') {
        items.push({
          label: 'Spouse/common-law partner net income for 2019',
          value: moneyFormatter.format(this.$store.state.enrolmentModule.spouseFPCIncome),
        });
      }
      return items;
    },
    suppBenData() {
      const items = [];
      items.push({
        label: `Account Holder net income for ${this.$store.state.enrolmentModule.selectedNOAYear}`,
        value: moneyFormatter.format(this.$store.state.enrolmentModule.ahSBIncome),
      });
      items.push({
        label: `Spouse/common-law partner's net income from ${this.$store.state.enrolmentModule.selectedNOAYear}`,
        value: moneyFormatter.format(this.$store.state.enrolmentModule.ahSBIncome),
      });
      items.push({
        label: `Claimed disability tax credit in ${this.$store.state.enrolmentModule.selectedNOAYear}`,
        value: this.$store.state.enrolmentModule.hasDisabilityCredit === 'Y' ? 'Yes' : 'No',
      });
      items.push({
        label: `Who claimed`,
        value: this.$store.state.enrolmentModule.selectedDisabilityRecipients,
      });
      items.push({
        label: `Registered Disability Savings Plan?`,
        value: this.$store.state.enrolmentModule.hasRDSP === 'Y' ? 'Yes' : 'No',
      });
      items.push({
        label: `Claimed attendant or nursing home expenses`,
        value: this.$store.state.enrolmentModule.hasAttendantNursingExpenses === 'Y' ?  'Yes' : 'No',
      });
      items.push({
        label: `Who claimed`,
        value: this.$store.state.enrolmentModule.selectedAttendantNursingRecipients,
      });
      const documentCount = this.$store.state.enrolmentModule.attendantNursingReceipts.length;
      const fileLabel = (documentCount > 1) ? 's' : '';
      items.push({
        label: 'Documents',
        value: documentCount + ' file' + fileLabel
      });
      return items;
    },
    contactData() {
      const items = [];
      items.push({
        label: 'Residential Address',
        value: '',
      });
      items.push({
        label: 'Street Address 1',
        value: this.$store.state.enrolmentModule.resAddressLine1,
      });
      items.push({
        label: 'Street Address 2',
        value: this.$store.state.enrolmentModule.resAddressLine2,
      });
      items.push({
        label: 'Street Address 3',
        value: this.$store.state.enrolmentModule.resAddressLine3,
      });
      items.push({
        label: 'City',
        value: this.$store.state.enrolmentModule.resCity,
      });
      items.push({
        label: 'Province',
        value: this.$store.state.enrolmentModule.resProvince,
      });
      items.push({
        label: 'Postal Code',
        value: this.$store.state.enrolmentModule.resPostalCode,
      });
      items.push({
        label: 'Country',
        value: this.$store.state.enrolmentModule.resCountry,
      });
      if (!this.$store.state.enrolmentModule.isMailSame) {
        items.push({
          label: 'Mailing Address',
          value: '',
        });
        items.push({
          label: 'Street Address 1',
          value: this.$store.state.enrolmentModule.mailAddressLine1,
        });
        items.push({
          label: 'Street Address 2',
          value: this.$store.state.enrolmentModule.mailAddressLine2,
        });
        items.push({
          label: 'Street Address 3',
          value: this.$store.state.enrolmentModule.mailAddressLine3,
        });
        items.push({
          label: 'City',
          value: this.$store.state.enrolmentModule.mailCity,
        });
        items.push({
          label: 'Province',
          value: this.$store.state.enrolmentModule.mailProvince,
        });
        items.push({
          label: 'Postal Code',
          value: this.$store.state.enrolmentModule.mailPostalCode,
        });
        items.push({
          label: 'Country',
          value: this.$store.state.enrolmentModule.mailCountry,
        });
      }
      return items;
    },
  },
  methods: {
    navigateToPersonalInfoPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.PERSONAL_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      this.$router.push(toPath);
      scrollTo();
    },
    navigateToSpouseInfoPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.SPOUSE_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      this.$router.push(toPath);
    },
    navigateToChildInfoPage() {
        const toPath = getConvertedPath(
          this.$router.currentRoute.path,
          enrolmentRoutes.CHILD_INFO_PAGE.path
        );
        pageStateService.setPageComplete(toPath);
        this.$router.push(toPath);
    },
    navigateToFPCInfoPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.FPCARE_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      this.$router.push(toPath);
    },
    navigateToSuppBenInfoPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.SUPP_BEN_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      this.$router.push(toPath);
    },
    navigateToContactInfoPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.CONTACT_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      this.$router.push(toPath);
    },
    getChildTitle(index) {
      const children = this.$store.state.enrolmentModule.children;
      if (children && children.length > 1) {
        return `Child #${index + 1}`;
      }
      return 'Child';
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
