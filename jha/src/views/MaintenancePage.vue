<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-5">
        <h1>Maintenance mode</h1>
        <hr/>
        <p>This application is temporarily unavailable. We apologize for any inconvenience. Please try again later.</p>
      </div>
    </PageContent>
  </div>
</template>

<script>
import { PageContent } from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';

export default {
  name: 'MaintenancePage',
  mixins: [pageContentMixin],
  components: {
    PageContent,
  }
}
</script>
