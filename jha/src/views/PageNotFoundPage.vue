<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <main class="container pt-3 pt-sm-5 mb-5">
        <h1>Sorry, the page you're looking for could not be found</h1>
        <hr/>
        <p>This file may have been moved or deleted. Be sure to check your spelling.</p>
        <p>We've recorded this error. If you like, you can <a href="javascript: history.back();">return to the previous page</a>.</p>
        <p>Error: 404 page not found</p>
      </main>
    </PageContent>
  </div>
</template>

<script>
import { PageContent } from 'common-lib-vue';
import pageContentMixin from '@/mixins/page-content-mixin';

export default {
  name: 'PageNotFoundPage',
  mixins: [pageContentMixin],
  components: {
    PageContent,
  }
};
</script>
