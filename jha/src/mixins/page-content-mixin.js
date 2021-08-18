export default {
  data: () => {
    return {
      pageContentDeltaHeight: 0,
    };
  },
  created() {
    this.$nextTick(() => {
      this.pageContentDeltaHeight = this.getPageContentDeltaHeight();
    });
  },
  methods: {
    getPageContentDeltaHeight() {
      const headerEl = document.querySelector('header');
      const footerEl = document.querySelector('footer');
      const stepperEl = document.querySelector('.progress-bar-component');
      const continueBarEl = document.querySelector('.continue-bar');
      let delta = 0;
    
      if (headerEl) {
        delta += headerEl.offsetHeight;
      }
      if (footerEl) {
        delta += footerEl.offsetHeight;
      }
      if (stepperEl) {
        delta += stepperEl.offsetHeight;
      }
      if (continueBarEl) {
        delta += continueBarEl.offsetHeight;
      }
      return delta;
    }    
  }
};
