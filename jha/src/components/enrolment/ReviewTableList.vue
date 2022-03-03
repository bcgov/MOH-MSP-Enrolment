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
    
    <div class="col-lg-6" v-if='hasSpouse'>
      <div class="row align-items-end mt-3">
        <div class="col-9">
          <h2 class="mb-2">Spouse</h2>
        </div>
        <div v-if='showEditButtons'
            class="col-3 text-right">
          <a href="javascript:void(0)"
            @click="navigateToSpouseInfoPage()">Edit 
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
    this.isApplyingForMSP = this.$store.state.enrolmentModule.isApplyingForMSP;
    this.isApplyingForFPCare = this.$store.state.enrolmentModule.isApplyingForFPCare;
    this.isApplyingForSuppBen = this.$store.state.enrolmentModule.isApplyingForSuppBen;
  },
  computed: {
    accountHolderData() {
      const items = [];
      const firstName = this.$store.state.enrolmentModule.ahFirstName;
      const middleName = this.$store.state.enrolmentModule.ahMiddleName
        ? this.$store.state.enrolmentModule.ahMiddleName + " "
        : "";
      const lastName = this.$store.state.enrolmentModule.ahLastName;
      const name = `${firstName} ${middleName}${lastName} `;
      items.push({
        label: "Name",
        value: name,
      });
      if (this.isApplyingForMSP) {
        items.push({
          label: "Gender",
          value: this.getFormattedGender(this.$store.state.enrolmentModule.ahGender),
        });
      }
      const birthdate = formatDate(
        this.$store.state.enrolmentModule.ahBirthdate
      );
      items.push({
        label: "Birthdate",
        value: birthdate,
      });
      if (!this.isApplyingForMSP) {
        items.push({
          label: "Account holder PHN",
          value: this.$store.state.enrolmentModule.ahPHN,
        });
        items.push({
          label: "Account holder SIN",
          value: this.$store.state.enrolmentModule.ahSIN,
        });
      }
      if (this.isApplyingForMSP) {
        const statusInCanada =
          this.$store.state.enrolmentModule.ahCitizenshipStatus +
          " > " +
          this.$store.state.enrolmentModule.ahCitizenshipStatusReason;
        items.push({
          label: "Status in Canada",
          value: statusInCanada,
        });
        items.push({
          label: "Support document type",
          value: this.$store.state.enrolmentModule
            .ahCitizenshipSupportDocumentType,
        });
        items.push({
          label: "Is Name Changed",
          value:
            this.$store.state.enrolmentModule.ahIsNameChanged === "Y"
              ? "Yes"
              : "No",
        });
        if (this.$store.state.enrolmentModule.ahIsNameChanged === "Y") {
          items.push({
            label: "Name Change Support Document Type",
            value: this.$store.state.enrolmentModule
              .ahNameChangeSupportDocumentType,
          });
        }
        items.push({
          label: "Lived in BC since birth?",
          value:
            this.$store.state.enrolmentModule.ahHasLivedInBCSinceBirth === "Y"
              ? "Yes"
              : "No",
        });
        if (
          this.$store.state.enrolmentModule.ahHasLivedInBCSinceBirth !== "Y"
        ) {
          items.push({
            label: "Date arrived in B.C.",
            value: formatDate(
              this.$store.state.enrolmentModule.ahArrivalDateInBC
            ),
          });
          items.push({
            label: "Date arrived in Canada",
            value: formatDate(
              this.$store.state.enrolmentModule.ahArrivalDateInCanada
            ),
          });
          items.push({
            label: "Has account holder moved permanently to BC?",
            value:
              this.$store.state.enrolmentModule.ahIsMovedToBCPermanently === "Y"
                ? "Yes"
                : "No",
          });
          let displayMoveFromLocation = "";
          if (this.$store.state.enrolmentModule.ahMoveFromOrigin) {
            displayMoveFromLocation = this.$store.state.enrolmentModule.ahMoveFromOrigin;
          } else if (this.$store.state.enrolmentModule.ahFromProvinceOrCountry) {
            displayMoveFromLocation = this.$store.state.enrolmentModule.ahFromProvinceOrCountry;
          }
          items.push({
            label: "Moved from province/jurisdiction",
            value: displayMoveFromLocation,
          });
        }
        const ahPreviousHealthNumber = this.$store.state.enrolmentModule
          .ahPreviousHealthNumber;
        items.push({
          label: "Previous Health number",
          value: ahPreviousHealthNumber ? ahPreviousHealthNumber : "No",
        });
        items.push({
          label: "Has previous BC PHN?",
          value:
            this.$store.state.enrolmentModule.ahHasPreviousPHN === "Y"
              ? "Yes"
              : "No",
        });
        if (this.$store.state.enrolmentModule.ahHasPreviousPHN === "Y") {
          items.push({
            label: "Previous BC PHN:",
            value: this.$store.state.enrolmentModule.ahPreviousPHN,
          });
        }
        items.push({
          label: "Outside B.C. for more than 30 days",
          value:
            this.$store.state.enrolmentModule.ahIsOutsideBCLast12Months === "Y"
              ? "Yes"
              : "No",
        });
        if (
          this.$store.state.enrolmentModule.ahIsOutsideBCLast12Months === "Y"
        ) {
          items.push({
            label: "Reason for leaving",
            value: this.$store.state.enrolmentModule
              .ahOutsideBCLast12MonthsReason,
          });
          items.push({
            label: "Location",
            value: this.$store.state.enrolmentModule
              .ahOutsideBCLast12MonthsLocation,
          });
          items.push({
            label: "Departure date",
            value: formatDate(
              this.$store.state.enrolmentModule
                .ahOutsideBCLast12MonthsDepartureDate
            ),
          });
          items.push({
            label: "Return date",
            value: formatDate(
              this.$store.state.enrolmentModule
                .ahOutsideBCLast12MonthsReturnDate
            ),
          });
        }
        if (
          this.$store.state.enrolmentModule.ahCitizenshipStatus ===
          "Canadian Citizen"
        ) {
          const releasedFromForces =
            this.$store.state.enrolmentModule.ahIsReleasedFromArmedForces ===
            "Y";
          items.push({
            label: "Released from Canadian Forces",
            value: releasedFromForces ? "Yes" : "No",
          });
          if (releasedFromForces) {
            items.push({
              label: "Date discharged",
              value: formatDate(
                this.$store.state.enrolmentModule.ahArmedForcesDischargeDate
              ),
            });
          }
        }
        const isFullTimeStudent =
          this.$store.state.enrolmentModule.ahIsStudent === "Y";
        items.push({
          label: "Full-time student",
          value: isFullTimeStudent ? "Yes" : "No",
        });
        if (isFullTimeStudent) {
          const willResideInBC =
            this.$store.state.enrolmentModule.ahWillStudentResideInBC === "Y";
          items.push({
            label: "Will you reside in BC upon completion of your studies",
            value: willResideInBC ? "Yes" : "No",
          });
        }
      }
      let documentCount = 0;
      if (
        this.$store.state.enrolmentModule.ahCitizenshipSupportDocuments.length >
        0
      ) {
        documentCount += 1;
      }
      if (
        this.$store.state.enrolmentModule.ahNameChangeSupportDocuments.length >
        0
      ) {
        documentCount += 1;
      }
      items.push({
        label: "Documents",
        value: `${documentCount} ${this.getFilePlural(documentCount)}`,
      });
      return items;
    },
    spouseData() {
      const items = [];

      const firstName = this.$store.state.enrolmentModule.spouseFirstName;
      const middleName = this.$store.state.enrolmentModule.spouseMiddleName
        ? this.$store.state.enrolmentModule.spouseMiddleName + " "
        : "";
      const lastName = this.$store.state.enrolmentModule.spouseLastName;
      const name = `${firstName} ${middleName}${lastName} `;
      items.push({
        label: "Name",
        value: name,
      });
      if (this.isApplyingForMSP) {
        items.push({
          label: "Is Name Changed",
          value:
            this.$store.state.enrolmentModule.spouseIsNameChanged === "Y"
              ? "Yes"
              : "No",
        });
        if (this.$store.state.enrolmentModule.spouseIsNameChanged === "Y") {
          items.push({
            label: "Name Change Support Document Type",
            value: this.$store.state.enrolmentModule
              .spouseNameChangeSupportDocumentType,
          });
        }
        items.push({
          label: "Gender",
          value: this.getFormattedGender(this.$store.state.enrolmentModule.spouseGender),
        });
      }
      const birthdate = formatDate(
        this.$store.state.enrolmentModule.spouseBirthDate
      );
      items.push({
        label: "Birthdate",
        value: birthdate,
      });
      if (!this.isApplyingForMSP) {
        items.push({
          label: "Spouse PHN",
          value: this.$store.state.enrolmentModule.spousePHN,
        });
        items.push({
          label: "Spouse SIN",
          value: this.$store.state.enrolmentModule.spouseSIN,
        });
      }
      if (this.isApplyingForMSP) {
        const statusInCanada =
          this.$store.state.enrolmentModule.spouseStatus +
          " > " +
          this.$store.state.enrolmentModule.spouseStatusReason;
        items.push({
          label: "Status in Canada",
          value: statusInCanada,
        });
        items.push({
          label: "Citizenship Suport Document Type",
          value: this.$store.state.enrolmentModule
            .spouseCitizenshipSupportDocumentType,
        });
        items.push({
          label: "Lived in BC Since Birth",
          value:
            this.$store.state.enrolmentModule.spouseLivedInBCSinceBirth === "Y"
              ? "Yes"
              : "No",
        });
        if (
          this.$store.state.enrolmentModule.spouseLivedInBCSinceBirth !== "Y"
        ) {
          items.push({
            label: "Date arrived in B.C.",
            value: formatDate(
              this.$store.state.enrolmentModule.spouseRecentBCMoveDate
            ),
          });
          items.push({
            label: "Date arrived in Canada",
            value: formatDate(
              this.$store.state.enrolmentModule.spouseCanadaArrivalDate
            ),
          });
          items.push({
            label: "Moved from province/jurisdiction",
            value: this.$store.state.enrolmentModule.spouseMoveFromOrigin,
          });
        }
        items.push({
          label: "Has spouse moved permanently?",
          value:
            this.$store.state.enrolmentModule.spouseMadePermanentMove === "Y"
              ? "Yes"
              : "No",
        });
        const spousePreviousHealthNumber = this.$store.state.enrolmentModule
          .spousePreviousHealthNumber;
        items.push({
          label: "Previous health number",
          value: spousePreviousHealthNumber ? spousePreviousHealthNumber : "No",
        });
        items.push({
          label: "Outside B.C. for more than 30 days",
          value:
            this.$store.state.enrolmentModule.spouseOutsideBCLast12Months ===
            "Y"
              ? "Yes"
              : "No",
        });
        if (
          this.$store.state.enrolmentModule.spouseOutsideBCLast12Months === "Y"
        ) {
          items.push({
            label: "Reason for leaving",
            value: this.$store.state.enrolmentModule
              .spouseOutsideBCLast12MonthsReason,
          });
          items.push({
            label: "Location",
            value: this.$store.state.enrolmentModule
              .spouseOutsideBCLast12MonthsDestination,
          });
          items.push({
            label: "Departure date",
            value: formatDate(
              this.$store.state.enrolmentModule
                .spouseOutsideBCLast12MonthsDepartureDate
            ),
          });
          items.push({
            label: "Return date",
            value: formatDate(
              this.$store.state.enrolmentModule
                .spouseOutsideBCLast12MonthsReturnDate
            ),
          });
        }
        items.push({
          label: "Has Previous BC Health Number",
          value:
            this.$store.state.enrolmentModule
              .spouseHasPreviousBCHealthNumber === "Y"
              ? "Yes"
              : "No",
        });
        if (
          this.$store.state.enrolmentModule.spouseHasPreviousBCHealthNumber ===
          "Y"
        ) {
          items.push({
            label: "Previous BC Health Number",
            value: this.$store.state.enrolmentModule
              .spousePreviousBCHealthNumber,
          });
        }
        const releasedFromForces =
          this.$store.state.enrolmentModule
            .spouseBeenReleasedFromInstitution === "Y";
        items.push({
          label: "Released from Canadian Forces",
          value: releasedFromForces ? "Yes" : "No",
        });
        if (releasedFromForces) {
          items.push({
            label: "Date discharged",
            value: formatDate(
              this.$store.state.enrolmentModule.spouseDischargeDate
            ),
          });
        }
      }
      let documentCount = 0;
      if (
        this.$store.state.enrolmentModule.spouseCitizenshipSupportDocuments
          .length > 0
      ) {
        documentCount += 1;
      }
      if (
        this.$store.state.enrolmentModule.spouseNameChangeSupportDocuments
          .length > 0
      ) {
        documentCount += 1;
      }
      items.push({
        label: "Documents",
        value: `${documentCount} ${this.getFilePlural(documentCount)}`,
      });
      return items;
    },
    childrenData() {
      const chldrnData = [];
      const children = this.$store.state.enrolmentModule.children;

      for (let child of children) {
        const childData = [];
        const firstName = child.firstName;
        const middleName = child.middleName ? child.middleName + " " : "";
        const lastName = child.lastName;
        const name = `${firstName} ${middleName}${lastName}`;
        childData.push({
          label: "Name",
          value: name,
        });
        if (this.isApplyingForMSP) {
          childData.push({
            label: "Name changed?",
            value: child.isNameChanged === "Y" ? "Yes" : "No",
          });
          if (child.isNameChanged === "Y") {
            childData.push({
              label: "Name change document type",
              value: child.nameChangeSupportDocumentType,
            });
          }
        }
        const birthdate = formatDate(child.birthDate);
        childData.push({
          label: "Birthdate",
          value: birthdate,
        });
        if (!this.isApplyingForMSP) {
          childData.push({
            label: "Child PHN",
            value: child.personalHealthNumber,
          });
        }
        if (this.isApplyingForMSP) {
          childData.push({
            label: "Gender",
            value: this.getFormattedGender(child.gender),
          });
          const statusInCanada = child.status + " > " + child.statusReason;
          childData.push({
            label: "Status in Canada",
            value: statusInCanada,
          });
          childData.push({
            label: "Support Document Type",
            value: child.citizenshipSupportDocumentType,
          });
          childData.push({
            label: "Lived in BC since birth?",
            value: child.livedInBCSinceBirth === "Y" ? "Yes" : "No",
          });
          childData.push({
            label: "Has child moved to BC permanently",
            value: child.madePermanentMove === "Y" ? "Yes" : "No",
          });
          if (child.livedInBCSinceBirth !== "Y") {
            childData.push({
              label: "Date arrived in B.C.",
              value: formatDate(child.recentBCMoveDate),
            });
            childData.push({
              label: "Date arrived in Canada",
              value: formatDate(child.canadaArrivalDate),
            });
            childData.push({
              label: "Location child moved from:",
              value: child.moveFromOrigin,
            });
            if (child.previousHealthNumber) {
              childData.push({
                label: "Health number from previous residence:",
                value: child.previousHealthNumber
                  ? child.previousHealthNumber
                  : "No",
              });
            }
          }
          childData.push({
            label: "Outside B.C. for more than 30 days in the last year?",
            value: child.outsideBCLast12Months === "Y" ? "Yes" : "No",
          });
          if (child.outsideBCLast12Months === "Y") {
            childData.push({
              label: "Reason for leaving",
              value: child.outsideBCLast12MonthsReason,
            });
            childData.push({
              label: "Location",
              value: child.outsideBCLast12MonthsDestination,
            });
            childData.push({
              label: "Departure date",
              value: formatDate(child.outsideBCLast12MonthsDepartureDate),
            });
            childData.push({
              label: "Return date",
              value: formatDate(child.outsideBCLast12MonthsReturnDate),
            });
          }
          childData.push({
            label: "Has previous BC Health number?",
            value: child.hasPreviousBCHealthNumber === "Y" ? "Yes" : "No",
          });
          if (child.hasPreviousBCHealthNumber === "Y") {
            childData.push({
              label: "Previous BC Health number?",
              value: child.previousBCHealthNumber,
            });
          }
          if (child.status === "Canadian Citizen") {
            childData.push({
              label: "Has child been released from institution?",
              value:
                child.hasBeenReleasedFromInstitution === "Y" ? "Yes" : "No",
            });
            if (child.hasBeenReleasedFromInstitution === "Y") {
              childData.push({
                label: "Discharge date:",
                value: formatDate(child.dischargeDate),
              });
            }
          }
          const isFullTimeStudent =
            child.ageRange === ChildAgeTypes.Child19To24;
          if (isFullTimeStudent) {
            childData.push({
              label: "Full-time student",
              value: isFullTimeStudent ? "Yes" : "No",
            });
            const willResideInBC = child.willResideInBCAfterStudies === "Y";
            childData.push({
              label: "Will you reside in BC upon completion of your studies",
              value: willResideInBC ? "Yes" : "No",
            });
            childData.push({
              label: "School name",
              value: child.schoolName,
            });
            childData.push({
              label: "Street address 1",
              value: child.schoolAddressLine1,
            });
            childData.push({
              label: "Street address 2",
              value: child.schoolAddressLine2,
            });
            childData.push({
              label: "Street address 3",
              value: child.schoolAddressLine3,
            });
            childData.push({
              label: "City",
              value: child.schoolCity,
            });
            childData.push({
              label: "Province/State",
              value: child.schoolProvinceOrState,
            });
            childData.push({
              label: "Postal code",
              value: child.schoolPostalCode,
            });
            childData.push({
              label: "Jurisdiction",
              value: child.schoolCountry,
            });
            childData.push({
              label: "School departure date:",
              value: formatDate(child.schoolDepartureDate),
            });
            childData.push({
              label: "Estimated school completion date:",
              value: formatDate(child.schoolCompletionDate),
            });
          }
        }
        let documentCount = 0;
        if (child.citizenshipSupportDocuments.length > 0) {
          documentCount += 1;
        }
        if (child.nameChangeSupportDocuments.length > 0) {
          documentCount += 1;
        }
        childData.push({
          label: "Documents",
          value: `${documentCount} ${this.getFilePlural(documentCount)}`,
        });
        chldrnData.push(childData);
      }
      return chldrnData;
    },
    fpcData() {
      const items = [];
      const ahFPCIncome = this.$store.state.enrolmentModule.ahFPCIncome;
      items.push({
        label: "Account holder net income for 2019",
        value: ahFPCIncome
          ? moneyFormatter.format(ahFPCIncome)
          : moneyFormatter.format("0"),
      });
      if (this.$store.state.enrolmentModule.hasSpouse === "Y") {
        const spouseFPCIncome = this.$store.state.enrolmentModule
          .spouseFPCIncome;
        items.push({
          label: "Spouse/common-law partner net income for 2019",
          value: spouseFPCIncome
            ? moneyFormatter.format(
                this.$store.state.enrolmentModule.spouseFPCIncome
              )
            : moneyFormatter.format("0"),
        });
      }
      const ahFPCRDSP = this.$store.state.enrolmentModule.ahFPCRDSP;
      items.push({
        label: "Account holder RDSP amount",
        value: ahFPCRDSP
          ? moneyFormatter.format(ahFPCRDSP)
          : moneyFormatter.format("0"),
      });
      if (this.$store.state.enrolmentModule.hasSpouse === "Y") {
        const spouseFPCRDSP = this.$store.state.enrolmentModule.spouseFPCRDSP;
        items.push({
          label: "Spouse RDSP amount",
          value: spouseFPCRDSP
            ? moneyFormatter.format(spouseFPCRDSP)
            : moneyFormatter.format("0"),
        });
      }
      items.push({
        label: "Widget data",
        value: "placeholder",
      });
      return items;
    },
    suppBenData() {
      const items = [];
      const selectedYear = this.$store.state.enrolmentModule.selectedNOAYear;
      items.push({
        label: `Account Holder net income for ${selectedYear}`,
        value: moneyFormatter.format(
          this.$store.state.enrolmentModule.ahSBIncome
        ),
      });
      if (this.$store.state.enrolmentModule.hasSpouse === "Y") {
        items.push({
          label: `Spouse/common-law partner's net income from ${selectedYear}`,
          value: moneyFormatter.format(
            this.$store.state.enrolmentModule.spouseSBIncome
          ),
        });
      }
      items.push({
        label: `Number of children on MSP account`,
        value: this.$store.state.enrolmentModule.numChildren
          ? this.$store.state.enrolmentModule.numChildren
          : "0",
      });
      if (this.$store.state.enrolmentModule.hasChildren === "Y") {
        const claimedChildCareExpenses = this.$store.state.enrolmentModule
          .claimedChildCareExpenses;
        items.push({
          label: `Claimed childcare expenses`,
          value: claimedChildCareExpenses
            ? moneyFormatter.format(claimedChildCareExpenses)
            : moneyFormatter.format("0"),
        });
      }
      items.push({
        label: `Claimed disability tax credit in ${selectedYear}`,
        value:
          this.$store.state.enrolmentModule.hasDisabilityCredit === "Y"
            ? "Yes"
            : "No",
      });
      if (
        this.$store.state.enrolmentModule.selectedDisabilityRecipients.length >
        0
      ) {
        const selectedDisabilityRecipients = this.$store.state.enrolmentModule
          .selectedDisabilityRecipients;
        const numDisabilityChildren = this.$store.state.enrolmentModule
          .numDisabilityChildren;
        items.push({
          label: `Who claimed`,
          value: this.getWhoClaimed(
            selectedDisabilityRecipients,
            numDisabilityChildren
          ),
        });
      }
      items.push({
        label: `Registered Disability Savings Plan?`,
        value: this.$store.state.enrolmentModule.hasRDSP === "Y" ? "Yes" : "No",
      });
      if (this.$store.state.enrolmentModule.hasRDSP === "Y") {
        items.push({
          label: `RDSP amount`,
          value: moneyFormatter.format(
            this.$store.state.enrolmentModule.sbRDSPAmount
          ),
        });
      }
      items.push({
        label: `Claimed attendant or nursing home expenses`,
        value:
          this.$store.state.enrolmentModule.hasAttendantNursingExpenses === "Y"
            ? "Yes"
            : "No",
      });
      if (
        this.$store.state.enrolmentModule.hasAttendantNursingExpenses === "Y"
      ) {
        const selectedAttendantNursingRecipients = this.$store.state
          .enrolmentModule.selectedAttendantNursingRecipients;
        const numAttendantNursingChildren = this.$store.state.enrolmentModule
          .numAttendantNursingChildren;
        items.push({
          label: `Who claimed`,
          value: this.getWhoClaimed(
            selectedAttendantNursingRecipients,
            numAttendantNursingChildren
          ),
        });
        const documentCount = this.$store.state.enrolmentModule
          .attendantNursingReceipts.length;
        items.push({
          label: "Documents",
          value: `${documentCount} ${this.getFilePlural(documentCount)}`,
        });
      }
      return items;
    },
    contactData() {
      const items = [];
      items.push({
        label: "Residential Address:",
        value: "",
      });
      items.push({
        label: "Street Address 1",
        value: this.$store.state.enrolmentModule.resAddressLine1,
      });
      items.push({
        label: "Street Address 2",
        value: this.$store.state.enrolmentModule.resAddressLine2,
      });
      items.push({
        label: "Street Address 3",
        value: this.$store.state.enrolmentModule.resAddressLine3,
      });
      items.push({
        label: "City",
        value: this.$store.state.enrolmentModule.resCity,
      });
      items.push({
        label: "Province",
        value: this.$store.state.enrolmentModule.resProvince,
      });
      items.push({
        label: "Postal Code",
        value: this.$store.state.enrolmentModule.resPostalCode,
      });
      items.push({
        label: "Jurisdiction",
        value: this.$store.state.enrolmentModule.resCountry,
      });
      if (!this.$store.state.enrolmentModule.isMailSame) {
        items.push({
          label: "Mailing Address:",
          value: "",
        });
        items.push({
          label: "Street Address 1",
          value: this.$store.state.enrolmentModule.mailAddressLine1,
        });
        items.push({
          label: "Street Address 2",
          value: this.$store.state.enrolmentModule.mailAddressLine2,
        });
        items.push({
          label: "Street Address 3",
          value: this.$store.state.enrolmentModule.mailAddressLine3,
        });
        items.push({
          label: "City",
          value: this.$store.state.enrolmentModule.mailCity,
        });
        items.push({
          label: "Province",
          value: this.$store.state.enrolmentModule.mailProvince,
        });
        items.push({
          label: "Postal Code",
          value: this.$store.state.enrolmentModule.mailPostalCode,
        });
        items.push({
          label: "Jurisdiction",
          value: this.$store.state.enrolmentModule.mailCountry,
        });
        items.push({
          label: "Phone",
          value: this.$store.state.enrolmentModule.phone,
        });
      }
      return items;
    },
    hasSpouse() {
      return (this.$store.state.enrolmentModule.hasSpouse === "Y")
    }
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
      scrollTo();
    },
    navigateToChildInfoPage() {
        const toPath = getConvertedPath(
          this.$router.currentRoute.path,
          enrolmentRoutes.CHILD_INFO_PAGE.path
        );
        pageStateService.setPageComplete(toPath);
        this.$router.push(toPath);
        scrollTo();
    },
    navigateToFPCInfoPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.FPCARE_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      this.$router.push(toPath);
      scrollTo();
    },
    navigateToSuppBenInfoPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.SUPP_BEN_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      this.$router.push(toPath);
      scrollTo();
    },
    navigateToContactInfoPage() {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.CONTACT_INFO_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      this.$router.push(toPath);
      scrollTo();
    },
    getChildTitle(index) {
      const children = this.$store.state.enrolmentModule.children;
      if (children && children.length > 1) {
        return `Child #${index + 1}`;
      }
      return 'Child';
    },
    getWhoClaimed(array, numberOfChildren) {
      //takes an array containing some combination of the values ah, spouse, and child
      //returns a new string of those same array entries but capitalized, fully spelled out, and comma separated
      let result = "";
      for (const [index, recipient] of array.entries()) {
        switch (recipient) {
          case "ah":
            result += `Account Holder`;
            break;
          case "spouse":
            result += `Spouse`;
            break;
          case "child":
            if (numberOfChildren === "1") {
              result += `${numberOfChildren} Child`;
            } else if (!numberOfChildren) {
              result += `0 children`;
            } else {
              result += `${numberOfChildren} Children`;
            }
            break;
          default:
            result += `${recipient}`;
        }
        if (index !== array.length - 1) {
          result += ", ";
        }
      }
      return result;
    },
    getFilePlural(count) {
      //takes an integer, returns single or plural form of word
      return (count === 1) ? 'file' : 'files';
    },
    getFormattedGender(genderInitial) {
      if (!genderInitial) {
        return "";
      }
      let result = "";
      switch (genderInitial) {
        case "F":
          result = "Female";
          break;
        case "M":
          result = "Male";
          break;
        default:
          result = "Another Gender (X)";
      }
      return result;
    },
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
