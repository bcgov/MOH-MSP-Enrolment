<template>
  <div>
    <div class="container stepper">
      <PageStepper :currentPath='$router.currentRoute.path'
        :routes='stepRoutes'
        @toggleShowMobileDetails='handleToggleShowMobileStepperDetails($event)'
        :isMobileStepperOpen='isMobileStepperOpen'
        @onClickLink='handleClickStepperLink($event)'/>
    </div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <main class="container pt-3 pt-sm-5 mb-3">
        <h1>Spouse information</h1>
        <div class="heading mt-3">
          <div>
            <p>A spouse is a person married to or cohabiting in a marriage-like relationship with the applicant. A spouse may be the same gender as the applicant. To be eligible for MSP coverage, a spouse must be a B.C. resident. </p> 
            <p>Personal Health Number (PHN) is the number that appears on your spouse's BC Services Card.</p>
          </div>
          <div v-if="hasSpouse === 'Y'" class="ml-1 mb-2 remove-icon align-self-end " @click="removeSpouse()">
            <font-awesome-icon icon="times-circle" size="2x" title="Remove Spouse"/>
          </div>
        </div>
        <hr class="mt-0"/>
        <Radio
          v-if="hasSpouse !== 'Y'"
          id='has-spouse'
          name='has-spouse'
          label='Do you have a spouse or common-law partner?'
          v-model='hasSpouse'
          :required="true"
          @blur="handleBlurField($v.hasSpouse)"
          :items='radioOptionsNoYes' />
        <div class="text-danger"
          v-if="$v.hasSpouse.$dirty && !$v.hasSpouse.required"
          aria-live="assertive">Please indicate whether or not you have a spouse who needs to enrol.</div>
        
        <div v-if="hasSpouse === 'Y'" class="mt-3">
          <!-- Spouse personal information -->
          <!-- Bootstrap row and column classes for gender tipbox placement -->
          <div class="row">
            <div class="col-md-7">
              <Input label='First name'
                id='first-name'
                className='mt-3'
                :maxlength="firstNameMaxLength"
                v-model='spouseFirstName'
                :required="true"
                @blur="handleBlurField($v.spouseFirstName)"
                :inputStyle='mediumStyles' />
              <div class="text-danger"
                v-if="$v.spouseFirstName.$dirty && !$v.spouseFirstName.required"
                aria-live="assertive">First name is required.</div>
              <div class="text-danger"
                v-if="$v.spouseFirstName.$dirty && $v.spouseFirstName.required && !$v.spouseFirstName.nameValidator"
                aria-live="assertive">First name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
              <Input label='Middle name (optional)'
                id='middle-name'
                className='mt-3'
                :maxlength="middleNameMaxLength"
                v-model='spouseMiddleName'
                @blur="handleBlurField($v.spouseMiddleName)"
                :inputStyle='mediumStyles' />
              <div class="text-danger"
                v-if="$v.spouseMiddleName.$dirty && !$v.spouseMiddleName.nameValidator"
                aria-live="assertive">Middle name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
              <Input label='Last name'
                id='last-name'
                className='mt-3'
                maxlength="30"
                v-model='spouseLastName'
                :required="true"
                @blur="handleBlurField($v.spouseLastName)"
                :inputStyle='mediumStyles' />
              <div class="text-danger"
                v-if="$v.spouseLastName.$dirty && !$v.spouseLastName.required"
                aria-live="assertive">Last name is required.</div>
              <div class="text-danger"
                v-if="$v.spouseLastName.$dirty && $v.spouseLastName.required && !$v.spouseLastName.nameValidator"
                aria-live="assertive">Last name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
              <DateInput label='Birthdate'
                id='birth-date'
                className='mt-3'
                v-model='spouseBirthDate'
                :required="true"
                @blur="handleBlurField($v.spouseBirthDate)"
                @processDate="handleProcessBirthdate($event)" />
              <div class="text-danger"
                v-if="$v.spouseBirthDate.$dirty && !$v.spouseBirthDate.required"
                aria-live="assertive">Birthdate is required.</div>
              <div class="text-danger"
                v-if="$v.spouseBirthDate.$dirty
                  && !$v.spouseBirthDate.dateDataValidator"
                aria-live="assertive">Invalid birthdate.</div>
              <div class="text-danger"
                v-if="$v.spouseBirthDate.$dirty
                  && !$v.spouseBirthDate.distantPastValidator"
                aria-live="assertive">Invalid birthdate.</div>
              <div class="text-danger"
                v-if="$v.spouseBirthDate.$dirty
                      && $v.spouseBirthDate.required
                      && !$v.spouseBirthDate.birthDatePastValidator"
                aria-live="assertive">Birthdate cannot be in the future.</div>

              <div v-if="requestPersonalHealthNumber">
                <PhnInput label="Personal Health Number (PHN)"
                  id="personal-health-number"
                  class="mt-3"
                  placeholder="1111 111 111"
                  :inputStyle="smallStyles"
                  v-model="spousePersonalHealthNumber"
                  :required="true"
                  @blur="handleBlurField($v.spousePersonalHealthNumber)" />
                <span class="field-description">This number appears on the BC Services Card</span>
                <div class="text-danger"
                  v-if="$v.spousePersonalHealthNumber.$dirty
                    && !$v.spousePersonalHealthNumber.required"
                  aria-live="assertive">Personal Health Number is required.</div>
                <div class="text-danger"
                  v-if="$v.spousePersonalHealthNumber.$dirty
                    && (!$v.spousePersonalHealthNumber.phnValidator || !$v.spousePersonalHealthNumber.phnFirstDigitValidator)"
                  aria-live="assertive">Personal Health Number is not valid.</div>
                <div class="text-danger"
                  v-if="$v.spousePersonalHealthNumber.$dirty && !$v.spousePersonalHealthNumber.uniquePHNValidator"
                  aria-live="assertive">This Personal Health Number (PHN) was already used for another family member. Please provide the PHN that is listed on the family member's PHN card/letter.</div>
              </div>
              <div v-if="requestSocialInsuranceNumber">
                <SINInput label="Social Insurance Number (SIN)"
                  id="social-insurance-number"
                  class="mt-3"
                  placeholder="111 111 111"
                  :inputStyle="smallStyles"
                  v-model="spouseSocialInsuranceNumber"
                  :required="true"
                  @blur="handleBlurField($v.spouseSocialInsuranceNumber)" />
                <span class="field-description">Your spouse’s SIN will be used to verify your income for Fair Pharmacare and Supplementary Benefits (as applicable)</span>
                <div class="text-danger"
                  v-if="$v.spouseSocialInsuranceNumber.$dirty
                    && !$v.spouseSocialInsuranceNumber.required"
                  aria-live="assertive">Social Insurance Number is required.</div>
                <div class="text-danger"
                  v-if="$v.spouseSocialInsuranceNumber.$dirty
                    && !$v.spouseSocialInsuranceNumber.sinValidator"
                  aria-live="assertive">Social Insurance Number is invalid.</div>
                <div class="text-danger"
                  v-if="$v.spouseSocialInsuranceNumber.$dirty
                    && !$v.spouseSocialInsuranceNumber.uniqueSINValidator"
                  aria-live="assertive">This Social Insurance Number (SIN) was already used for another family member. Please provide the SIN that is listed on the family member's SIN card/letter.</div>
              </div>

              <div v-if="requestGender">
                <Radio
                  label='Gender'
                  id='spouse-gender'
                  name='spouse-gender'
                  v-model='spouseGender'
                  :required="true"
                  className="mt-3"
                  @blur="handleBlurField($v.spouseGender)"
                  :items='radioGenderOptions' />
                <div class="text-danger"
                  v-if="$v.spouseGender.$dirty && !$v.spouseGender.required"
                  aria-live="assertive">Please indicate your spouse's gender.</div>
              </div>
            </div>
            <div class="col-md-5 d-flex align-items-end">
              <TipBox v-if="requestGender">
                <p>Tip</p>
                <p>
                  If the gender you select does not match the gender on your spouse's supporting document(s), they must submit an application for change of gender designation. For more information see <a href="https://www2.gov.bc.ca/gov/content/governments/government-id/bc-services-card/your-card/change-personal-information" target="_blank"> Change Your Personal Information</a>.
                </p>
              </TipBox>
            </div>
          </div>
          
          <!-- Spouse citizenship information  -->
          <div v-if="requestImmigrationStatus">
            <h2 class="mt-4">Spouse's status in Canada</h2>
            <div class="heading mt-3">
              <p>Provide your spouse's immigration status. You will be need to upload documents that show your spouse's status in Canada. For arrivals through the Canada-Ukraine Authorization for Emergency Travel program (CUAET) please select "Temporary Permit Holder or Diplomat" from the menu below.</p>
            </div>
            <hr class="mt-0"/>
            <Select 
              id='spouse-status'
              name='spouse-status'
              defaultOptionLabel="Please select"
              :disablePlaceholder="true"
              label="Immigration status in Canada"
              class='mt-3'
              v-model='spouseStatus'
              :required="true"
              :options='citizenshipStatusOptions'
              @blur="handleBlurField($v.spouseStatus)"
              :inputStyle='mediumStyles' />
            <div class="text-danger"
              v-if="$v.spouseStatus.$dirty && !$v.spouseStatus.required"
              aria-live="assertive">Please select your spouse's immigration status.</div>
            <div v-if="spouseStatus === statusOptions.Citizen || spouseStatus === statusOptions.PermanentResident">
              <Radio
                id='spouse-status-reason'
                name='spouse-status-reason'
                label=''
                v-model='spouseStatusReason'
                :required="true"
                @blur="handleBlurField($v.spouseStatusReason)"
                :items='citizenshipStatusReasonOptions' />
              <div class="text-danger"
                v-if="$v.spouseStatusReason.$dirty && !$v.spouseStatusReason.required"
                aria-live="assertive">This field is required.</div>
            </div>
            <div v-if="spouseStatus === statusOptions.TemporaryResident">
              <Radio
                id='spouse-status-reason'
                name='spouse-status-reason'
                label=''
                v-model='spouseStatusReason'
                :required="true"
                @blur="handleBlurField($v.spouseStatusReason)"
                :items='temporaryResidentStatusReasonOptions' />
              <div class="text-danger"
                v-if="$v.spouseStatusReason.$dirty && !$v.spouseStatusReason.required"
                aria-live="assertive">This field is required.</div>
            </div>
            <div v-if="spouseStatusReason !== null && spouseStatusReason !== undefined" class="mt-3">
              <h2>Documents</h2>
              <p>Provide a copy of an accepted document that shows your spouse’s status in Canada. If their name is different from the name on the document, you must also upload a copy of a marriage certificate or name change certificate that shows their full legal name.</p>
              <hr/>
              <Select 
                label="Document Type"
                name="citizen-support-document-type"
                id="citizen-support-document-type"
                defaultOptionLabel="Please select"
                :disablePlaceholder="true"
                class="mb-3"
                v-model="spouseCitizenshipSupportDocumentType"
                :required="true"
                :options="citizenshipSupportDocumentOptions"
                @blur="handleBlurField($v.spouseCitizenshipSupportDocumentType)"
                :inputStyle='mediumStyles' />
              <div class="text-danger"
                v-if="$v.spouseCitizenshipSupportDocumentType.$dirty && !$v.spouseCitizenshipSupportDocumentType.required"
                aria-live="assertive">Document Type is required.</div>
              <Radio
                label="Does the document that shows your spouse's status in Canada match their selected gender designation?" 
                name="spouse-gender-matches"
                id="spouse-gender-matches"
                class="mt-3"
                v-model="spouseGenderMatches"
                :required="true"
                :items="radioOptionsNoYes"
                @blur="handleBlurField($v.spouseGenderMatches)" />
              <div class="text-danger"
                v-if="$v.spouseGenderMatches.$dirty
                  && !$v.spouseGenderMatches.required"
                aria-live="assertive">This field is required.</div>
              <div v-if="spouseCitizenshipSupportDocumentType && spouseGenderMatches">
                <h2>{{ supportDocumentTypeToTitle(spouseCitizenshipSupportDocumentType) }} {{ spouseGenderMatches === 'N' ? 'and Change of Gender Designation' : '' }}</h2>
                <hr/>
                <div class="row">
                    <div class="col-md-7">
                      <FileUploader v-model="spouseCitizenshipSupportDocuments"
                        id='spouse-citizenship-support-documents'
                        :isZoomPortalEnabled="true"
                        modalElementTarget="#modal-target"
                        documentType="Spouse citizenship support documents"
                        :description="spouseCitizenshipSupportDocumentType" />
                      <div class="text-danger"
                        v-if="$v.spouseCitizenshipSupportDocuments.$dirty && !$v.spouseCitizenshipSupportDocuments.required"
                        aria-live="assertive">You must include documentation for your application.</div>
                    </div>
                    <div class="col-md-5">
                      <SampleImageTipBox :documentType="citizenshipSamples"/>
                    </div>
                  </div>
              </div>

              <div v-if="spouseCitizenshipSupportDocumentType && spouseGenderMatches">
                <Radio label="Is your spouse's name different from the name on their document?"
                  id="name-change"
                  name="name-change"
                  class="mt-3 mb-3"
                  v-model="spouseIsNameChanged"
                  :required="true"
                  @blur="handleBlurField($v.spouseIsNameChanged)"
                  :items="radioOptionsNoYes" />
                <div class="text-danger"
                  v-if="$v.spouseIsNameChanged.$dirty && !$v.spouseIsNameChanged.required"
                  aria-live="assertive">Please indicate if your spouse's name changed.</div>
              </div>
              <div v-if="spouseIsNameChanged === 'Y'"
                class="tabbed-section">
                <h2>Additional Documents</h2>
                <p>Provide a copy of a marriage certificate or name change certificate that shows your spouse's full legal name.</p>
                <hr/>
                <Select 
                  label="Document Type"
                  name="name-change-doc-type"
                  id="name-change-doc-type"
                  defaultOptionLabel="Please select"
                  :disablePlaceholder="true"
                  class="mb-3"
                  v-model="spouseNameChangeSupportDocumentType"
                  :required="true"
                  :options="nameChangeSupportDocumentOptions"
                  @blur="handleBlurField($v.spouseNameChangeSupportDocumentType)"
                  :inputStyle='mediumStyles' />
                <div class="text-danger"
                  v-if="$v.spouseNameChangeSupportDocumentType.$dirty && !$v.spouseNameChangeSupportDocumentType.required"
                  aria-live="assertive">Document Type is required.</div>
                <div v-if="spouseNameChangeSupportDocumentType">
                  <h2>{{spouseNameChangeSupportDocumentType}}</h2>
                  <hr/>
                  <div class="row">
                    <div class="col-md-7">
                      <FileUploader class="mb-3"
                          id='spouse-name-change-support-documents'
                          v-model="spouseNameChangeSupportDocuments"
                          :isZoomPortalEnabled="true"
                          modalElementTarget="#modal-target"
                          documentType="Spouse name change support documents"
                          :description="spouseNameChangeSupportDocumentType" />
                      <div class="text-danger"
                        v-if="$v.spouseNameChangeSupportDocuments.$dirty && !$v.spouseNameChangeSupportDocuments.required"
                        aria-live="assertive">You must include documentation for your application.</div>
                    </div>
                    <div class="col-md-5">
                      <SampleImageTipBox :documentType="spouseNameChangeSupportDocumentType"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="requestMovingInfo" class="mt-3">
            <!-- Spouse moving information -->
            <h2 class="mt-3">Residency Information</h2>
            <hr>
            <div class="row">
              <div class="col-md-7">
                <div v-if="showLivedInBCSinceBirth">
                  <Radio 
                    label='Has your spouse lived in B.C. since birth?'
                    id='lived-in-bc'
                    name='lived-in-bc'
                    v-model='spouseLivedInBCSinceBirth'
                    :required="true"
                    className="mt-3"
                    @blur="handleBlurField($v.spouseLivedInBCSinceBirth)"
                    :items='radioOptionsNoYes' />
                  <div class="text-danger"
                    v-if="$v.spouseLivedInBCSinceBirth.$dirty && !$v.spouseLivedInBCSinceBirth.required"
                    aria-live="assertive">Please indicate whether your spouse has lived in BC since birth.</div>
                </div>
                <div v-if="showOriginTextField">
                  <Input 
                      className="mt-3"
                      label="From which province or jurisdiction?"
                      maxlength="25"
                      v-model="spouseMoveFromOrigin"
                      :required="true"
                      @blur="handleBlurField($v.spouseMoveFromOrigin)"
                      :inputStyle='mediumStyles' />
                  <div class="text-danger"
                      v-if="$v.spouseMoveFromOrigin.$dirty
                        && !$v.spouseMoveFromOrigin.required"
                      aria-live="assertive">Province or jurisdiction of origin is required.</div>
                </div>
                <div v-if="showMovedPermanentlyQuestion">
                  <Radio
                    label='Has your spouse moved to B.C. permanently?'
                    id='permanent-move'
                    name='permanent-move'
                    v-model='spouseMadePermanentMove'
                    :required="true"
                    className="mt-3"
                    @blur="handleBlurField($v.spouseMadePermanentMove)"
                    :items='radioOptionsNoYes'/>
                  <div class="text-danger"
                    v-if="$v.spouseMadePermanentMove.$dirty && !$v.spouseMadePermanentMove.required"
                    aria-live="assertive">Please indicate whether your spouse has made a permanent move to BC.</div>
                  <div class="text-danger"
                    v-if="spouseMadePermanentMove === 'N' && spouseStatus !== statusOptions.TemporaryResident"
                    aria-live="assertive">You have indicated that a recent move to B.C. is not permanent. As a result, your spouse is not eligible for enrolment in the Medical Services Plan. Please contact <a target="_blank" href="http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us">Health Insurance BC</a> for further information.</div>
                </div>
                <div v-if="spouseMadePermanentMove !== 'N' || spouseStatus === statusOptions.TemporaryResident">
                  <div v-if="showProvinceSelector">
                    <RegionSelect
                      id='spouse-province-of-origin'
                      className="mt-3"
                      label="Which province is your spouse moving from?" 
                      v-model="spouseMoveFromOrigin"
                      :required="true"
                      :disablePlaceholder="true"
                      defaultOptionLabel="Please select a province"
                      @blur="handleBlurField($v.spouseMoveFromOrigin)"
                      :inputStyle='mediumStyles' />
                    <div class="text-danger"
                      v-if="$v.spouseMoveFromOrigin.$dirty
                        && !$v.spouseMoveFromOrigin.required"
                      aria-live="assertive">Province of origin is required.</div>
                    <div class="text-danger"
                      v-if="$v.spouseMoveFromOrigin.$dirty
                        && !$v.spouseMoveFromOrigin.nonBCValidator"
                      aria-live="assertive">Province of origin cannot be British Columbia.</div>
                  </div>
                  <div v-if="showCountrySelector">
                    <CountrySelect 
                      id='spouse-country-of-origin'
                      className="mt-3"
                      label="Which jurisdiction is your spouse moving from?" 
                      v-model="spouseMoveFromOrigin"
                      :required="true"
                      :disablePlaceholder="true"
                      defaultOptionLabel="Please select a jurisdiction"
                      @blur="handleBlurField($v.spouseMoveFromOrigin)"
                      :inputStyle='mediumStyles' />
                    <div class="text-danger"
                      v-if="$v.spouseMoveFromOrigin.$dirty && !$v.spouseMoveFromOrigin.required"
                      aria-live="assertive">Jurisdiction of origin is required.</div>
                    <div class="text-danger"
                      v-if="$v.spouseMoveFromOrigin.$dirty
                        && !$v.spouseMoveFromOrigin.nonCanadaValidator"
                      aria-live="assertive">Jurisdiction of origin cannot be Canada.</div>
                  </div>
                  <div v-if="showMoveDateInputs">
                    <DateInput 
                      :label='bcMoveDateLabel'
                      id='move-date'
                      className='mt-3'
                      v-model='spouseRecentBCMoveDate'
                      :required="true"
                      @blur="handleBlurField($v.spouseRecentBCMoveDate)"
                      @processDate="handleProcessDateBCMove($event)" />
                    <div v-if="bcMoveDateLabel === 'Most recent move to B.C.'">
                      <div class="text-danger"
                        v-if="$v.spouseRecentBCMoveDate.$dirty && !$v.spouseRecentBCMoveDate.required"
                        aria-live="assertive">Most recent move to B.C. is required.</div>
                      <div class="text-danger"
                        v-if="$v.spouseRecentBCMoveDate.$dirty
                              && $v.spouseRecentBCMoveDate.required
                              && !$v.spouseRecentBCMoveDate.dateDataValidator"
                        aria-live="assertive">Invalid most recent move to B.C. date.</div>
                      <div class="text-danger"
                        v-if="$v.spouseRecentBCMoveDate.$dirty
                              && $v.spouseRecentBCMoveDate.required
                              && $v.spouseRecentBCMoveDate.dateDataValidator
                              && !$v.spouseRecentBCMoveDate.pastDateValidator"
                        aria-live="assertive">Most recent move to B.C. date cannot be in the future.</div>
                      <div class="text-danger"
                        v-if="$v.spouseRecentBCMoveDate.$dirty
                              && $v.spouseRecentBCMoveDate.required
                              && $v.spouseRecentBCMoveDate.dateDataValidator
                              && $v.spouseRecentBCMoveDate.pastDateValidator
                              && !$v.spouseRecentBCMoveDate.beforeBirthdateValidator"
                        aria-live="assertive">The spouse's most recent move to B.C. cannot be before the spouse's date of birth.</div>
                      <div class="text-danger"
                        v-if="$v.spouseRecentBCMoveDate.$dirty
                              && $v.spouseRecentBCMoveDate.required
                              && $v.spouseRecentBCMoveDate.dateDataValidator
                              && $v.spouseRecentBCMoveDate.pastDateValidator
                              && $v.spouseRecentBCMoveDate.beforeBirthdateValidator
                              && !$v.spouseRecentBCMoveDate.dateOrderValidator"
                        aria-live="assertive">The spouse's most recent move to B.C. cannot be before the move to Canada date.</div>
                    </div>
                    <div v-else>
                      <div class="text-danger"
                        v-if="$v.spouseRecentBCMoveDate.$dirty && !$v.spouseRecentBCMoveDate.required"
                        aria-live="assertive">Arrival date in B.C. is required.</div>
                      <div class="text-danger"
                        v-if="$v.spouseRecentBCMoveDate.$dirty
                              && $v.spouseRecentBCMoveDate.required
                              && !$v.spouseRecentBCMoveDate.dateDataValidator"
                        aria-live="assertive">Invalid arrival date in B.C.</div>
                      <div class="text-danger"
                        v-if="$v.spouseRecentBCMoveDate.$dirty
                              && $v.spouseRecentBCMoveDate.required
                              && $v.spouseRecentBCMoveDate.dateDataValidator
                              && !$v.spouseRecentBCMoveDate.pastDateValidator"
                        aria-live="assertive">Arrival date in B.C. cannot be in the future.</div>
                      <div class="text-danger"
                        v-if="$v.spouseRecentBCMoveDate.$dirty
                              && $v.spouseRecentBCMoveDate.required
                              && $v.spouseRecentBCMoveDate.dateDataValidator
                              && $v.spouseRecentBCMoveDate.pastDateValidator
                              && !$v.spouseRecentBCMoveDate.beforeBirthdateValidator"
                        aria-live="assertive">The spouse's arrival date in B.C. cannot be before the spouse's date of birth.</div>
                      <div class="text-danger"
                        v-if="$v.spouseRecentBCMoveDate.$dirty
                              && $v.spouseRecentBCMoveDate.required
                              && $v.spouseRecentBCMoveDate.dateDataValidator
                              && $v.spouseRecentBCMoveDate.pastDateValidator
                              && $v.spouseRecentBCMoveDate.beforeBirthdateValidator
                              && !$v.spouseRecentBCMoveDate.dateOrderValidator"
                        aria-live="assertive">The spouse's arrival date in B.C. cannot be before the move to Canada date.</div>
                    </div>
                    <DateInput :label='canadaArrivalDateLabel'
                      id='canada-arrival-date'
                      className='mt-3'
                      v-model='spouseCanadaArrivalDate'
                      :required="canadaArrivalDateLabel === 'Arrival date in Canada'"
                      @blur="handleBlurField($v.spouseCanadaArrivalDate)"
                      @processDate="handleProcessDateCanadaArrival($event)" />
                    <div class="text-danger"
                      v-if="canadaArrivalDateLabel === 'Arrival date in Canada'
                        && $v.spouseCanadaArrivalDate.$dirty
                        && !$v.spouseCanadaArrivalDate.required"
                      aria-live="assertive">Arrival date in Canada is required.</div>
                    <div class="text-danger"
                      v-if="$v.spouseCanadaArrivalDate.$dirty && !$v.spouseCanadaArrivalDate.dateDataValidator"
                      aria-live="assertive">Invalid arrival date in Canada.</div>
                    <div class="text-danger"
                      v-if="$v.spouseCanadaArrivalDate.$dirty
                            && $v.spouseCanadaArrivalDate.dateDataValidator
                            && !$v.spouseCanadaArrivalDate.pastDateValidator"
                      aria-live="assertive">Arrival date in Canada cannot be in the future.</div>
                    <div class="text-danger"
                      v-if="$v.spouseCanadaArrivalDate.$dirty 
                            && $v.spouseCanadaArrivalDate.dateDataValidator
                            && $v.spouseCanadaArrivalDate.pastDateValidator
                            && !$v.spouseCanadaArrivalDate.beforeBirthdateValidator"
                      aria-live="assertive">The spouse's arrival date in Canada cannot be before the spouse's date of birth.</div>
                    <div class="text-danger"
                      v-if="$v.spouseCanadaArrivalDate.$dirty 
                            && $v.spouseCanadaArrivalDate.dateDataValidator
                            && $v.spouseCanadaArrivalDate.pastDateValidator
                            && $v.spouseCanadaArrivalDate.beforeBirthdateValidator
                            && !$v.spouseCanadaArrivalDate.dateOrderValidator"
                      aria-live="assertive">The spouse's arrival date in Canada cannot be after the move to B.C. date.</div>
                  </div>
                  <div v-if="showPreviousHealthNumber">
                    <Input 
                      className="mt-3"
                      label="Health Number from that province (optional)"
                      maxlength="50"
                      v-model="spousePreviousHealthNumber"
                      :inputStyle='mediumStyles' />
                  </div>
                  <Radio
                    label='Since your spouse arrived in B.C. have they left the province for more than 30 days in total in the past 12 months?'
                    id='outside-bc-past-12'
                    name='outside-bc-past-12'
                    v-model='spouseOutsideBCLast12Months'
                    :required="true"
                    className="mt-3"
                    @blur="handleBlurField($v.spouseOutsideBCLast12Months)"
                    :items='radioOptionsNoYes'>
                    <template v-slot:description>
                      <span class="field-description">If your spouse has been living in B.C. for less than 12 months, please indicate any absences since arrival.</span>
                    </template>
                  </Radio>
                  <div class="text-danger"
                    v-if="$v.spouseOutsideBCLast12Months.$dirty && !$v.spouseOutsideBCLast12Months.required"
                    aria-live="assertive">Please indicate whether your spouse has been outside BC in the past 12 months.</div>
                  <div v-if="spouseOutsideBCLast12Months === 'Y'" class="tabbed-section">
                    <Input 
                      id="departure-reason"
                      className="mt-3"
                      label="Reason for departure"
                      maxlength="20"
                      v-model="spouseOutsideBCLast12MonthsReason"
                      :required="true"
                      @blur="handleBlurField($v.spouseOutsideBCLast12MonthsReason)"
                      :inputStyle='mediumStyles' />
                    <div class="text-danger"
                      v-if="$v.spouseOutsideBCLast12MonthsReason.$dirty && !$v.spouseOutsideBCLast12MonthsReason.required"
                      aria-live="assertive">Reason for departure is required.</div>
                    <div class="text-danger" v-if="$v.spouseOutsideBCLast12MonthsReason.$dirty && !$v.spouseOutsideBCLast12MonthsReason.reasonDestinationContentValidator" aria-live="assertive">Reason must contain letters and may include numbers and special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
                    <Input 
                      id="departure-location"
                      className="mt-3"
                      label="Location"
                      maxlength="20" 
                      v-model="spouseOutsideBCLast12MonthsDestination"
                      :required="true"
                      @blur="handleBlurField($v.spouseOutsideBCLast12MonthsDestination)"
                      :inputStyle='mediumStyles' />
                    <div class="text-danger"
                      v-if="$v.spouseOutsideBCLast12MonthsDestination.$dirty && !$v.spouseOutsideBCLast12MonthsDestination.required"
                      aria-live="assertive">Location is required.</div>
                    <div class="text-danger" v-if="$v.spouseOutsideBCLast12MonthsDestination.$dirty && !$v.spouseOutsideBCLast12MonthsDestination.reasonDestinationContentValidator" aria-live="assertive">Location must contain letters and may include numbers and special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
                    <DateInput label='Departure date'
                      id='departure-date'
                      className='mt-3'
                      @blur="handleBlurField($v.spouseOutsideBCLast12MonthsDepartureDate)"
                      @processDate="handleProcessDate12MonthsDeparture($event)"
                      v-model='spouseOutsideBCLast12MonthsDepartureDate'
                      :required="true" />
                    <div class="text-danger"
                      v-if="$v.spouseOutsideBCLast12MonthsDepartureDate.$dirty && !$v.spouseOutsideBCLast12MonthsDepartureDate.required"
                      aria-live="assertive">Departure date is required.</div>
                    <div class="text-danger"
                      v-if="$v.spouseOutsideBCLast12MonthsDepartureDate.$dirty
                        && !$v.spouseOutsideBCLast12MonthsDepartureDate.dateDataValidator"
                      aria-live="assertive">Invalid departure date.</div>
                    <div class="text-danger"
                      v-if="$v.spouseOutsideBCLast12MonthsDepartureDate.$dirty
                        && !$v.spouseOutsideBCLast12MonthsDepartureDate.departureDateValidator"
                      aria-live="assertive">Departure date must be within the last 12 months and prior to return date.</div>
                    <DateInput label='Return date'
                      id='return-date'
                      className='mt-3'
                      @blur="handleBlurField($v.spouseOutsideBCLast12MonthsReturnDate)"
                      @processDate="handleProcessDate12MonthsReturn($event)"
                      v-model='spouseOutsideBCLast12MonthsReturnDate'
                      :required="true" />
                    <div class="text-danger"
                      v-if="$v.spouseOutsideBCLast12MonthsReturnDate.$dirty && !$v.spouseOutsideBCLast12MonthsReturnDate.required"
                      aria-live="assertive">Return date is required.</div>
                    <div class="text-danger"
                      v-if="$v.spouseOutsideBCLast12MonthsReturnDate.$dirty
                        && !$v.spouseOutsideBCLast12MonthsReturnDate.dateDataValidator"
                      aria-live="assertive">Invalid return date.</div>
                    <div class="text-danger"
                      v-if="$v.spouseOutsideBCLast12MonthsReturnDate.$dirty
                        && !$v.spouseOutsideBCLast12MonthsReturnDate.returnDateValidator"
                      aria-live="assertive">Return date must be within the last 12 months and after departure date.</div>
                  </div>
                  <Radio
                    label='Does your spouse have a previous B.C. Personal Health Number?'
                    id='has-previous-bc-health-number'
                    name='has-previous-bc-health-number'
                    v-model='spouseHasPreviousBCHealthNumber'
                    :required="true"
                    className="mt-3"
                    @blur="handleBlurField($v.spouseHasPreviousBCHealthNumber)"
                    :items='radioOptionsNoYes'/>
                  <div class="text-danger"
                    v-if="$v.spouseHasPreviousBCHealthNumber.$dirty && !$v.spouseHasPreviousBCHealthNumber.required"
                    aria-live="assertive">Please indicate whether your spouse has a previous BC Personal Health Number.</div>
                  <div v-if="spouseHasPreviousBCHealthNumber === 'Y'" class="tabbed-section">
                    <PhnInput 
                      id="previous-bc-phn"
                      className="mt-3"
                      label="Your spouse's previous B.C. Personal Health Number (optional)" 
                      v-model="spousePreviousBCHealthNumber"
                      placeholder="1111 111 111"
                      @blur="handleBlurField($v.spousePreviousBCHealthNumber)"
                      :inputStyle='mediumStyles' />
                    <span class="field-description">This number appears on the BC Services Card</span>
                    <div class="text-danger"
                      v-if="$v.spousePreviousBCHealthNumber.$dirty && !$v.spousePreviousBCHealthNumber.phnValidator"
                      aria-live="assertive">Personal Health Number is not valid.</div>
                  </div>
                  <div v-if="showDischargeInputs">
                    <Radio
                      label='Has your spouse been released from the Canadian Armed Forces or an institution?'
                      id='been-released-from-institution'
                      name='been-released-from-institution'
                      v-model='spouseBeenReleasedFromInstitution'
                      :required="true"
                      className="mt-3"
                      @blur="handleBlurField($v.spouseBeenReleasedFromInstitution)"
                      :items='radioOptionsNoYes' />
                    <div class="text-danger"
                      v-if="$v.spouseBeenReleasedFromInstitution.$dirty && !$v.spouseBeenReleasedFromInstitution.required"
                      aria-live="assertive">Please indicate whether your spouse has been released from an institution.</div>
                  </div>
                  <div v-if="showDischargeInputs && spouseBeenReleasedFromInstitution === 'Y'" class="tabbed-section">
                    <DateInput label='Discharge date'
                      id='discharge-date'
                      className='mt-3'
                      @blur="handleBlurField($v.spouseDischargeDate)"
                      @processDate="handleProcessDateDischarge($event)"
                      v-model='spouseDischargeDate'
                      :required="true" />
                    <div class="text-danger"
                      v-if="$v.spouseDischargeDate.$dirty && !$v.spouseDischargeDate.required"
                      aria-live="assertive">Discharge date is required.</div>
                    <div class="text-danger"
                      v-if="$v.spouseDischargeDate.$dirty
                        && !$v.spouseDischargeDate.dateDataValidator"
                      aria-live="assertive">Invalid discharge date.</div>
                    <div class="text-danger"
                      v-if="$v.spouseDischargeDate.$dirty
                        && !$v.spouseDischargeDate.dischargeDateValidator"
                      aria-live="assertive">Discharge date cannot be before the spouse's date of birth.</div>
                    <div class="text-danger"
                      v-if="$v.spouseDischargeDate.$dirty
                        && !$v.spouseDischargeDate.pastDateValidator"
                      aria-live="assertive">Discharge date cannot be in the future.</div>
                  </div>
                </div>
              </div>
              <div class="col-md-5 mt-3">
                <TipBox>
                  <p>A permanent move means that you intend to make B.C. your primary residence for 6 months or longer. If you leave B.C. within 6 months of enrolling for MSP, you may have to repay your medical expenses.</p>
                </TipBox>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageContent>
    <ContinueBar @continue="validateFields()" />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import {
  enrolmentRoutes,
  isEQPath,
  isPastPath,
} from '@/router/routes';
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition
} from '@/helpers/scroll';
import {
  getConvertedPath,
} from '@/helpers/url';
import {
  dateDataRequiredValidator,
  dateDataValidator,
  nameValidator,
  nonBCValidator,
  nonCanadaValidator,
  reasonDestinationContentValidator,
  pastDateValidator,
  phnFirstDigitValidator
} from '@/helpers/validators';
import { supportDocumentTypeToTitle } from '@/helpers/form-helpers'
import logService from '@/services/log-service';
import {
  ContinueBar,
  CountrySelect,
  RegionSelect,
  PageContent,
  Select,
  Radio,
  Input,
  DateInput,
  PhnInput,
  SINInput,
  FileUploader,
  optionalValidator,
  distantPastValidator,
  phnValidator,
  sinValidator,
} from 'common-lib-vue';
import {
  required
} from 'vuelidate/lib/validators';
import {
  isSameDay,
  startOfToday,
  isAfter,
  isBefore,
  addDays,
  subDays,
  subYears,
} from 'date-fns';
import pageContentMixin from '@/mixins/page-content-mixin';
import { 
  selectOptionsImmigrationStatus,
  selectOptionsCitizenshipSupportDocuments,
  selectOptionsPermanentResidentSupportDocuments,
  selectOptionWorkPermitSupportDocument,
  selectOptionStudyPermitSupportDocument,
  selectOptionReligiousWorkSupportDocument,
  selectOptionDiplomaticFoilSupportDocument,
  selectOptionVisitorVisaSupportDocument,
  selectOptionsNameChangeSupportDocuments,
} from '@/constants/select-options';
import { 
  radioOptionsNoYes,
  radioOptionsCitizenStatusReasons, 
  radioOptionsTemporaryResidentStatusReasons,
  radioOptionsGender,
} from '@/constants/radio-options';
import { 
  StatusInCanada,
  CanadianStatusReasons, 
} from '@/constants/immigration-status-types';
import { smallStyles, mediumStyles } from '@/constants/input-styles';
import { SupportDocumentTypes } from '@/constants/document-types';
import {
  MODULE_NAME as enrolmentModule,
  SET_HAS_SPOUSE,
  SET_SPOUSE_STATUS,
  SET_SPOUSE_STATUS_REASON,
  SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE,
  SET_SPOUSE_GENDER_MATCHES,
  SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS,
  SET_SPOUSE_IS_NAME_CHANGED,
  SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE,
  SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS,
  SET_SPOUSE_FIRST_NAME,
  SET_SPOUSE_MIDDLE_NAME,
  SET_SPOUSE_LAST_NAME,
  SET_SPOUSE_BIRTH_DATE,
  SET_SPOUSE_PHN,
  SET_SPOUSE_SIN,
  SET_SPOUSE_GENDER,
  SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH,
  SET_SPOUSE_MADE_PERMANENT_MOVE,
  SET_SPOUSE_MOVE_FROM_ORIGIN,
  SET_SPOUSE_RECENT_BC_MOVE_DATE,
  SET_SPOUSE_CANADA_ARRIVAL_DATE,
  SET_SPOUSE_PREVIOUS_HEALTH_NUMBER,
  SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS,
  SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON,
  SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION,
  SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE,
  SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE,
  SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER,
  SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER,
  SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION,
  SET_SPOUSE_DISCHARGE_DATE,
  SET_SPOUSE_FPC_INCOME,
  SET_SPOUSE_FPC_RDSP,
  SET_SPOUSE_CRA_DOCUMENTS,
} from '@/store/modules/enrolment-module';
import TipBox from '@/components/TipBox.vue';
import SampleImageTipBox from '@/components/SampleImageTipBox.vue';
import pageStepperMixin from '@/mixins/page-stepper-mixin';
import { firstNameMaxLength, middleNameMaxLength } from '@/constants/html-validations.js'

