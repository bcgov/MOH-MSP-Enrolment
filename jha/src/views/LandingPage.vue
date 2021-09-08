<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-5">
        <h1>Available forms</h1>
        <p><a href="/jha/enrolment">Form A</a></p>
      </div>
    </PageContent>
  </div>
</template>

<script>
import { PageContent } from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';

export default {
  name: 'LandingPage',
  mixins: [pageContentMixin],
  components: {
    PageContent,
  },
};
</script>
