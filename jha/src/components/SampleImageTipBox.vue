<template>
  <div>
    <TipBox title="Tip">
      <p v-if="sampleImageFileName">
        <a href="javascript:void(0)"
          :title="`${documentType} sample`"
          @click="openModal()">{{documentType}} samples</a>
      </p>
      <p>Scan the document, or take a photo of it.</p>
      <p>Make sure that it's:</p>
      <ul>
        <li>The entire document, from corner to corner</li>
        <li>Rotated correctly (not upside down or sideways</li>
        <li>In focus and easy to read</li>
        <li>A JPG, PNG, GIF, BMP or PDF file</li>
      </ul>
    </TipBox>
    <portal v-if="isModalOpen"
      to="modal">
      <ContentModal :title="`${documentType} sample`"
        size="lg"
        @close="closeModal()">
        <div class="sample-image-container text-center">
          <img :src="`/jha/images/samples/${sampleImageFileName}`" />
        </div>
      </ContentModal>
    </portal>
  </div>
</template>

<script>
import TipBox from './TipBox.vue';
import { ContentModal } from 'common-lib-vue';
import { SupportDocumentSamples } from '../constants/document-types';

export default {
  name: 'SampleImageTipBox',
  components: {
    ContentModal,
    TipBox,
  },
  props: {
    documentType: {
      type: String,
      default: null,
    }
  },
  data: () => {
    return {
      isModalOpen: false,
    }
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
  },
  computed: {
    sampleImageFileName() {
      if (SupportDocumentSamples[this.documentType]) {
        return SupportDocumentSamples[this.documentType];
      }
      return null;
    }
  }
}
</script>

<style scoped>
.sample-image-container img {
  max-width: 100%;
}
</style>