const birthDatePastValidator = (value) => {
  return pastDateValidator(value) || isSameDay(value, startOfToday());
};

const permanentMoveValidator = (value) => {
  return value === 'Y';
}

const departureDateValidator = (value, vm) => {
  const past12Months = subYears(subDays(startOfToday(), 1), 1);
  const returnDate = vm.spouseOutsideBCLast12MonthsReturnDate;
  return isAfter(value, past12Months) // Is within the last 12 months
      && (!returnDate || isBefore(value, addDays(returnDate, 1))) // Is before or equal to return date
      && isBefore(value, startOfToday()); // Is before or equal to date today
};

const returnDateValidator = (value, vm) => {
  const past12Months = subYears(subDays(startOfToday(), 1), 1);
  const departureDate = vm.spouseOutsideBCLast12MonthsDepartureDate;
  return isAfter(value, past12Months) // Is within the last 12 months
      && (!departureDate || isAfter(value, subDays(departureDate, 1))) // Is after or equal to departure date
      && isBefore(value, startOfToday()); // Is before or equal to date today
};

const beforeBirthdateValidator = (value, vm) => {
  if (vm.spouseBirthDate && vm.spouseBirthDate.getTime() > value.getTime()) {
    return false;
  } 

  return true;
}

const dateOrderValidator = (value, vm) => {
  if (!value) {
    return false;
  }

  if(vm.spouseBirthDate) {
    if (vm.spouseBirthDate.getTime() > value.getTime()) {
      return false;
    }

    if(!vm.spouseCanadaArrivalDate || !vm.spouseRecentBCMoveDate) {
      return true;
    }
  }

  if (vm.spouseRecentBCMoveDate && vm.spouseCanadaArrivalDate){
    return vm.spouseRecentBCMoveDate.getTime() >= vm.spouseCanadaArrivalDate.getTime();
  }

  return true;
}

