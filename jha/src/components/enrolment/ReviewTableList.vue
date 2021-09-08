<template>
  <div :class="className">

    <div class="row align-items-end mt-3">
      <div class="col-9">
        <h2 class="mb-2">Information</h2>
      </div>
      <div v-if='showEditButtons'
          class="col-3 text-right">
        <a href="javascript:void(0)"
           @click="navigateToMainEligibilityPage('patient')">Edit 
          <font-awesome-icon icon="pencil-alt" />
        </a>
      </div>
    </div>
    <ReviewTable :elements='sectionData'
                :backgroundColor='tableBackgroundColor'/>
  </div>
</template>

<script>
import ReviewTable from '@/components/ReviewTable.vue';
import { enrolmentRoutes } from '@/router/routes';
import {
  scrollToElement,
} from '@/helpers/scroll';
import pageStateService from '@/services/page-state-service';
import {
  getConvertedPath,
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
    sectionData() {
      const items = [];
      items.push({
        label: 'Application UUID:',
        value: this.$store.state.enrolmentModule.applicationUuid,
      });
      return items;
    },
  },
  methods: {
    navigateToMainEligibilityPage(anchorName) {
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.ELIGIBILITY_PAGE.path
      );
      pageStateService.setPageComplete(toPath);
      this.$router.push(toPath);
      this.$nextTick(() => {
        const anchorEl = document.querySelector(`a[name="${anchorName}"`);
        scrollToElement(anchorEl, false, 0);
      }, 0);
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
