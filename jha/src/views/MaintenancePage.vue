<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <main class="container pt-3 pt-sm-5 mb-5">
        <h1>Maintenance mode</h1>
        <hr/>
        <p>{{maintenanceMessage}}</p>
      </main>
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
  },
  data: () => {
    return {
      maintenanceMessage: 'This application is currently unavailable due to maintenance. Please try again later.'
    }
  },
  created() {
    this.maintenanceMessage = this.$store.state.appModule.maintenanceMessage;
  }
}
</script>
