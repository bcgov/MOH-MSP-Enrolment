import { createStore } from "vuex";
import appModule from "./modules/app-module";
import enrolmentModule from "./modules/enrolment-module";

export default createStore({
  modules: {
    appModule,
    enrolmentModule,
  },
});
