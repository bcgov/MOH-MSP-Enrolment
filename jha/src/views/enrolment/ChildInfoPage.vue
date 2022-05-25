<template>
  <div>
    <div class="container stepper">
      <PageStepper :currentPath='$router.currentRoute.value.path'
        :routes='stepRoutes'
        @toggleShowMobileDetails='handleToggleShowMobileStepperDetails($event)'
        :isMobileStepperOpen='isMobileStepperOpen'
        @onClickLink='handleClickStepperLink($event)'/>
    </div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Add child information and upload documents</h1>
        <p>Do you have a child who also needs to enrol for MSP coverage? If so, you are required to provide child information and provide supporting documents.</p>
        <hr class="mt-0"/>
        <Radio v-if="hasChildren !== 'Y'"
                label="Do you have a child who also needs to enrol for MSP coverage?"
                :id="'has-children'"
                :name="'has-children'"
                class="mt-3"
                v-model="hasChildren"
                @blur="handleBlurField(v$.hasChildren)"
                :items="radioOptionsNoYes" />
        <div class="text-danger"
          v-if="v$.hasChildren.$dirty && v$.hasChildren.required.$invalid"
          aria-live="assertive">Please indicate if you have a child who needs to enrol for MSP coverage.</div>
        <div v-for="(child, index) in children"
            :key="'child-' + index">
          <a :name="'child-' + index"></a>
          <div class="heading mt-3">
            <div v-if="!child.collapsed" @click="collapseChild(index)" class="icon-header">
              <font-awesome-icon icon="angle-down" size="3x" />
              <h2 class="m-0 ml-2">{{getChildTitle(index)}}</h2>
            </div>
            <div v-if="child.collapsed" @click="expandChild(index)" class="icon-header">
              <font-awesome-icon icon="angle-right" size="3x" />
              <h2 class="m-0 ml-2">{{getChildTitle(index)}}</h2>
            </div>
            <div class="remove-icon" @click="removeChild(index)">
                <font-awesome-icon icon="times-circle" size="2x"/>
            </div>
          </div>
          <hr/>
          <div :class="{'collapsed': child.collapsed}">
            <Child 
              :key="'child-' + index"
              ref="children"
              :index="index"
              :childData="child"
              :usedPHNs="usedPHNs"
              @updateChild="handleChildUpdate($event, index)" />
          </div>
        </div>
      </div>
    </PageContent>
    <ContinueBar 
      @continue="validateFields()" 
      @secondary="addChild()"
      :hasSecondaryButton="hasChildren === 'Y' && !maximumChildrenReached"
      :secondaryButtonLabel="'Add Child'"  
    />
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import pageStateService from '@/services/page-state-service';
import {
  enrolmentRoutes,
  isEQPath,
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
import logService from '@/services/log-service';
import {
  ContinueBar,
  PageContent,
  Radio,
  cloneDeep
} from 'common-lib-vue';
import {
  required
} from '@vuelidate/validators';
import pageContentMixin from '@/mixins/page-content-mixin';
import { 
  radioOptionsNoYes
} from '@/constants/radio-options';
import {
  MODULE_NAME as enrolmentModule,
  SET_HAS_CHILDREN,
  SET_NUM_CHILDREN,
  SET_CHILDREN,
} from '@/store/modules/enrolment-module';
import Child from '@/components/enrolment/Child.vue';
import pageStepperMixin from '@/mixins/page-stepper-mixin';

export default {
  name: 'ChildInfoPage',
  mixins: [
    pageContentMixin, 
    pageStepperMixin
  ],
  components: {
    ContinueBar,
    PageContent,
    Radio,
    Child,
  },
  data: () => {
    return {
      pageLoaded: false,
      // Radio and select options
      radioOptionsNoYes: radioOptionsNoYes,
      // Data to be saved
      hasChildren: null,
      children: [],
      usedPHNs: [],
    };
  },
  created() {
    this.hasChildren = this.$store.state.enrolmentModule.hasChildren;
    this.children = this.$store.state.enrolmentModule.children ? cloneDeep(this.$store.state.enrolmentModule.children) : [];
    this.calculateUsedPHNs();
    this.expandAllChildren();
    
    setTimeout(() => {
      this.pageLoaded = true;
    }, 0);

    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.CHILD_INFO_PAGE.path,
      enrolmentRoutes.CHILD_INFO_PAGE.title
    );
  },
  validations() {
    const validations = {
      hasChildren: { 
        required
      }
    };

    return validations;
  },
  setup () {
    return { v$: useVuelidate() }
  },
  methods: {
    addChild() {
      this.collapseAllChildren();
      this.children.push({
        collapsed: false,
        
        ageRange: null,
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        personalHealthNumber: null,
        gender: null,
        
        status: null,
        statusReason: null,
        citizenshipSupportDocumentType: null,
        citizenshipSupportDocuments: [],
        isNameChanged: null,
        nameChangeSupportDocumentType: null,
        genderMatches: null,
        nameChangeSupportDocuments: [],
        
        moveFromOrigin: null,
        livedInBCSinceBirth: null,
        previousHealthNumber: null,
        recentBCMoveDate: null,
        canadaArrivalDate: null,
        madePermanentMove: null,
        outsideBCLast12Months: null,
        outsideBCLast12MonthsReason: null,
        outsideBCLast12MonthsDestination: null,
        outsideBCLast12MonthsDepartureDate: null,
        outsideBCLast12MonthsReturnDate: null,
        hasPreviousBCHealthNumber: null,
        previousBCHealthNumber: null,
        hasBeenReleasedFromInstitution: null,
        dischargeDate: null,
        
        schoolName: null,
        schoolAddressLine1: null,
        schoolAddressLine2: null,
        schoolAddressLine3: null,
        schoolCity: null,
        schoolProvinceOrState: null,
        schoolCountry: null,
        schoolPostalCode: null,
        schoolDepartureDate: null,
        schoolCompletionDate: null,
        willResideInBCAfterStudies: null,
      });
    },
    removeChild(index) {
      this.children.splice(index, 1);
    },
    getChildTitle(index) {
      return 'Child #' + (index + 1) + ' basic information';
    },
    collapseChild(index) {
      this.children[index].collapsed = true;
      this.children = [...this.children];
    },
    collapseAllChildren() {
      const children = this.children;
      children.forEach(child => {
        child.collapsed = true;
      });
      this.children = [...children];
    },
    expandChild(index) {
      this.children[index].collapsed = false;
      this.children = [...this.children];
    },
    expandAllChildren() {
      const children = this.children;
      children.forEach(child => {
        child.collapsed = false;
      });
      this.children = [...children];
    },
    handleBlurField(validationObject) {
      if (validationObject) {
        validationObject.$touch();
      }
    },
    handleChildUpdate(data, index) {
      this.children[index] = data;
      this.children = [...this.children];
      this.calculateUsedPHNs();
    },
    validateFields() {
      this.saveData();

      if (this.hasChildren === 'N') {
        this.navigateToNextPage();
        return;
      }

      // touch parent forms inputs
      this.v$.$touch();
      // touch all children
      let validChildren = true;
      if (this.$refs && this.$refs.children) {
        for (let child of this.$refs.children) {
          if (child.v$) {
            child.v$.$touch();
            
            if (child.v$.$invalid) {
              validChildren = false;
            }
          }
        }
      }

      // if the parent form or any children have invalid inputs
      if (this.v$.$invalid || !validChildren) {
        if (!validChildren) {
          // only call this function if there are children, lest it unnecessarily triggers the watcher for this.children
          this.expandAllChildren();
        }
        scrollToError();
        return;
      }

      this.navigateToNextPage();
    },
    saveData() {
      this.$store.dispatch(enrolmentModule + '/' + SET_HAS_CHILDREN, this.hasChildren);
      this.$store.dispatch(enrolmentModule + '/' + SET_NUM_CHILDREN, this.children.length);
      this.$store.dispatch(enrolmentModule + '/' + SET_CHILDREN, this.children);
    },
    navigateToNextPage() {
      // Determine which page to navigate to next
      let routePath;
      if (this.$store.state.enrolmentModule.isApplyingForFPCare) {
        routePath = enrolmentRoutes.FPCARE_INFO_PAGE.path;
      } else if (this.$store.state.enrolmentModule.isApplyingForSuppBen) {
        routePath = enrolmentRoutes.SUPP_BEN_INFO_PAGE.path;
      } else {
        routePath = enrolmentRoutes.CONTACT_INFO_PAGE.path;
      }

      // Navigate to next path
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        routePath
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    calculateUsedPHNs() {
      const phns = [];
      if (this.$store.state.enrolmentModule.ahPHN) {
        phns.push(this.$store.state.enrolmentModule.ahPHN);
      }
      if (this.$store.state.enrolmentModule.spousePHN) {
        phns.push(this.$store.state.enrolmentModule.spousePHN);
      }
      this.children.forEach((child) => {
        if (child.personalHealthNumber) {
          phns.push(child.personalHealthNumber);
        }
      });
      this.usedPHNs = phns;
    }
  },
  watch: {
    children(arr) {
      if (this.pageLoaded) {
        if (arr.length > 0) {
          this.hasChildren = 'Y';
        } else {
          this.hasChildren = 'N';
        }
        this.saveData();
      }
    },
    hasChildren(val) {
      if (this.pageLoaded) {
        if (val === 'Y') {
          this.addChild();
        }
        this.saveData();
      }
    }
  },
  computed: {
    maximumChildrenReached() {
      return this.children.length > 27;
    },
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)
      && !isEQPath(to.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.value.path,
        enrolmentRoutes.CHILD_INFO_PAGE.path
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
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon-header {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.remove-icon {
  cursor: pointer;
}

.collapsed {
  display: none;
}
</style>
