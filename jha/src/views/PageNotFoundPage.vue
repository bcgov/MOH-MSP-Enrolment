<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-5">
        <h1>Sorry, the page you're looking for could not be found</h1>
        <hr/>
        <p>This file may have been moved or deleted. Be sure to check your spelling.</p>
        <p>We've recorded this error. If you like, you can <a href="javascript: history.back();">return to the previous page</a>.</p>
        <p>Error: 404 page not found</p>
      </div>
    </PageContent>
  </div>
</template>

<script>
import { getPageContentDeltaHeight } from '@/helpers/dom';
import { PageContent } from 'common-lib-vue';

export default {
  name: 'PageNotFoundPage',
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
