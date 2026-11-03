<template>
  <div>
    <TipBox title="Note for Maintained status holders.">
      <p>
        If you are waiting for a subsequent work or study permit may be eligible for temporary
        coverage. To apply, select "Work Permit" or "Study Permit" and upload:
      </p>
      <ul>
        <li>
          Proof that you applied for your new permit on or before your current permit expired.
        </li>
        <li>
          If temporary coverage is requested more than four weeks after your current permit expired,
          you must provide documentation dated within four weeks of your request that shows your
          permit application remains active.
        </li>
        <li>
          Acceptable
          <strong>Immigration, Refugees and Citizenship Canada (IRCC)</strong> documentation
          include:
          <a
            href="javascript:void(0)"
            :title="`Example of Acceptable Documents to Prove Maintained Status in Canada`"
            @click="openModal()"
          >
            a payment receipt, a letter or email from IRCC, or a screenshot from your IRCC online
            account showing your application status and the current date.
          </a>
        </li>
      </ul>
    </TipBox>
    <Teleport
      v-if="isModalOpen"
      to="#modal-target"
    >
      <ContentModal
        size="lg"
        @close="closeModal()"
      >
        <div class="text-center">
          <img
            class="acceptable-docs"
            :src="`/ahdc/images/samples/acceptable-docs.png`"
          />
        </div>
        <div class="modal-footer">
          <ButtonComponent
            label="Close"
            color="gold"
            class="full-width"
            @click="closeModal()"
          />
        </div>
      </ContentModal>
    </Teleport>
  </div>
</template>

<script>
import TipBox from "./TipBox.vue";
import { ContentModal, ButtonComponent } from "common-lib-vue";

export default {
  name: "SampleDocTipBox",
  components: {
    ContentModal,
    TipBox,
    ButtonComponent,
  },
  data: () => {
    return {
      isModalOpen: false,
    };
  },
  methods: {
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
  },
};
</script>

<style scoped>
.full-width {
  width: 100%;
}
.acceptable-docs {
  width: 750px;
  height: 500px;
}
</style>