const dischargeDateValidator = (value, vm) => {
  if(vm.spouseBirthDate && vm.spouseBirthDate.getTime() > value.getTime()) {
    return false;
  }

  return true;
}

const uniquePHNValidator = (value, vm) => {
  return value !== vm.ahPHN;
};

const uniqueSINValidator = (value, vm) => {
  return value !== vm.ahSIN;
}

export default {
  name: 'SpouseInfoPage',
  mixins: [
    pageContentMixin, 
    pageStepperMixin
  ],
  components: {
    ContinueBar,
    CountrySelect,
    RegionSelect,
    PageContent,
    Select,
    Radio,
    Input,
    DateInput,
    PhnInput,
    SINInput,
    FileUploader,
    TipBox,
    SampleImageTipBox
  },
  data: () => {
    return {
      pageLoaded: false,
      firstNameMaxLength,
      middleNameMaxLength,
      // Radio and select options
      radioGenderOptions: radioOptionsGender,
      radioOptionsNoYes: radioOptionsNoYes,
      statusOptions: StatusInCanada,
      canadianStatusReasons: CanadianStatusReasons,
      citizenshipStatusOptions: selectOptionsImmigrationStatus,
      citizenshipStatusReasonOptions: radioOptionsCitizenStatusReasons,
      nameChangeSupportDocumentOptions: selectOptionsNameChangeSupportDocuments,
      temporaryResidentStatusReasonOptions: radioOptionsTemporaryResidentStatusReasons,
      mediumStyles: mediumStyles,
      smallStyles: smallStyles,
      // Data to be saved
      hasSpouse: null,
      spouseStatus: null,
      spouseStatusReason: null,
      spouseCitizenshipSupportDocumentType: null,
      spouseGenderMatches: null,
      spouseCitizenshipSupportDocuments: [],
      spouseIsNameChanged: null,
      spouseNameChangeSupportDocumentType: null,
      spouseNameChangeSupportDocuments: [],
      spouseFirstName: null,
      spouseMiddleName: null,
      spouseLastName: null,
      spouseBirthDate: null,
      spousePersonalHealthNumber: null,
      spouseSocialInsuranceNumber: null,
      spouseGender: null,
      spouseLivedInBCSinceBirth: null,
      spouseMadePermanentMove: null,
      spouseMoveFromOrigin: null,
      spouseRecentBCMoveDate: null,
      spouseCanadaArrivalDate: null,
      spouseOutsideBCLast12Months: null,
      spouseOutsideBCLast12MonthsReason: null,
      spouseOutsideBCLast12MonthsDestination: null,
      spouseOutsideBCLast12MonthsDepartureDate: null,
      spouseOutsideBCLast12MonthsReturnDate: null,
      spousePreviousHealthNumber: null,
      spouseHasPreviousBCHealthNumber: null,
      spousePreviousBCHealthNumber: null,
      spouseBeenReleasedFromInstitution: null,
      spouseDischargeDate: null,
      spouseIncome: null,
      spouseRDSP: null,
      spouseCRADocuments: [],
      // Date data which is processed by date validators:
      birthdateData: null,
      canadaArrivalDateData: null,
      recentBCMoveDateData: null,
      spouseOutsideBCLast12MonthsDepartureDateData: null,
      spouseOutsideBCLast12MonthsReturnDateData: null,
      spouseDischargeDateData: null,
      ahPHN: null,
      ahSIN: null,
    };
  },
  created() {
    this.hasSpouse = this.$store.state.enrolmentModule.hasSpouse;
    this.spouseStatus = this.$store.state.enrolmentModule.spouseStatus;
    this.spouseStatusReason = this.$store.state.enrolmentModule.spouseStatusReason;
    this.spouseCitizenshipSupportDocumentType = this.$store.state.enrolmentModule.spouseCitizenshipSupportDocumentType;
    this.spouseGenderMatches = this.$store.state.enrolmentModule.spouseGenderMatches;
    this.spouseCitizenshipSupportDocuments = this.$store.state.enrolmentModule.spouseCitizenshipSupportDocuments;
    this.spouseIsNameChanged = this.$store.state.enrolmentModule.spouseIsNameChanged;
    this.spouseNameChangeSupportDocumentType = this.$store.state.enrolmentModule.spouseNameChangeSupportDocumentType;
    this.spouseNameChangeSupportDocuments = this.$store.state.enrolmentModule.spouseNameChangeSupportDocuments;
    this.spouseFirstName = this.$store.state.enrolmentModule.spouseFirstName;
    this.spouseMiddleName = this.$store.state.enrolmentModule.spouseMiddleName;
    this.spouseLastName = this.$store.state.enrolmentModule.spouseLastName;
    this.spouseBirthDate = this.$store.state.enrolmentModule.spouseBirthDate;
    this.spousePersonalHealthNumber = this.$store.state.enrolmentModule.spousePHN;
    this.spouseSocialInsuranceNumber = this.$store.state.enrolmentModule.spouseSIN;
    this.spouseGender = this.$store.state.enrolmentModule.spouseGender;
    this.spouseLivedInBCSinceBirth = this.$store.state.enrolmentModule.spouseLivedInBCSinceBirth;
    this.spouseMadePermanentMove = this.$store.state.enrolmentModule.spouseMadePermanentMove;
    this.spouseMoveFromOrigin = this.$store.state.enrolmentModule.spouseMoveFromOrigin;
    this.spouseRecentBCMoveDate = this.$store.state.enrolmentModule.spouseRecentBCMoveDate;
    this.spouseCanadaArrivalDate = this.$store.state.enrolmentModule.spouseCanadaArrivalDate;
    this.spouseOutsideBCLast12Months = this.$store.state.enrolmentModule.spouseOutsideBCLast12Months;
    this.spouseOutsideBCLast12MonthsReason = this.$store.state.enrolmentModule.spouseOutsideBCLast12MonthsReason;
    this.spouseOutsideBCLast12MonthsDestination = this.$store.state.enrolmentModule.spouseOutsideBCLast12MonthsDestination;
    this.spouseOutsideBCLast12MonthsDepartureDate = this.$store.state.enrolmentModule.spouseOutsideBCLast12MonthsDepartureDate;
    this.spouseOutsideBCLast12MonthsReturnDate = this.$store.state.enrolmentModule.spouseOutsideBCLast12MonthsReturnDate;
    this.spousePreviousHealthNumber = this.$store.state.enrolmentModule.spousePreviousHealthNumber;
    this.spouseHasPreviousBCHealthNumber = this.$store.state.enrolmentModule.spouseHasPreviousBCHealthNumber;
    this.spousePreviousBCHealthNumber = this.$store.state.enrolmentModule.spousePreviousBCHealthNumber;
    this.spouseBeenReleasedFromInstitution = this.$store.state.enrolmentModule.spouseBeenReleasedFromInstitution;
    this.spouseDischargeDate = this.$store.state.enrolmentModule.spouseDischargeDate;
    this.spouseIncome = this.$store.state.enrolmentModule.spouseFPCIncome;
    this.spouseRDSP = this.$store.state.enrolmentModule.spouseFPCRDSP;
    this.spouseCRADocuments = this.$store.state.enrolmentModule.spouseCRADocuments;
    this.ahPHN = this.$store.state.enrolmentModule.ahPHN;
    this.ahSIN = this.$store.state.enrolmentModule.ahSIN;
    
    setTimeout(() => {
      this.pageLoaded = true;
    }, 0);

    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.SPOUSE_INFO_PAGE.path,
      enrolmentRoutes.SPOUSE_INFO_PAGE.title
    );
  },
  validations() {
    const validations = {
      hasSpouse: {
        required,
      },
      spouseFirstName: {
        required,
        nameValidator,
      },
      spouseMiddleName: {
        nameValidator: optionalValidator(nameValidator),
      },
      spouseLastName: {
        required,
        nameValidator,
      },
      spouseBirthDate: {
        required: dateDataRequiredValidator(this.birthdateData),
        dateDataValidator: dateDataValidator(this.birthdateData),
        distantPastValidator: optionalValidator(distantPastValidator),
        birthDatePastValidator: optionalValidator(birthDatePastValidator),
      },
      spousePersonalHealthNumber: {},
      spouseSocialInsuranceNumber: {},
      spouseGender: {},
      spouseStatus: {},
      spouseStatusReason: {},
      spouseCitizenshipSupportDocumentType: {},
      spouseGenderMatches: {},
      spouseCitizenshipSupportDocuments: {},
      spouseIsNameChanged: {},
      spouseNameChangeSupportDocumentType: {},
      spouseNameChangeSupportDocuments: {},
      spouseMadePermanentMove: {},
      spouseMoveFromOrigin: {},
      spouseLivedInBCSinceBirth: {},
      spouseRecentBCMoveDate: {},
      spouseCanadaArrivalDate: {},
      spouseOutsideBCLast12Months: {},
      spouseOutsideBCLast12MonthsReason: {},
      spouseOutsideBCLast12MonthsDestination: {},
      spouseOutsideBCLast12MonthsDepartureDate: {},
      spouseOutsideBCLast12MonthsReturnDate: {},
      spouseHasPreviousBCHealthNumber: {},
      spousePreviousBCHealthNumber: {},
      spouseBeenReleasedFromInstitution: {},
      spouseDischargeDate: {},
    };

    if (this.requestPersonalHealthNumber) {
      validations.spousePersonalHealthNumber.required = required;
      validations.spousePersonalHealthNumber.phnValidator = optionalValidator(phnValidator);
      validations.spousePersonalHealthNumber.phnFirstDigitValidator = optionalValidator(phnFirstDigitValidator);
      validations.spousePersonalHealthNumber.uniquePHNValidator = optionalValidator(uniquePHNValidator);
    }
    
    if (this.requestSocialInsuranceNumber) {
      validations.spouseSocialInsuranceNumber.required = required;
      validations.spouseSocialInsuranceNumber.sinValidator = optionalValidator(sinValidator);
      validations.spouseSocialInsuranceNumber.uniqueSINValidator = optionalValidator(uniqueSINValidator);
    }

    if (this.requestGender) {
      validations.spouseGender.required = required;
    }

    if (this.requestImmigrationStatus) {
      validations.spouseStatus.required = required;
      validations.spouseStatusReason.required = required;
      validations.spouseCitizenshipSupportDocumentType.required = required;
      validations.spouseGenderMatches.required = required;
      validations.spouseCitizenshipSupportDocuments.required = required;
      validations.spouseIsNameChanged.required = required;

      if (this.spouseIsNameChanged === 'Y') {
        validations.spouseNameChangeSupportDocumentType.required = required;
        validations.spouseNameChangeSupportDocuments.required = required;
      }
    }

    if (this.requestMovingInfo) {
      validations.spouseMadePermanentMove.required = required;
      validations.spouseMadePermanentMove.permanentMoveValidator = this.spouseStatus !== StatusInCanada.TemporaryResident ? optionalValidator(permanentMoveValidator) : () => true;
      validations.spouseOutsideBCLast12Months.required = required;
      validations.spouseHasPreviousBCHealthNumber.required = required;

      if (this.showLivedInBCSinceBirth) {
        validations.spouseLivedInBCSinceBirth.required = required;
      }

      if (this.showProvinceSelector) {
        validations.spouseMoveFromOrigin.required = required;
        validations.spouseMoveFromOrigin.nonBCValidator = nonBCValidator;
      }

      if (this.showCountrySelector) {
        validations.spouseMoveFromOrigin.required = required;
        validations.spouseMoveFromOrigin.nonCanadaValidator = nonCanadaValidator;
      }

      if (this.showOriginTextField) {
        validations.spouseMoveFromOrigin.required = required;
      }

      if (this.showMoveDateInputs) {
        validations.spouseRecentBCMoveDate.required = dateDataRequiredValidator(this.recentBCMoveDateData);
        validations.spouseRecentBCMoveDate.dateDataValidator = dateDataValidator(this.recentBCMoveDateData);
        validations.spouseRecentBCMoveDate.dateOrderValidator = dateOrderValidator;
        validations.spouseRecentBCMoveDate.beforeBirthdateValidator = beforeBirthdateValidator;
        validations.spouseRecentBCMoveDate.pastDateValidator = optionalValidator(pastDateValidator);
        
        validations.spouseCanadaArrivalDate.required = this.canadaArrivalDateLabel === 'Arrival date in Canada' ? dateDataRequiredValidator(this.canadaArrivalDateData) : () => true,
        validations.spouseCanadaArrivalDate.dateDataValidator = dateDataValidator(this.canadaArrivalDateData);
        validations.spouseCanadaArrivalDate.dateOrderValidator = optionalValidator(dateOrderValidator);
        validations.spouseCanadaArrivalDate.beforeBirthdateValidator = optionalValidator(beforeBirthdateValidator);
        validations.spouseCanadaArrivalDate.pastDateValidator = optionalValidator(pastDateValidator);
      }

      if (this.spouseOutsideBCLast12Months === 'Y') {
        validations.spouseOutsideBCLast12MonthsReason.required = required;
        validations.spouseOutsideBCLast12MonthsReason.reasonDestinationContentValidator = reasonDestinationContentValidator;
        validations.spouseOutsideBCLast12MonthsDestination.required = required;
        validations.spouseOutsideBCLast12MonthsDestination.reasonDestinationContentValidator = reasonDestinationContentValidator;
        validations.spouseOutsideBCLast12MonthsDepartureDate.required = dateDataRequiredValidator(this.spouseOutsideBCLast12MonthsDepartureDateData);
        validations.spouseOutsideBCLast12MonthsDepartureDate.dateDataValidator = dateDataValidator(this.spouseOutsideBCLast12MonthsDepartureDateData);
        validations.spouseOutsideBCLast12MonthsDepartureDate.departureDateValidator = optionalValidator(departureDateValidator);

        validations.spouseOutsideBCLast12MonthsReturnDate.required = dateDataRequiredValidator(this.spouseOutsideBCLast12MonthsReturnDateData);
        validations.spouseOutsideBCLast12MonthsReturnDate.dateDataValidator = dateDataValidator(this.spouseOutsideBCLast12MonthsReturnDateData);
        validations.spouseOutsideBCLast12MonthsReturnDate.returnDateValidator = optionalValidator(returnDateValidator); 
      }

      if (this.spouseHasPreviousBCHealthNumber === 'Y') {
        validations.spousePreviousBCHealthNumber.phnValidator = optionalValidator(phnValidator);
      }

      if (this.showDischargeInputs) {
        validations.spouseBeenReleasedFromInstitution.required = required;
        
        if (this.spouseBeenReleasedFromInstitution === 'Y') {
          validations.spouseDischargeDate.required = dateDataRequiredValidator(this.spouseDischargeDateData);
          validations.spouseDischargeDate.dateDataValidator = dateDataValidator(this.spouseDischargeDateData);
          validations.spouseDischargeDate.dischargeDateValidator = optionalValidator(dischargeDateValidator);
          validations.spouseDischargeDate.pastDateValidator = optionalValidator(pastDateValidator);
        }
      }
    }
    
    return validations;
  },
  watch: {
    // When the status is changed, clear the reason
    spouseStatus() {
      if (this.pageLoaded) {
        this.spouseStatusReason = null;
        this.spouseCitizenshipSupportDocumentType = null;
        this.spouseMoveFromOrigin = null;
        this.spouseLivedInBCSinceBirth = null;
        this.spousePreviousHealthNumber = null;
        this.$v.spouseStatusReason.$reset();
        this.$v.spouseMoveFromOrigin.$reset();
        this.$v.spouseLivedInBCSinceBirth.$reset();
        this.spouseCitizenshipSupportDocuments = [];
        this.$v.spouseCitizenshipSupportDocuments.$reset();
      }
    },
    spouseStatusReason() {
      if (this.pageLoaded) {
        this.spouseGenderMatches = null;
        this.spouseCitizenshipSupportDocumentType = null;
        this.spouseCitizenshipSupportDocuments = [];
        this.spouseIsNameChanged = null;
        this.spouseLivedInBCSinceBirth = null;
        this.spouseMadePermanentMove = null;
        this.spouseMoveFromOrigin = null;
        this.spouseRecentBCMoveDate = null;
        this.spouseCanadaArrivalDate = null;
        this.spouseOutsideBCLast12Months = null;
        this.spousePreviousHealthNumber = null;
        this.spouseHasPreviousBCHealthNumber = null;
        this.spouseBeenReleasedFromInstitution = null;
        this.$v.spouseGenderMatches.$reset();
        this.$v.spouseCitizenshipSupportDocumentType.$reset();
        this.$v.spouseCitizenshipSupportDocuments.$reset();
        this.$v.spouseIsNameChanged.$reset();
        this.$v.spouseLivedInBCSinceBirth.$reset();
        this.$v.spouseMadePermanentMove.$reset();
        this.$v.spouseMoveFromOrigin.$reset();
        this.$v.spouseRecentBCMoveDate.$reset();
        this.$v.spouseCanadaArrivalDate.$reset();
        this.$v.spouseOutsideBCLast12Months.$reset();
        this.$v.spouseHasPreviousBCHealthNumber.$reset();
        this.$v.spouseBeenReleasedFromInstitution.$reset();
      }
    },
    spouseCitizenshipSupportDocumentType() {
      if (this.isPageLoaded) {
        this.spouseCitizenshipSupportDocuments = [];
        this.$v.spouseCitizenshipSupportDocuments.$reset();
      }
    },
    spouseIsNameChanged() {
      if (this.isPageLoaded) {
        this.spouseNameChangeSupportDocumentType = null;
        this.$v.spouseNameChangeSupportDocumentType.$reset();
      }
    },
    spouseNameChangeSupportDocumentType() {
      if (this.isPageLoaded) {
        this.spouseNameChangeSupportDocuments = [];
        this.$v.spouseNameChangeSupportDocuments.$reset();
      }
    },
    spouseLivedInBCSinceBirth() {
      if (this.isPageLoaded) {
        this.spouseMoveFromOrigin = null;
        this.spouseCanadaArrivalDate = null;
        this.spouseRecentBCMoveDate = null;
        this.$v.spouseMoveFromOrigin.$reset();
        this.$v.spouseCanadaArrivalDate.$reset();
        this.$v.spouseRecentBCMoveDate.$reset();
      }
    },
    spouseMadePermanentMove(newValue) {
      if (this.isPageLoaded) {
        if (newValue === null) {
          this.spouseMoveFromOrigin = null;
          this.spouseRecentBCMoveDate = null;
          this.spouseCanadaArrivalDate = null;
          this.spouseOutsideBCLast12Months = null;
          this.spouseHasPreviousBCHealthNumber = null;
          this.spouseBeenReleasedFromInstitution = null;
          this.$v.spouseMoveFromOrigin.$reset();
          this.$v.spouseRecentBCMoveDate.$reset();
          this.$v.spouseCanadaArrivalDate.$reset();
          this.$v.spouseOutsideBCLast12Months.$reset();
          this.$v.spouseHasPreviousBCHealthNumber.$reset();
          this.$v.spouseBeenReleasedFromInstitution.$reset();
        }
      }
    },
    spouseOutsideBCLast12Months() {
      if (this.isPageLoaded) {
        this.spouseOutsideBCLast12MonthsReason = null;
        this.spouseOutsideBCLast12MonthsDestination = null;
        this.spouseOutsideBCLast12MonthsDepartureDate = null;
        this.spouseOutsideBCLast12MonthsReturnDate = null;
        this.$v.spouseOutsideBCLast12MonthsReason.$reset();
        this.$v.spouseOutsideBCLast12MonthsDestination.$reset();
        this.$v.spouseOutsideBCLast12MonthsDepartureDate.$reset();
        this.$v.spouseOutsideBCLast12MonthsReturnDate.$reset();
      }
    },
    spouseHasPreviousBCHealthNumber() {
      if (this.isPageLoaded) {
        this.spousePreviousBCHealthNumber = null;
        this.$v.spousePreviousBCHealthNumber.$reset();
      }
    },
    showDischargeInputs(newValue) {
      if (this.isPageLoaded && newValue === false) {
        this.spouseBeenReleasedFromInstitution = null;
        this.$v.spouseBeenReleasedFromInstitution.$reset();
      }
    },
    spouseBeenReleasedFromInstitution() {
      if (this.isPageLoaded) {
        this.spouseDischargeDate = null;
        this.$v.spouseDischargeDate.$reset();
      }
    },
  },
  methods: {
    removeSpouse() {
      this.hasSpouse = 'N';
    },
    supportDocumentTypeToTitle,
    validateFields() {
      this.saveData();

      if (this.hasSpouse === 'N') {
        this.navigateToNextPage();
        return;
      }

      this.$v.$touch()
      if (this.$v.$invalid) {
        scrollToError();
        return;
      }

      this.navigateToNextPage();
    },
    saveData() {
      this.setEmptyFields();
      this.$store.dispatch(enrolmentModule + '/' + SET_HAS_SPOUSE, this.hasSpouse);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_STATUS, this.spouseStatus);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_STATUS_REASON, this.spouseStatusReason);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENT_TYPE, this.spouseCitizenshipSupportDocumentType);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_GENDER_MATCHES, this.spouseGenderMatches);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_CITIZENSHIP_SUPPORT_DOCUMENTS, this.spouseCitizenshipSupportDocuments);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_IS_NAME_CHANGED, this.spouseIsNameChanged);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENT_TYPE, this.spouseNameChangeSupportDocumentType);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_NAME_CHANGE_SUPPORT_DOCUMENTS, this.spouseNameChangeSupportDocuments);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_FIRST_NAME, this.spouseFirstName);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_MIDDLE_NAME, this.spouseMiddleName);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_LAST_NAME, this.spouseLastName);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_BIRTH_DATE, this.spouseBirthDate);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_PHN, this.spousePersonalHealthNumber);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_SIN, this.spouseSocialInsuranceNumber);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_GENDER, this.spouseGender);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_LIVED_IN_BC_SINCE_BIRTH, this.spouseLivedInBCSinceBirth);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_MADE_PERMANENT_MOVE, this.spouseMadePermanentMove);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_MOVE_FROM_ORIGIN, this.spouseMoveFromOrigin);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_RECENT_BC_MOVE_DATE, this.spouseRecentBCMoveDate);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_CANADA_ARRIVAL_DATE, this.spouseCanadaArrivalDate);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_PREVIOUS_HEALTH_NUMBER, this.spousePreviousHealthNumber);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS, this.spouseOutsideBCLast12Months);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_REASON, this.spouseOutsideBCLast12MonthsReason);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DESTINATION, this.spouseOutsideBCLast12MonthsDestination);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_DEPARTURE_DATE, this.spouseOutsideBCLast12MonthsDepartureDate);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_OUTSIDE_BC_LAST_12_MONTHS_RETURN_DATE, this.spouseOutsideBCLast12MonthsReturnDate);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_HAS_PREVIOUS_BC_HEALTH_NUMBER, this.spouseHasPreviousBCHealthNumber);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_PREVIOUS_BC_HEALTH_NUMBER, this.spousePreviousBCHealthNumber);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_BEEN_RELEASED_FROM_INSTITUTION, this.spouseBeenReleasedFromInstitution);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_DISCHARGE_DATE, this.spouseDischargeDate);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_FPC_INCOME, this.spouseIncome);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_FPC_RDSP, this.spouseRDSP);
      this.$store.dispatch(enrolmentModule + '/' + SET_SPOUSE_CRA_DOCUMENTS, this.spouseCRADocuments);
    },
    navigateToNextPage() {
      // Determine which page to navigate to next
      let routePath;
      if (this.$store.state.enrolmentModule.isApplyingForFPCare || this.$store.state.enrolmentModule.isApplyingForMSP) {
        routePath = enrolmentRoutes.CHILD_INFO_PAGE.path;
      } else {
        routePath = enrolmentRoutes.SUPP_BEN_INFO_PAGE.path;
      }
      
      // Navigate to next path.
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        routePath
      );

      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
    handleBlurField(validationObject) {
      if (validationObject) {
        validationObject.$touch();
      }
    },
    handleProcessBirthdate(data) {
      this.birthdateData = data;
    },
    handleProcessDateBCMove(data) {
      this.recentBCMoveDateData = data;
    },
    handleProcessDateCanadaArrival(data) {
      this.canadaArrivalDateData = data;
    },
    handleProcessDate12MonthsDeparture(data) {
      this.spouseOutsideBCLast12MonthsDepartureDateData = data;
    },
    handleProcessDate12MonthsReturn(data) {
      this.spouseOutsideBCLast12MonthsReturnDateData = data;
    },
    handleProcessDateDischarge(data) {
      this.spouseDischargeDateData = data;
    },
    setEmptyFields() {
      //No spouse
      if (this.hasSpouse !== "Y") {
        this.spouseStatus = null;
        this.spouseStatusReason = null;
        this.spouseCitizenshipSupportDocumentType = null;
        this.spouseGenderMatches = null;
        this.spouseCitizenshipSupportDocuments = [];
        this.spouseIsNameChanged = null;
        this.spouseNameChangeSupportDocumentType = null;
        this.spouseNameChangeSupportDocuments = [];
        this.spouseFirstName = null;
        this.spouseMiddleName = null;
        this.spouseLastName = null;
        this.spouseBirthDate = null;
        this.spousePersonalHealthNumber = null;
        this.spouseSocialInsuranceNumber = null;
        this.spouseGender = null;
        this.spouseLivedInBCSinceBirth = null;
        this.spouseMadePermanentMove = null;
        this.spouseMoveFromOrigin = null;
        this.spouseRecentBCMoveDate = null;
        this.spouseCanadaArrivalDate = null;
        this.spouseOutsideBCLast12Months = null;
        this.spouseOutsideBCLast12MonthsReason = null;
        this.spouseOutsideBCLast12MonthsDestination = null;
        this.spouseOutsideBCLast12MonthsDepartureDate = null;
        this.spouseOutsideBCLast12MonthsReturnDate = null;
        this.spousePreviousHealthNumber = null;
        this.spouseHasPreviousBCHealthNumber = null;
        this.spousePreviousBCHealthNumber = null;
        this.spouseBeenReleasedFromInstitution = null;
        this.spouseDischargeDate = null;
        this.spouseIncome = null;
        this.spouseRDSP = null;
        this.spouseCRADocuments = [];
      }

      //Name change
      if (this.spouseIsNameChanged !== "Y") {
        this.spouseNameChangeSupportDocumentType = null;
        this.spouseNameChangeSupportDocuments = [];
      }

      //Moved to BC
      if (this.spouseLivedInBCSinceBirth === "Y") {
        this.spouseMoveFromOrigin = null;
        this.spouseRecentBCMoveDate = null;
        this.spouseCanadaArrivalDate = null;
        this.spousePreviousHealthNumber = null;
      }

      //Left BC
      if (this.spouseOutsideBCLast12Months !== "Y") {
        this.spouseOutsideBCLast12MonthsReason = null;
        this.spouseOutsideBCLast12MonthsDestination = null;
        this.spouseOutsideBCLast12MonthsDepartureDate = null;
        this.spouseOutsideBCLast12MonthsReturnDate = null;
      }

      //BC Health Number
      if (this.spouseHasPreviousBCHealthNumber !== "Y") {
        this.spousePreviousBCHealthNumber = null;
      }

      //Discharged from army/institution
      if (this.spouseBeenReleasedFromInstitution !== "Y") {
        this.spouseDischargeDate = null;
      }
    }
  },
  computed: {
    requestGender() {
      return this.$store.state.enrolmentModule.isApplyingForMSP;
    },
    requestPersonalHealthNumber() {
      return !this.$store.state.enrolmentModule.isApplyingForMSP;
    },
    requestSocialInsuranceNumber() {
      return this.$store.state.enrolmentModule.isApplyingForFPCare
        || this.$store.state.enrolmentModule.isApplyingForSuppBen;
    },
    requestImmigrationStatus() {
      return this.$store.state.enrolmentModule.isApplyingForMSP;
    },
    requestMovingInfo() {
      return this.$store.state.enrolmentModule.isApplyingForMSP 
        && (this.spouseCitizenshipSupportDocuments.length > 0 && (this.spouseIsNameChanged === 'N' || this.spouseNameChangeSupportDocuments.length > 0));
    },
    citizenshipSupportDocumentOptions() {
      let options;

      if (this.spouseStatus === StatusInCanada.PermanentResident) {
        options = selectOptionsPermanentResidentSupportDocuments;
      } else if (this.spouseStatus === StatusInCanada.TemporaryResident){
        if (this.spouseStatusReason === this.canadianStatusReasons.WorkingInBC) {
          options = selectOptionWorkPermitSupportDocument;
        } else if (this.spouseStatusReason === this.canadianStatusReasons.StudyingInBC) {
          options = selectOptionStudyPermitSupportDocument;
        } else if (this.spouseStatusReason === this.canadianStatusReasons.ReligiousWorker) {
          options = selectOptionReligiousWorkSupportDocument;
        } else if (this.spouseStatusReason === this.canadianStatusReasons.Diplomat) {
          options = selectOptionDiplomaticFoilSupportDocument;
        } else if (this.spouseStatusReason === this.canadianStatusReasons.Visiting) {
          options = selectOptionVisitorVisaSupportDocument;
        }
      } else {
        options = selectOptionsCitizenshipSupportDocuments;
      }

      return options;
    },
    canadaArrivalDateLabel() {
      if (this.spouseStatusReason === this.canadianStatusReasons.MovingFromProvince
        && this.spouseStatus !== this.statusOptions.TemporaryResident) {
        return 'Arrival date in Canada (Optional)';
      }
      if (this.spouseStatus === this.statusOptions.Citizen && this.spouseLivedInBCSinceBirth === 'N') {
        return 'Arrival date in Canada (Optional)';
      }
      if (this.spouseStatus === this.statusOptions.TemporaryResident && this.spouseStatusReason === this.canadianStatusReasons.LivingInBCWithoutMSP) {
        return 'Arrival date in Canada (Optional)';
      }
      if (this.spouseStatus === this.statusOptions.PermanentResident && this.spouseStatusReason === this.canadianStatusReasons.LivingInBCWithoutMSP) {
        return 'Arrival date in Canada (Optional)';
      }
      return 'Arrival date in Canada';
    },
    bcMoveDateLabel() {
      if (this.spouseStatusReason === this.canadianStatusReasons.LivingInBCWithoutMSP) {
        return 'Most recent move to B.C.';
      } else {
        return 'Arrival date in B.C.';
      }
    },
    showPreviousHealthNumber() {
      return this.spouseStatusReason === this.canadianStatusReasons.MovingFromProvince;
    },
    showLivedInBCSinceBirth() {
      return this.spouseStatus === this.statusOptions.Citizen 
        && this.spouseStatusReason === this.canadianStatusReasons.LivingInBCWithoutMSP
    },
    showMoveDateInputs() {
      return (this.spouseStatus === this.statusOptions.PermanentResident && this.spouseStatusReason === this.canadianStatusReasons.LivingInBCWithoutMSP) 
        || (this.spouseStatusReason === this.canadianStatusReasons.LivingInBCWithoutMSP && this.spouseLivedInBCSinceBirth === 'N') 
        || this.spouseStatusReason !== this.canadianStatusReasons.LivingInBCWithoutMSP; 
    },
    showOriginTextField() {
      return this.spouseStatus === this.statusOptions.TemporaryResident
        || (this.spouseStatus === this.statusOptions.PermanentResident
        && this.spouseStatusReason === this.canadianStatusReasons.LivingInBCWithoutMSP);
    },
    showMovedPermanentlyQuestion() {
      return this.spouseStatusReason !== this.canadianStatusReasons.LivingInBCWithoutMSP 
      || (this.spouseStatus === this.statusOptions.PermanentResident && this.spouseStatusReason === this.canadianStatusReasons.LivingInBCWithoutMSP) 
      || this.spouseLivedInBCSinceBirth === 'Y' || this.spouseLivedInBCSinceBirth === 'N';
    },
    showProvinceSelector() {
      if (this.spouseStatus === this.statusOptions.Citizen) {
        return (this.spouseStatusReason === this.canadianStatusReasons.MovingFromProvince
              || (this.spouseStatusReason === this.canadianStatusReasons.LivingInBCWithoutMSP && this.spouseLivedInBCSinceBirth === 'N'))
      } else if(this.spouseStatus === this.statusOptions.PermanentResident) {
        return this.spouseStatusReason === this.canadianStatusReasons.MovingFromProvince;
      }
      return false;
    },
    showCountrySelector() {
      if (this.spouseStatus === this.statusOptions.Citizen) {
        return this.spouseStatusReason === this.canadianStatusReasons.MovingFromCountry;
      } else if(this.spouseStatus === this.statusOptions.PermanentResident) {
        return this.spouseStatusReason === this.canadianStatusReasons.MovingFromCountry;
      }
      return false;
    },
    showDischargeInputs() {
      return this.spouseStatus === this.statusOptions.Citizen;
    },
    citizenshipSamples() {
      if (this.spouseGenderMatches === 'N') {
        return [this.spouseCitizenshipSupportDocumentType, SupportDocumentTypes.ChangeGenderDocs];
      } else {
        return this.spouseCitizenshipSupportDocumentType;
      }
    },
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)
      && !isEQPath(to.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.SPOUSE_INFO_PAGE.path
      );
      next({
        path: toPath,
        replace: true
      });
      setTimeout(() => {
        scrollTo(topScrollPosition);
      }, 0);
    }
  }
}
</script>

<style scoped>
.heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remove-icon {
  cursor: pointer;
}
</style>

