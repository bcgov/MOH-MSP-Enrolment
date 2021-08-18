<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-5">
        <h1>Available forms</h1>
        <p><a href="/jha/form-a">Form A</a></p>
      </div>
    </PageContent>
  </div>
</template>

<script>
import { getPageContentDeltaHeight } from '@/helpers/dom';
import { PageContent } from 'common-lib-vue';

export default {
  name: 'MaintenancePage',
  components: {
    PageContent,
  },
  data: () => {
    return {
      pageContentDeltaHeight: 0,
    };
  },
  created() {
    this.$nextTick(() => {
      this.pageContentDeltaHeight = getPageContentDeltaHeight();
    });
  }
};
</script>
