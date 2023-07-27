import mixin from "@/mixins/page-stepper-mixin";
import pageStateService from "@/services/page-state-service";

const spyOnSetPageIncomplete = jest
  .spyOn(pageStateService, "setPageIncomplete")
  .mockImplementation(() => Promise.resolve("logged"));

const spyOnSetPageComplete = jest
  .spyOn(pageStateService, "setPageComplete")
  .mockImplementation(() => Promise.resolve("logged"));

//chose not to test handleToggleShowMobileStepperDetails()
//this is due to the brevity of the function and the time investment it takes to mock a Vue store

//tried to write tests for handleClickStepperLink()
//these don't work yet since they need a working Vue router
//I may include them in a future Vue component/view test

describe.skip("handleClickStepperLink()", () => {
  it("calls setPageIncomplete", async () => {
    mixin.methods.handleClickStepperLink();
    expect(spyOnSetPageIncomplete.toHaveBeenCalled());
  });

  it("calls setPageComplete", async () => {
    mixin.methods.handleClickStepperLink();
    expect(spyOnSetPageComplete.toHaveBeenCalled());
  });
});
