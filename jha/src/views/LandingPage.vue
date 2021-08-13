<template>
  <div>
    <PageContent>
      <div class="container pt-3 pt-sm-5 mb-5">
        <h1>Available forms</h1>
        <p><a href="/jha/form-a">Form A</a></p>
      </div>
    </PageContent>
  </div>
</template>

<script>
import PageContent from '../components/PageContent.vue';

export default {
  name: 'MaintenancePage',
  components: {
    PageContent,
  }
}
</script>
