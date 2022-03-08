<template>
  <div>
    <TipBox title="Tip">
      <p v-if="hasSampleImage">
        <a href="javascript:void(0)"
          :title="`${documentType} sample`"
          @click="openModal(false)">{{documentType}} samples</a>
      </p>
      <p v-if="includeGenderDocumentSamples">
        <a href="javascript:void(0)"
          :title="genderDocsTitle"
          @click="openModal(true)">{{genderDocsTitle}}</a>
      </p>
      <p>Scan the document, or take a photo of it.</p>
      <p>Make sure that it's:</p>
      <ul>
        <li>The entire document, from corner to corner</li>
        <li>Rotated correctly (not upside down or sideways)</li>
        <li>In focus and easy to read</li>
        <li>A JPG, PNG, GIF, BMP or PDF file</li>
      </ul>
    </TipBox>
    <portal v-if="isModalOpen"
      to="modal">
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
    </portal>
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
      type: String,
      default: null,
    },
    includeGenderDocumentSamples: {
      type: Boolean,
      default: false,
    }
  },
  data: () => {
    return {
      isModalOpen: false,
      showGenderDocs: false,
      genderDocsTitle: 'Change of Gender Designation and Request for Waiver of Parental Consent form samples',
      genderDocsSampleImageFileName: 'gender_forms.png'
    }
  },
  methods: {
    openModal(showGenderDocs) {
      this.showGenderDocs = showGenderDocs;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
  },
  computed: {
    hasSampleImage() {
      return !!SupportDocumentSamples[this.documentType];
    },
    sampleImageFileName() {
      if (this.showGenderDocs) {
        return this.genderDocsSampleImageFileName;
      } else {
        return SupportDocumentSamples[this.documentType];
      }
    },
    modalTitle() {
      if (this.showGenderDocs) {
        return this.genderDocsTitle;
      } else {
        return `${this.documentType} sample`;
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
