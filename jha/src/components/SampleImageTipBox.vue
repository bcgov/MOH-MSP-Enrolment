<template>
  <div>
    <TipBox title="Tip">
      <p>Document samples:</p>
      <p v-if="hasSingleSample">
        <a href="javascript:void(0)"
          :title="`${documentType} sample`"
          @click="openModal()">{{documentType}}</a>
      </p>
      <div v-if="hasMultipleSamples">
        <p v-for="(sample, index) in documentType" :key="index">
          <a href="javascript:void(0)"
            :title="`${sample} samples`"
            @click="openModal(index)">{{sample}}</a>
        </p>
      </div>
      <p>Scan the document or take a photo of it.</p>
      <p>Make sure that it is:</p>
      <ul>
        <li>The entire document, from corner to corner&nbsp;</li>
        <li>Rotated correctly (not upside down or sideways)&nbsp;</li>
        <li>In focus and easy to read&nbsp;</li>
        <li>A JPG, PNG, GIF, BMP or PDF file&nbsp;</li>
      </ul>
    </TipBox>
    <Teleport v-if="isModalOpen"
      to="#modal-target">
      <ContentModal :title="modalTitle"
        size="lg"
        @close="closeModal()">
        <div class="sample-image-container text-center">
          <img :src="`/ahdc/images/samples/${sampleImageFileName}`" />
        </div>
        <div class="modal-footer">
          <Button 
            label='Close'
            @click='closeModal()'
            color='gold'
            class="full-width"
          />
        </div>
      </ContentModal>
    </Teleport>
  </div>
</template>

<script>
import TipBox from './TipBox.vue';
import { ContentModal, Button } from 'common-lib-vue';
import { SupportDocumentSamples } from '../constants/document-types';

export default {
  name: 'SampleImageTipBox',
  components: {
    ContentModal,
    TipBox,
    Button,
  },
  props: {
    documentType: {
      type: [String, Array],
      default: null,
    }
  },
  data: () => {
    return {
      isModalOpen: false,
      sampleIndex: 0,
    }
  },
  methods: {
    openModal(sampleIndex) {
      this.sampleIndex = sampleIndex;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
  },
  computed: {
    hasSingleSample() {
      return typeof this.documentType === 'string' && SupportDocumentSamples[this.documentType];
    },
    hasMultipleSamples() {
      return Array.isArray(this.documentType);
    },
    sampleImageFileName() {
      if (this.hasMultipleSamples) {
        return SupportDocumentSamples[this.documentType[this.sampleIndex]];
      } else {
        return SupportDocumentSamples[this.documentType];
      }
    },
    modalTitle() {
      if (this.hasMultipleSamples) {
        return `${this.documentType[this.sampleIndex]} samples`;
      } else {
        return `${this.documentType} samples`;
      }
    }
  }
}
</script>

<style scoped>
.sample-image-container img {
  max-width: 100%;
}

.full-width {
  width: 100%;
}
</style>
