<template>
    <div>
      <!-- Bootstrap row and column classes for gender tipbox placement -->
      <div class="row">
        <div class="col-md-7">
          <div v-if="requestAgeRange">
            <Radio
              label='How old is the child?'
              :id="'child-age-range-' + index"
              :name="'child-age-range-' + index"
              v-model='ageRange'
              @blur="handleBlurField(v$.ageRange)"
              className="mt-3"
              :items='radioChildAgeOptions'
            />
            <div class="text-danger"
              v-if="v$.ageRange.$dirty && v$.ageRange.required.$invalid"
              aria-live="assertive">Please indicate the child's age range.</div>
          </div>
          <Input label='First name'
            :id="'child-first-name-' + index"
            className='mt-3'
            maxlength="30"
            @blur="handleBlurField(v$.firstName)"
            v-model='firstName'
            :inputStyle='mediumStyles' />
          <div class="text-danger"
            v-if="v$.firstName.$dirty && v$.firstName.required.$invalid"
            aria-live="assertive">First name is required.</div>
          <div class="text-danger"
            v-if="v$.firstName.$dirty && !v$.firstName.required.$invalid && v$.firstName.nameValidator.$invalid"
            aria-live="assertive">First name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
          <Input label='Middle name (optional)'
            :id="'child-middle-name-' + index"
            className='mt-3'
            maxlength="30"
            @blur="handleBlurField(v$.middleName)"
            v-model='middleName'
            :inputStyle='mediumStyles' />
          <div class="text-danger"
            v-if="v$.middleName.$dirty && v$.middleName.nameValidator.$invalid"
            aria-live="assertive">Middle name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
          <Input label='Last name'
            :id="'child-last-name-' + index"
            className='mt-3'
            maxlength="30"
            @blur="handleBlurField(v$.lastName)"
            v-model='lastName'
            :inputStyle='mediumStyles' />
          <div class="text-danger"
            v-if="v$.lastName.$dirty && v$.lastName.required.$invalid"
            aria-live="assertive">Last name is required.</div>
          <div class="text-danger"
            v-if="v$.lastName.$dirty && v$.lastName.required && !v$.lastName.nameValidator"
            aria-live="assertive">Last name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.</div>
          <DateInput label='Birthdate'
            :id="'child-birth-date-' + index"
            className='mt-3'
            @blur="handleBlurField(v$.birthDate)"
            @processDate="handleProcessBirthdate($event)"
            v-model='birthDate' />
          <div class="text-danger"
            v-if="v$.birthDate.$dirty && v$.birthDate.required.$invalid"
            aria-live="assertive">Birthate is required.</div>
          <div class="text-danger"
            v-if="v$.birthDate.$dirty && v$.birthDate.dateDataValidator.$invalid"
            aria-live="assertive">Invalid birthdate.</div>
          <div class="text-danger"
            v-if="v$.birthDate.$dirty && v$.birthDate.distantPastValidator.$invalid"
            aria-live="assertive">Invalid birthdate (passt).</div>
          <div class="text-danger"
            v-if="v$.birthDate.$dirty
              && !v$.birthDate.required.$invalid
              && v$.birthDate.birthDatePastValidator.$invalid"
            aria-live="assertive">Birthdate cannot be in the future.</div>
          <div class="text-danger"
            v-if="v$.birthDate.$dirty
              && !v$.birthDate.required.$invalid
              && !v$.birthDate.birthDatePastValidator.$invalid
              && !v$.birthDate.distantPastValidator.$invalid
              && v$.birthDate.birthDateYouthValidator.$invalid"
            aria-live="assertive">A child must be less than 19 years old.</div>
          <div class="text-danger"
            v-if="v$.birthDate.$dirty
              && !v$.birthDate.required.$invalid
              && !v$.birthDate.birthDatePastValidator.$invalid
              && v$.birthDate.birthDateStudentValidator.$invalid"
            aria-live="assertive">A post-secondary student must be between 19 and 24 years.</div>
          <div v-if="requestPersonalHealthNumber">
            <PhnInput label="Personal Health Number (PHN)"
              :id="'personal-health-number-' + index"
              class="mt-3"
              placeholder="1111 111 111"
              :inputStyle="smallStyles"
              v-model="personalHealthNumber"
              @blur="handleBlurField(v$.personalHealthNumber)" />
            <div class="text-danger"
              v-if="v$.personalHealthNumber.$dirty && v$.personalHealthNumber.required.$invalid"
              aria-live="assertive">Personal Health Number is required.</div>
            <div class="text-danger"
              v-if="v$.personalHealthNumber.$dirty && (v$.personalHealthNumber.phnValidator.$invalid || v$.personalHealthNumber.phnFirstDigitValidator.$invalid)"
              aria-live="assertive">Personal Health Number is invalid.</div>
            <div class="text-danger"
              v-if="v$.personalHealthNumber.$dirty && v$.personalHealthNumber.uniquePHNValidator.$invalid"
              aria-live="assertive">This Personal Health Number (PHN) was already used for another family member. Please provide the PHN that is listed on the family member's PHN card/letter.</div>
          </div>
          <div v-if="requestGender">
            <Radio
              label='Gender'
              :id="'child-gender-' + index"
              :name="'child-gender-' + index"
              v-model='gender'
              className="mt-3"
              @blur="handleBlurField(v$.gender)"
              :items='radioGenderOptions'/>
            <div class="text-danger"
              v-if="v$.gender.$dirty && v$.gender.required.$invalid"
              aria-live="assertive">Please indicate the child's gender.</div>
          </div>
        </div>
        <div class="col-md-5 d-flex flex-column justify-content-between">
          <TipBox class="mb-3" v-if="requestAgeRange">
            <p>Tip</p>
            <p>You can include your 19 to 24 year old child on your MSP account if they are enrolled in full-time studies.</p>
            <p>If your child is 19 to 24 and not in full-time studies, they must apply separately for their own MSP coverage.</p>
            <p>If your child is 25 years or older, they must apply separately for their own MSP coverage.</p>
          </TipBox>
          <TipBox v-if="requestGender">
            <p>Tip</p>
            <p>If the gender you select does not match the gender on your supporting document(s), you must submit an Application for Change of Gender Designation or Request for Waiver of Parental Consent (Minor) below.</p>
            <p>For more information see BC Services Card: <a href="https://www2.gov.bc.ca/gov/content/governments/government-id/bc-services-card/your-card/change-personal-information" target="_blank">Change Your Personal Information</a></p>
          </TipBox>
        </div>
      </div>

      <div v-if="requestImmigrationStatus">
        <h2 class="mt-3">Child's status in Canada</h2>
        <p>Please provide child immigration status information. You will be required to upload documents to support your status in Canada.</p>
        <hr />
        <Select 
          :id="'child-status-' + index"
          :name="'child-status-' + index"
          label="Immigration status in Canada"
          class='mt-3'
          defaultOptionLabel="Please select"
          :disablePlaceholder="true"
          @blur="handleBlurField(v$.status)"
          v-model='status'
          :options='citizenshipStatusOptions'
          :inputStyle='mediumStyles'/>
        <div class="text-danger"
          v-if="v$.status.$dirty && v$.status.required.$invalid"
          aria-live="assertive">Please select the child's immigration status.</div>
        <div v-if="status === statusOptions.Citizen || status === statusOptions.PermanentResident">
          <Radio
            :id="'child-status-reason-' + index"
            :name="'child-status-reason-' + index"
            label=''
            v-model='statusReason'
            @blur="handleBlurField(v$.statusReason)"
            :items='citizenshipStatusReasonOptions' />
          <div class="text-danger"
            v-if="v$.statusReason.$dirty && v$.statusReason.required.$invalid"
            aria-live="assertive">Please select one of the above.</div>
        </div>
        <div v-if="status === statusOptions.TemporaryResident && ageRange !== childAgeTypes.Child19To24">
          <Radio
            :id="'child-status-reason' + index"
            :name="'child-status-reason' + index"
            label=''
            v-model='statusReason'
            @blur="handleBlurField(v$.statusReason)"
            :items='temporaryResidentStatusReasonOptions' />
          <div class="text-danger"
            v-if="v$.statusReason.$dirty && v$.statusReason.required.$invalid"
            aria-live="assertive">Please select one of the above.</div>
        </div>
        <div v-if="status === statusOptions.TemporaryResident && ageRange === childAgeTypes.Child19To24">
          <Radio
            :id="'child-status-reason' + index"
            :name="'child-status-reason' + index"
            label=''
            v-model='statusReason'
            @blur="handleBlurField(v$.statusReason)"
            :items='overageChildTemporaryResidentStatusReasonOptions' />
          <div class="text-danger"
            v-if="v$.statusReason.$dirty && v$.statusReason.required.$invalid"
            aria-live="assertive">Please select one of the above.</div>
        </div>
        <div v-if="statusReason !== null && statusReason !== undefined" class="mt-3">
          <h2>Documents</h2>
          <p>Provide one of the following documents to support your status in Canada. If the child's name has changed since your ID was issued you are also required to upload document to support the name change.</p>
          <hr/>
          <Select 
            label="Document Type"
            :name="'citizen-support-document-type-' + index"
            :id="'citizen-support-document-type-' + index"
            class="mb-3"
            defaultOptionLabel="Please select"
            :disablePlaceholder="true"
            v-model="citizenshipSupportDocumentType"
            @blur="handleBlurField(v$.citizenshipSupportDocumentType)"
            :options="citizenshipSupportDocumentOptions"
            :inputStyle='mediumStyles' />
          <div class="text-danger"
            v-if="v$.citizenshipSupportDocumentType.$dirty && v$.citizenshipSupportDocumentType.required.$invalid"
            aria-live="assertive">Please select one of the above.</div>
          <Radio
            label="Does the child's document that supports their status in Canada include their selected gender designation?" 
            :name="'gender-matches-' + index"
            :id="'gender-matches-' + index"
            class="mt-3"
            v-model="genderMatches"
            :items="radioOptionsNoYes"
            @blur="handleBlurField(v$.genderMatches)" />
          <div class="text-danger"
            v-if="v$.genderMatches.$dirty
              && v$.genderMatches.required.$invalid"
            aria-live="assertive">This field is required.</div>
          <div v-if="citizenshipSupportDocumentType && genderMatches">
            <h2>{{citizenshipSupportDocumentType}} {{ genderMatches === 'N' ? 'and Change of Gender Designation' : '' }}</h2>
            <hr/>
            <div class="row">
              <div class="col-md-7">
                <FileUploader v-model="citizenshipSupportDocuments"
                  :id="'child-citizenship-support-documents-' + index"
                  :isZoomPortalEnabled="true"
                  modalElementTarget="#modal-target"
                  documentType="Child citizenship support documents"
                  :description="citizenshipSupportDocumentType" />
                <div class="text-danger"
                  v-if="v$.citizenshipSupportDocuments.$dirty && v$.citizenshipSupportDocuments.required.$invalid"
                  aria-live="assertive">File upload required.</div>
              </div>
              <div class="col-md-5">
                <SampleImageTipBox :documentType="citizenshipSamples"/>
              </div>
            </div>
          </div>

          <div v-if="citizenshipSupportDocumentType && genderMatches">
            <Radio label="Has the child's name changed since their ID was issued due to marriage or legal name change?"
              :id="'name-change-' + index"
              :name="'name-change-' + index"
              class="mt-3 mb-3"
              v-model="isNameChanged"
              @blur="handleBlurField(v$.isNameChanged)"
              :items="radioOptionsNoYes" />
            <div class="text-danger"
              v-if="v$.isNameChanged.$dirty && v$.isNameChanged.required.$invalid"
              aria-live="assertive">Please indicate if the child's name changed.</div>
          </div>
          <div v-if="isNameChanged === 'Y'" class="tabbed-section">
            <h2>Additional Documents</h2>
            <p>Provide one of the required documents to support the child's name change.</p>
            <ul>
              <li>Marriage Certificate</li>
              <li>Legal Name Change Certificate</li>
            </ul>
            <hr/>
            <Select 
              label="Document Type"
              :name="'name-change-doc-type-' + index"
              :id="'name-change-doc-type-' + index"
              class="mb-3"
              defaultOptionLabel="Please select"
              :disablePlaceholder="true"
              v-model="nameChangeSupportDocumentType"
              @blur="handleBlurField(v$.nameChangeSupportDocumentType)"
              :options="nameChangeSupportDocumentOptions"
              :inputStyle='mediumStyles' />
            <div class="text-danger"
              v-if="v$.nameChangeSupportDocumentType.$dirty && v$.nameChangeSupportDocumentType.required.$invalid"
              aria-live="assertive">Please select one of the above.</div>
            <div v-if="nameChangeSupportDocumentType">
                <h2>{{nameChangeSupportDocumentType}}</h2>
                <hr/>
                <div class="row">
                  <div class="col-md-7">
                    <FileUploader class="mb-3"
                      v-model="nameChangeSupportDocuments"
                      :isZoomPortalEnabled="true"
                      modalElementTarget="#modal-target"
                      documentType="Child name change support documents"
                      :description="nameChangeSupportDocumentType" />
                    <div class="text-danger"
                      v-if="v$.nameChangeSupportDocuments.$dirty && v$.nameChangeSupportDocuments.required.$invalid"
                      aria-live="assertive">File upload required.</div>
                  </div>
                  <div class="col-md-5">
                    <SampleImageTipBox :documentType="nameChangeSupportDocumentType"/>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <div v-if="requestMovingInfo">
          <h2 class="mt-4">Moving Information</h2>
          <hr/>
          <div class="row">
              <div class="col-md-7">
              <div v-if="showLivedInBCSinceBirth">
                  <Radio 
                    label='Has the child lived in B.C. since birth?'
                    :id="'lived-in-bc-' + index"
                    :name="'lived-in-bc-' + index"
                    v-model='livedInBCSinceBirth'
                    className="mt-3"
                    @blur="handleBlurField(v$.livedInBCSinceBirth)"
                    :items='radioOptionsNoYes' />
                  <div class="text-danger"
                    v-if="v$.livedInBCSinceBirth.$dirty && v$.livedInBCSinceBirth.required.$invalid"
                    aria-live="assertive">Please indicate whether the child has lived in B.C. since birth.</div>
              </div>
              <div v-if="showOriginTextField">
                  <Input 
                    className="mt-3"
                    label="From which province or jurisdiction?"
                    maxlength="25"
                    v-model="moveFromOrigin"
                    @blur="handleBlurField(v$.moveFromOrigin)"
                    :inputStyle='mediumStyles' />
                  <div class="text-danger"
                    v-if="v$.moveFromOrigin.$dirty && v$.moveFromOrigin.required.$invalid"
                    aria-live="assertive">Province or jurisdiction of origin is required.</div>
                  <div class="text-danger"
                    v-if="v$.moveFromOrigin.$dirty && v$.moveFromOrigin.cityStateProvinceContentValidator.$invalid"
                    aria-live="assertive">Province or jurisdiction of origin must contain letters and may include numbers and special characters such as hyphens, periods, apostrophes and blank characters.</div>
              </div>
              <div v-if="showMovedPermanentlyQuestion">
                  <Radio
                    label='Has the child moved to B.C. permanently?'
                    :id="'permanent-move-' + index"
                    :name="'permanent-move-' + index"
                    v-model='madePermanentMove'
                    className="mt-3"
                    @blur="handleBlurField(v$.madePermanentMove)"
                    :items='radioOptionsNoYes'/>
                  <div class="text-danger"
                    v-if="v$.madePermanentMove.$dirty && v$.madePermanentMove.required.$invalid"
                    aria-live="assertive">Please indicate whether the child has made a permanent move to B.C.</div>
                  <div class="text-danger"
                    v-if="madePermanentMove === 'N' && status !== statusOptions.TemporaryResident"
                    aria-live="assertive">You have indicated that a recent move to B.C. is not permanent. As a result, the child is not eligible for enrolment in the Medical Services Plan. Please contact <a target="_blank" href="http://www2.gov$.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us">Health Insurance BC</a> for further information.</div>
              </div>
              <div v-if="madePermanentMove !== 'N' || status === statusOptions.TemporaryResident">
                  <div v-if="showProvinceSelector">
                  <RegionSelect
                    className="mt-3"
                    :id="'province-select-' + index"
                    :name="'province-select-' + index"
                    label="Which province is the child moving from?" 
                    v-model="moveFromOrigin"
                    :disablePlaceholder="true"
                    defaultOptionLabel="Please select a province"
                    @blur="handleBlurField(v$.moveFromOrigin)"
                    :inputStyle='mediumStyles' />
                  <div class="text-danger"
                    v-if="v$.moveFromOrigin.$dirty && v$.moveFromOrigin.required.$invalid"
                    aria-live="assertive">Province of origin is required.</div>
                  <div class="text-danger"
                    v-if="v$.moveFromOrigin.$dirty
                      && !v$.moveFromOrigin.required.$invalid
                      && v$.moveFromOrigin.nonBCValidator.$invalid"
                    aria-live="assertive">Province of origin cannot be British Columbia.</div>
                  </div>
                  <div v-if="showCountrySelector">
                    <CountrySelect 
                      className="mt-3"
                      :id="'country-select-' + index"
                      :name="'country-select-' + index"
                      label="Which jurisdiction is the child moving from?" 
                      v-model="moveFromOrigin"
                      :disablePlaceholder="true"
                      defaultOptionLabel="Please select a jurisdiction"
                      @blur="handleBlurField(v$.moveFromOrigin)"
                      :inputStyle='mediumStyles' />
                    <div class="text-danger"
                      v-if="v$.moveFromOrigin.$dirty && v$.moveFromOrigin.required.$invalid"
                      aria-live="assertive">Jursidiction of origin is required.</div>
                    <div class="text-danger"
                      v-if="v$.moveFromOrigin.$dirty
                        && !v$.moveFromOrigin.required.$invalid
                        && v$.moveFromOrigin.nonCanadaValidator.$invalid"
                      aria-live="assertive">Jursidiction of origin cannot be Canada.</div>
                  </div>
                  <div v-if="showMoveDateInputs">
                    <DateInput 
                      :label='bcMoveDateLabel'
                      :id="'bc-move-' + index"
                      :name="'bc-move-' + index"
                      className='mt-3'
                      v-model='recentBCMoveDate'
                      @blur="handleBlurField(v$.recentBCMoveDate)"
                      @processDate="handleProcessDateBCMove($event)" />
                    <div v-if="bcMoveDateLabel === 'Most recent move to B.C.'">
                      <div class="text-danger"
                        v-if="v$.recentBCMoveDate.$dirty && v$.recentBCMoveDate.required.$invalid"
                        aria-live="assertive">Most recent move to B.C. is required.</div>
                      <div class="text-danger"
                        v-if="v$.recentBCMoveDate.$dirty
                          && !v$.recentBCMoveDate.required.$invalid
                          && v$.recentBCMoveDate.dateDataValidator.$invalid"
                        aria-live="assertive">Invalid most recent move to B.C. date.</div>
                      <div class="text-danger"
                        v-if="v$.recentBCMoveDate.$dirty
                          && !v$.recentBCMoveDate.required.$invalid
                          && !v$.recentBCMoveDate.dateDataValidator.$invalid
                          && v$.recentBCMoveDate.pastDateValidator.$invalid"
                        aria-live="assertive">Most recent move to B.C. date cannot be in the future.</div>
                      <div class="text-danger"
                        v-if="v$.recentBCMoveDate.$dirty
                          && !v$.recentBCMoveDate.required.$invalid
                          && !v$.recentBCMoveDate.dateDataValidator.$invalid
                          && !v$.recentBCMoveDate.pastDateValidator.$invalid
                          && v$.recentBCMoveDate.beforeBirthdateValidator.$invalid"
                        aria-live="assertive">The child's most recent move to B.C. cannot be before the child's date of birth.</div>
                      <div class="text-danger"
                        v-if="v$.recentBCMoveDate.$dirty
                          && !v$.recentBCMoveDate.required.$invalid
                          && !v$.recentBCMoveDate.dateDataValidator.$invalid
                          && !v$.recentBCMoveDate.pastDateValidator.$invalid
                          && !v$.recentBCMoveDate.beforeBirthdateValidator.$invalid
                          && v$.recentBCMoveDate.dateOrderValidator.$invalid"
                        aria-live="assertive">The child's most recent move to B.C. cannot be before the arrival date in Canada.</div>
                    </div>
                    <div v-else>
                      <div class="text-danger"
                        v-if="v$.recentBCMoveDate.$dirty && v$.recentBCMoveDate.required.$invalid"
                        aria-live="assertive">Arrival date in B.C. is required.</div>
                      <div class="text-danger"
                        v-if="v$.recentBCMoveDate.$dirty
                          && !v$.recentBCMoveDate.required.$invalid
                          && v$.recentBCMoveDate.dateDataValidator.$invalid"
                        aria-live="assertive">Invalid arrival date in BC.</div>
                      <div class="text-danger"
                        v-if="v$.recentBCMoveDate.$dirty
                          && !v$.recentBCMoveDate.required.$invalid
                          && !v$.recentBCMoveDate.dateDataValidator.$invalid
                          && v$.recentBCMoveDate.pastDateValidator.$invalid"
                        aria-live="assertive">Arrival date in B.C. cannot be in the future.</div>
                      <div class="text-danger"
                        v-if="v$.recentBCMoveDate.$dirty
                          && !v$.recentBCMoveDate.required.$invalid
                          && !v$.recentBCMoveDate.dateDataValidator.$invalid
                          && !v$.recentBCMoveDate.pastDateValidator.$invalid
                          && v$.recentBCMoveDate.beforeBirthdateValidator.$invalid"
                        aria-live="assertive">The child's arrival date in B.C. cannot be before the child's date of birth.</div>
                      <div class="text-danger"
                        v-if="v$.recentBCMoveDate.$dirty
                          && !v$.recentBCMoveDate.required.$invalid
                          && !v$.recentBCMoveDate.dateDataValidator.$invalid
                          && !v$.recentBCMoveDate.pastDateValidator.$invalid
                          && !v$.recentBCMoveDate.beforeBirthdateValidator.$invalid
                          && v$.recentBCMoveDate.dateOrderValidator.$invalid"
                        aria-live="assertive">The child's arrival date in B.C. cannot be before the arrival date in Canada.</div>
                    </div>
                    <DateInput :label='canadaArrivalDateLabel'
                      :id="'canada-arrival-date-' + index"
                      :name="'canada-arrival-date-' + index"
                      className='mt-3'
                      v-model='canadaArrivalDate'
                      @blur="handleBlurField(v$.canadaArrivalDate)"
                      @processDate="handleProcessDateCanadaArrival($event)" />
                    <div class="text-danger"
                      v-if="canadaArrivalDateLabel === 'Arrival date in Canada'
                        && v$.canadaArrivalDate.$dirty
                        && v$.canadaArrivalDate.required.$invalid"
                      aria-live="assertive">Arrival date in Canada is required.</div>
                    <div class="text-danger"
                      v-if="v$.canadaArrivalDate.$dirty && v$.canadaArrivalDate.dateDataValidator.$invalid"
                      aria-live="assertive">Invalid Arrival date in Canada.</div>
                    <div class="text-danger"
                      v-if="v$.canadaArrivalDate.$dirty
                        && !v$.canadaArrivalDate.dateDataValidator.$invalid
                        && v$.canadaArrivalDate.pastDateValidator.$invalid"
                      aria-live="assertive">Arrival date in Canada cannot be in the future.</div>
                    <div class="text-danger"
                      v-if="v$.canadaArrivalDate.$dirty 
                        && !v$.canadaArrivalDate.dateDataValidator.$invalid
                        && !v$.canadaArrivalDate.pastDateValidator.$invalid
                        && v$.canadaArrivalDate.beforeBirthdateValidator.$invalid"
                      aria-live="assertive">The child's arrival date in Canada cannot be before the child's date of birth.</div>
                    <div class="text-danger"
                      v-if="v$.canadaArrivalDate.$dirty 
                        && !v$.canadaArrivalDate.dateDataValidator.$invalid
                        && !v$.canadaArrivalDate.pastDateValidator.$invalid
                        && !v$.canadaArrivalDate.beforeBirthdateValidator.$invalid
                        && v$.canadaArrivalDate.dateOrderValidator.$invalid"
                      aria-live="assertive">The child's arrival date in Canada cannot be after the move to B.C. date.</div>
                  </div>
                  <div v-if="showPreviousHealthNumber">
                    <Input 
                      className="mt-3"
                      :id="'health-number-' + index"
                      :name="'health-number-' + index"
                      label="Health Number from that province (optional)"
                      maxlength="50"
                      v-model="previousHealthNumber"
                      :inputStyle='mediumStyles' />
                  </div>
                  <Radio
                    label='Has the child been outside B.C. for more than 30 days in total in the past 12 months?'
                    :id="'outside-bc-' + index"
                    :name="'outside-bc-' + index"
                    v-model='outsideBCLast12Months'
                    className="mt-3"
                    @blur="handleBlurField(v$.outsideBCLast12Months)"
                    :items='radioOptionsNoYes'>
                    <template v-slot:description>
                      <span class="field-description">If the child has been living in B.C. for less than 12 months, please indicate any absences since arrival.</span>
                    </template>
                  </Radio>
                  <div class="text-danger"
                    v-if="v$.outsideBCLast12Months.$dirty && v$.outsideBCLast12Months.required.$invalid"
                    aria-live="assertive">Please indicate whether the child has been outside BC in the past 12 months.</div>
                  <div v-if="outsideBCLast12Months === 'Y'" class="tabbed-section">
                    <Input 
                      className="mt-3"
                      :id="'outside-bc-reason-' + index"
                      :name="'outside-bc-reason-' + index"
                      label="Reason for departure"
                      maxlength="20"
                      v-model="outsideBCLast12MonthsReason"
                      @blur="handleBlurField(v$.outsideBCLast12MonthsReason)"
                      :inputStyle='mediumStyles' />
                    <div class="text-danger"
                      v-if="v$.outsideBCLast12MonthsReason.$dirty && v$.outsideBCLast12MonthsReason.required.$invalid"
                      aria-live="assertive">Reason for departure is required.</div>
                    <div class="text-danger" v-if="v$.outsideBCLast12MonthsReason.$dirty && v$.outsideBCLast12MonthsReason.reasonDestinationContentValidator.$invalid" aria-live="assertive">Reason must contain letters and may include numbers and special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
                    <Input 
                      className="mt-3"
                      :id="'outside-bc-destination-' + index"
                      :name="'outside-bc-destination-' + index"
                      label="Location"
                      maxlength="20" 
                      v-model="outsideBCLast12MonthsDestination"
                      @blur="handleBlurField(v$.outsideBCLast12MonthsDestination)"
                      :inputStyle='mediumStyles' />
                    <div class="text-danger"
                      v-if="v$.outsideBCLast12MonthsDestination.$dirty && v$.outsideBCLast12MonthsDestination.required.$invalid"
                      aria-live="assertive">Location is required.</div>
                    <div class="text-danger" v-if="v$.outsideBCLast12MonthsDestination.$dirty && v$.outsideBCLast12MonthsDestination.reasonDestinationContentValidator.$invalid" aria-live="assertive">Location must contain letters and may include numbers and special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
                    <DateInput label='Departure date'
                      :id="'outside-bc-departure-' + index"
                      :name="'outside-bc-departure-' + index"
                      className='mt-3'
                      @blur="handleBlurField(v$.outsideBCLast12MonthsDepartureDate)"
                      @processDate="handleProcessDate12MonthsDeparture($event)"
                      v-model='outsideBCLast12MonthsDepartureDate' />
                    <div class="text-danger"
                      v-if="v$.outsideBCLast12MonthsDepartureDate.$dirty && v$.outsideBCLast12MonthsDepartureDate.required.$invalid"
                      aria-live="assertive">Departure date is required.</div>
                    <div class="text-danger"
                      v-if="v$.outsideBCLast12MonthsDepartureDate.$dirty && v$.outsideBCLast12MonthsDepartureDate.dateDataValidator.$invalid"
                      aria-live="assertive">Invalid departure date.</div>
                    <div class="text-danger"
                      v-if="v$.outsideBCLast12MonthsDepartureDate.$dirty && v$.outsideBCLast12MonthsDepartureDate.departureDateValidator.$invalid"
                      aria-live="assertive">Departure date must be within the last 12 months and prior to return date.</div>
                    <DateInput label='Return date'
                      :id="'outside-bc-return-' + index"
                      :name="'outside-bc-return-' + index"
                      className='mt-3'
                      @blur="handleBlurField(v$.outsideBCLast12MonthsReturnDate)"
                      @processDate="handleProcessDate12MonthsReturn($event)"
                      v-model='outsideBCLast12MonthsReturnDate' />
                    <div class="text-danger"
                      v-if="v$.outsideBCLast12MonthsReturnDate.$dirty && v$.outsideBCLast12MonthsReturnDate.required.$invalid"
                      aria-live="assertive">Return date is required.</div>
                    <div class="text-danger"
                      v-if="v$.outsideBCLast12MonthsReturnDate.$dirty && v$.outsideBCLast12MonthsReturnDate.dateDataValidator.$invalid"
                      aria-live="assertive">Invalid return date.</div>
                    <div class="text-danger"
                      v-if="v$.outsideBCLast12MonthsReturnDate.$dirty && v$.outsideBCLast12MonthsReturnDate.returnDateValidator.$invalid"
                      aria-live="assertive">Return date must be within the last 12 months and after departure date.</div>
                  </div>
                  <Radio
                    label='Does the child have a previous B.C. Personal Health Number?'
                    :id="'has-bc-health-number-' + index"
                    :name="'has-bc-health-number-' + index"
                    v-model='hasPreviousBCHealthNumber'
                    className="mt-3"
                    @blur="handleBlurField(v$.hasPreviousBCHealthNumber)"
                    :items='radioOptionsNoYes'/>
                  <div class="text-danger"
                    v-if="v$.hasPreviousBCHealthNumber.$dirty && v$.hasPreviousBCHealthNumber.required.$invalid"
                    aria-live="assertive">Please indicate whether the child has a previous BC Personal Health Number.</div>
                  <div v-if="hasPreviousBCHealthNumber === 'Y'" class="tabbed-section">
                    <PhnInput 
                      className="mt-3"
                      :id="'bc-phn-' + index"
                      :name="'bc-phn-' + index"
                      label="The child's previous B.C. Personal Health Number (optional)" 
                      v-model="previousBCHealthNumber"
                      placeholder="1111 111 111"
                      @blur="handleBlurField(v$.previousBCHealthNumber)"
                      :inputStyle='mediumStyles' />
                    <div class="text-danger"
                      v-if="v$.previousBCHealthNumber.$dirty && v$.previousBCHealthNumber.phnValidator.$invalid"
                      aria-live="assertive">Invalid Personal Health Number</div>
                  </div>
                  <div v-if="showDischargeInputs">
                    <Radio
                      label='Has the child been released from the Canadian Armed Forces or an institution?'
                      :id="'been-released-' + index"
                      :name="'been-released-' + index"
                      v-model='hasBeenReleasedFromInstitution'
                      className="mt-3"
                      @blur="handleBlurField(v$.hasBeenReleasedFromInstitution)"
                      :items='radioOptionsNoYes' />
                    <div class="text-danger"
                      v-if="v$.hasBeenReleasedFromInstitution.$dirty && v$.hasBeenReleasedFromInstitution.required.$invalid"
                      aria-live="assertive">Please indicate whether the child has been released from an institution.</div>
                  </div>
                  <div v-if="showDischargeInputs && hasBeenReleasedFromInstitution === 'Y'" class="tabbed-section">
                    <DateInput label='Discharge date'
                      :id="'discharge-date-' + index"
                      :name="'discharge-date-' + index"
                      className='mt-3'
                      @blur="handleBlurField(v$.dischargeDate)"
                      @processDate="handleProcessDateDischarge($event)"
                      v-model='dischargeDate' />
                    <div class="text-danger"
                      v-if="v$.dischargeDate.$dirty && v$.dischargeDate.required.$invalid"
                      aria-live="assertive">Discharge date is required.</div>
                    <div class="text-danger"
                      v-if="v$.dischargeDate.$dirty && v$.dischargeDate.dateDataValidator.$invalid"
                      aria-live="assertive">Invalid discharge date.</div>
                    <div class="text-danger"
                      v-if="v$.dischargeDate.$dirty && v$.dischargeDate.dischargeDateValidator.$invalid"
                      aria-live="assertive">Discharge date cannot be before the child's date of birth.</div>
                    <div class="text-danger"
                      v-if="v$.dischargeDate.$dirty && v$.dischargeDate.pastDateValidator.$invalid"
                      aria-live="assertive">Discharge date cannot be in the future.</div>
                  </div>
              </div>
            </div>
            <div class="col-md-5 mt-3">
              <TipBox>
                  <p>A permanent move means that you intend to make B.C. your primary residence for 6 months or longer.</p>
              </TipBox>
            </div>
        </div>
        <div v-if="requestSchoolInfo">
          <h2 class="mt-3">School Information</h2>
          <p class="m-0">Enter information of the school that this child is attending (must be in full time attendance)</p>
          <hr/>
          <Input label='School name'
            :id="'school-name-' + index"
            className='mt-3'
            maxlength="50"
            v-model='schoolName'
            @blur="handleBlurField(v$.schoolName)"
            :inputStyle='mediumStyles' />
          <div class="text-danger"
            v-if="v$.schoolName.$dirty && v$.schoolName.required.$invalid"
            aria-live="assertive">School name is required.</div>
          <div class="text-danger" v-if="v$.schoolName.$dirty && v$.schoolName.schoolNameContentValidator.$invalid" aria-live="assertive">School name must contain letters and may include numbers and special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
          <AddressDoctorInput v-if="isAddressValidatorEnabled && schoolCountry === 'Canada'"
            label="Full street address, rural route, PO box or general delivery"
            v-model="schoolAddressLine1"
            :id="`school-address-line1-${index}`"
            class="mt-3"
            maxlength="25"
            serviceUrl="/ahdc/api/address"
            :inputStyle='mediumStyles'
            @addressSelected="handleSchoolAddressSelected($event)"
            @blur="handleBlurField(v$.schoolAddressLine1)" />
          <Input v-else
            label="Full street address, rural route, PO box or general delivery"
            :id="'school-address-line1-' + index"
            className='mt-3'
            v-model="schoolAddressLine1"
            maxlength="25"
            @blur="handleBlurField(v$.schoolAddressLine1)"
            :inputStyle='mediumStyles' />
          <div class="text-danger" v-if="v$.schoolAddressLine1.$dirty && v$.schoolAddressLine1.required.$invalid" aria-live="assertive">Street address is required.</div>
          <div class="text-danger"
              v-if="v$.schoolAddressLine1.$dirty && v$.schoolAddressLine1.addressLineContentValidator.$invalid"
              aria-live="assertive">Full street address, rural route, PO box or general delivery must contain letters or numbers, and may include special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
          <Input label="Address Line 2 (optional)"
            :id="'school-address-line2-' + index"
            className='mt-3'
            v-model="schoolAddressLine2"
            maxlength="25"
            @blur="handleBlurField(v$.schoolAddressLine2)" 
            :inputStyle='mediumStyles' />
          <div class="text-danger"
              v-if="v$.schoolAddressLine2.$dirty && v$.schoolAddressLine2.addressLineContentValidator.$invalid"
              aria-live="assertive">Full street address, rural route, PO box or general delivery must contain letters or numbers, and may include special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
          <Input label="Address Line 3 (optional)"
            :id="'school-address-line3-' + index"
            className='mt-3'
            v-model="schoolAddressLine3"
            maxlength="25"
            @blur="handleBlurField(v$.schoolAddressLine3)"
            :inputStyle='mediumStyles' />
          <div class="text-danger"
              v-if="v$.schoolAddressLine3.$dirty && v$.schoolAddressLine3.addressLineContentValidator.$invalid"
              aria-live="assertive">Full street address, rural route, PO box or general delivery must contain letters or numbers, and may include special characters such as a hyphen, period, apostrophe, number sign, ampersand, forward slash, and blank characters.</div>
          <Input label="City"
            :id="'school-city-' + index"
            className='mt-3'
            v-model="schoolCity"
            maxlength="25"
            @blur="handleBlurField(v$.schoolCity)"
            :inputStyle='mediumStyles' />
          <div class="text-danger" v-if="v$.schoolCity.$dirty && v$.schoolCity.required.$invalid" aria-live="assertive">City is required.</div>
          <div class="text-danger" v-if="v$.schoolCity.$dirty && v$.schoolCity.cityStateProvinceContentValidator.$invalid" aria-live="assertive">City must contain letters and may include numbers and special characters such as hyphens, periods, apostrophes and blank characters.</div>
          <div v-if="schoolCountry !== 'Canada'"> 
            <Input label="Province or state"
              :id="'school-province-' + index"
              className='mt-3'
              maxlength="25"
              v-model="schoolProvinceOrState"
              @blur="handleBlurField(v$.schoolProvinceOrState)"
              :inputStyle='mediumStyles' />
            <div class="text-danger" v-if="v$.schoolProvinceOrState.$dirty && v$.schoolProvinceOrState.required.$invalid" aria-live="assertive">Province/state is required.</div>
            <div class="text-danger" v-if="v$.schoolProvinceOrState.$dirty && v$.schoolProvinceOrState.cityStateProvinceContentValidator.$invalid" aria-live="assertive">Province/state must contain letters and may include numbers and special characters such as hyphens, periods, apostrophes and blank characters.</div>
          </div>
          <div v-else>
              <RegionSelect
                className="mt-3"
                :id="'school-province-select-' + index"
                :name="'school-province-select-' + index"
                label="Province" 
                v-model="schoolProvinceOrState"
                :disablePlaceholder="true"
                defaultOptionLabel="Please select a province"
                @blur="handleBlurField(v$.schoolProvinceOrState)"
                :inputStyle='mediumStyles' />
            <div class="text-danger" v-if="v$.schoolProvinceOrState.$dirty && v$.schoolProvinceOrState.required.$invalid" aria-live="assertive">Province is required.</div>
          </div>
          <CountrySelect 
            className="mt-3"
            :id="'school-country-select-' + index"
            :name="'school-country-select-' + index"
            label="Jurisdiction" 
            v-model="schoolCountry"
            :disablePlaceholder="true"
            defaultOptionLabel="Please select a jurisdiction"
            @blur="handleBlurField(v$.schoolCountry)"
            :inputStyle='mediumStyles' />
          <div class="text-danger" v-if="v$.schoolCountry.$dirty && v$.schoolCountry.required.$invalid" aria-live="assertive">Jurisdiction is required.</div>
          <div v-if="schoolCountry === 'Canada'">
            <PostalCodeInput label="Postal Code"
              :id="'school-postal-code-' + index"
              className='mt-3'
              v-model="schoolPostalCode"
              @blur="handleBlurField(v$.schoolPostalCode)"
              :inputStyle='smallStyles' />
            <div class="text-danger" v-if="v$.schoolPostalCode.$dirty && v$.schoolPostalCode.required.$invalid" aria-live="assertive">Postal Code is required.</div>
            <div class="text-danger" v-if="v$.schoolPostalCode.$dirty && !v$.schoolPostalCode.required.$invalid && v$.schoolPostalCode.completePostalCodeValidator.$invalid" aria-live="assertive">Must be in the format A1A 1A1.</div>
          </div>
          <div v-else>
            <Input label="Postal Code or Zip Code"
              :id="'school-zip-code-' + index"
              className='mt-3'
              maxlength="20"
              v-model="schoolPostalCode"
              @blur="handleBlurField(v$.schoolPostalCode)"
              :inputStyle='mediumStyles' />
            <div class="text-danger" v-if="v$.schoolPostalCode.$dirty && v$.schoolPostalCode.required.$invalid" aria-live="assertive">Postal/Zip Code is required.</div>
            <div class="text-danger" v-if="v$.schoolPostalCode.$dirty && v$.schoolPostalCode.specialCharacterValidator.$invalid" aria-live="assertive">Postal/Zip Code cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
          </div>
          <DateInput label="Original departure date from B.C. (if school is outside B.C.)"
            :id="'school-departure-date-' + index"
            class="mt-3"
            v-model="schoolDepartureDate"
            @blur="handleBlurField(v$.schoolDepartureDate)"
            @processDate="handleProcessDateSchoolDeparture($event)" />
          <div class="text-danger" v-if="schoolProvinceOrState !== 'British Columbia' && v$.schoolDepartureDate.$dirty && v$.schoolDepartureDate.required.$invalid" aria-live="assertive">School departure date is required.</div>
          <div class="text-danger" v-if="v$.schoolDepartureDate.$dirty && v$.schoolDepartureDate.dateDataValidator.$invalid" aria-live="assertive">Invalid school departure date.</div>
          <div class="text-danger" v-if="v$.schoolDepartureDate.$dirty && v$.schoolDepartureDate.pastDateValidator.$invalid" aria-live="assertive">School departure date cannot be in the future.</div>
          <DateInput label="Expected school completion date"
            :id="'school-completion-date-' + index"
            class="mt-3"
            v-model="schoolCompletionDate"
            @blur="handleBlurField(v$.schoolCompletionDate)"
            @processDate="handleProcessDateSchoolCompletion($event)" />
          <div class="text-danger"
            v-if="v$.schoolCompletionDate.$dirty
                && v$.schoolCompletionDate.required.$invalid"
            aria-live="assertive">Expected school completion date is required.</div>
          <div class="text-danger" v-if="v$.schoolCompletionDate.$dirty && v$.schoolCompletionDate.dateDataValidator.$invalid" aria-live="assertive">Invalid estimated school completion date.</div>
          <div class="text-danger" v-if="v$.schoolCompletionDate.$dirty && v$.schoolCompletionDate.futureDateValidator.$invalid" aria-live="assertive">Estimated school completion date cannot be in the past.</div>
          <Radio label="Will the child reside in BC after completing their studies?"
            class="mt-3"
            :id="'will-reside-in-bc-after-studies-' + index"
            :name="'will-reside-in-bc-after-studies-' + index"
            v-model="willResideInBCAfterStudies"
            :items="radioOptionsNoYes"
            @blur="handleBlurField(v$.willResideInBCAfterStudies)"/>
          <div class="text-danger"
            v-if="v$.willResideInBCAfterStudies.$dirty
                && v$.willResideInBCAfterStudies.required.$invalid"
            aria-live="assertive">This field is required.</div>
            <div class="text-danger"
              v-if="v$.willResideInBCAfterStudies.$dirty
                  && v$.willResideInBCAfterStudies.permanentMoveValidator.$invalid"
              aria-live="assertive">To qualify for provincial health care benefits a person must be a resident of B.C. As you intend to leave B.C. when your studies are completed, you are not eligible for Medical Services Plan coverage. Please contact the health care plan in your home province for information about medical coverage while studying in B.C.</div>
        </div>
        </div>
      </div>
    </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import {
  dateDataRequiredValidator,
  dateDataValidator,
  nameValidator,
  nonBCValidator,
  nonCanadaValidator,
  reasonDestinationContentValidator,
  pastDateValidator,
  phnFirstDigitValidator,
} from '@/helpers/validators';
import {
  AddressDoctorInput,
  CountrySelect,
  RegionSelect,
  Select,
  Radio,
  Input,
  DateInput,
  PhnInput,
  PostalCodeInput,
  FileUploader,
  optionalValidator,
  futureDateValidator,
  distantPastValidator,
  getProvinceNameByCode,
  phnValidator,
  replaceSpecialCharacters,
  specialCharacterValidator,
  truncateAddressLines,
} from 'common-lib-vue';
import {
  required
} from '@vuelidate/validators';
import {
  addYears,
  isSameDay,
  startOfToday,
  subDays,
  subYears,
  addDays,
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
  radioOptionsChildAge,
  radioOptionsCitizenStatusReasons, 
  radioOptionsTemporaryResidentStatusReasons,
  radioOptionsOverageChildTemporaryResidentStatusReasons,
  radioOptionsGender,
} from '@/constants/radio-options';
import { 
  StatusInCanada,
  CanadianStatusReasons, 
} from '@/constants/immigration-status-types';
import { SupportDocumentTypes } from '@/constants/document-types';
import { ChildAgeTypes } from '../../constants/child-age-types';
import { isAfter, isBefore } from 'date-fns/esm';
import TipBox from '@/components/TipBox.vue';
import SampleImageTipBox from '@/components/SampleImageTipBox.vue';
import { mediumStyles, smallStyles } from '@/constants/input-styles';
import spaEnvService from '@/services/spa-env-service';

const birthDatePastValidator = (value) => {
  return pastDateValidator(value) || isSameDay(value, startOfToday());
};

const birthDateYouthValidator = (value, vm) => {
  if (vm.ageRange === ChildAgeTypes.Child0To18) {
    return isAfter(value, addYears(startOfToday(), -19));
  }

  return true;
};
            
const birthDateStudentValidator = (value, vm) => {
  if (vm.ageRange === ChildAgeTypes.Child19To24) {
    return isAfter(value, addYears(startOfToday(), -25)) && isBefore(value, addDays(addYears(startOfToday(), -19), 1));
  }

  return true;
};

const beforeBirthdateValidator = (value, vm) => {
  if (vm.birthDate && vm.birthDate.getTime() > value.getTime()) {
    return false;
  } 

  return true;
};

const dateOrderValidator = (value, vm) => {
  if (!value) {
    return false;
  }

  if(vm.birthDate) {
    if (vm.birthDate.getTime() > value.getTime()) {
      return false;
    }

    if(!vm.canadaArrivalDate || !vm.recentBCMoveDate) {
      return true;
    }
  }

  if (vm.recentBCMoveDate && vm.canadaArrivalDate){
    return vm.recentBCMoveDate.getTime() >= vm.canadaArrivalDate.getTime();
  }

  return true;
};

const departureDateValidator = (value, vm) => {
  const past12Months = subYears(subDays(startOfToday(), 1), 1);
  const returnDate = vm.outsideBCLast12MonthsReturnDate;
  return isAfter(value, past12Months) // Is within the last 12 months
      && (!returnDate || isBefore(value, addDays(returnDate, 1))) // Is before or equal to return date
      && isBefore(value, startOfToday()); // Is before or equal to date today
};

const returnDateValidator = (value, vm) => {
  const past12Months = subYears(subDays(startOfToday(), 1), 1);
  const departureDate = vm.outsideBCLast12MonthsDepartureDate;
  return isAfter(value, past12Months) // Is within the last 12 months
      && (!departureDate || isAfter(value, subDays(departureDate, 1))) // Is after or equal to departure date
      && isBefore(value, startOfToday()); // Is before or equal to date today
};

const dischargeDateValidator = (value, vm) => {
  if(vm.birthDate && vm.birthDate.getTime() > value.getTime()) {
    return false;
  }

  return true;
};

const permanentMoveValidator = (value, vm) => {
  return value === 'Y' || (vm && vm.status === StatusInCanada.TemporaryResident);
};

const completePostalCodeValidator = (value) => {
  if (value === "" || value === null) {
    // Don't show error if field is blank.
    return true;
  }
  return value.length === 7;
};

const schoolNameContentValidator = (value) => {
  if (value === "" || value === null || value === undefined) {
    // Don't show content error if field is blank.
    return true;
  }
  const criteriaAllowedCharecters = /^[0-9a-zA-Z-.'#& /]*$/;
  const criteriaMustHaveLetter = /.*[a-z].*/i;
  return criteriaAllowedCharecters.test(value)
          && criteriaMustHaveLetter.test(value);
};

const addressLineContentValidator = (value) => {
  if (value === "" || value === null || value === undefined) {
    // Don't show content error if field is blank.
    return true;
  }
  const criteriaAllowedCharecters = /^[0-9a-zA-Z-.'#& /]*$/;
  const criteriaMustHaveLetterOrNumber = /.*[a-z0-9].*/i;
  return criteriaAllowedCharecters.test(value) && criteriaMustHaveLetterOrNumber.test(value);
};

const cityStateProvinceContentValidator = (value) => {
  if (value === "" || value === null || value === undefined) {
    // Don't show content error if field is blank.
    return true;
  }
  const criteriaAllowedCharecters = /^[0-9a-zA-Z-.' ]*$/;
  const criteriaMustHaveLetter = /.*[a-z].*/i;
  return criteriaAllowedCharecters.test(value)
          && criteriaMustHaveLetter.test(value);
};

const uniquePHNValidator = (value, vm) => {
  const phns = vm.usedPHNs.filter((phn) => phn === value);
  return !!value && phns.length <= 1;
};

export default {
  name: 'ChildItem',
  mixins: [pageContentMixin],
  components: {
    AddressDoctorInput,
    CountrySelect,
    RegionSelect,
    Select,
    Radio,
    Input,
    DateInput,
    PhnInput,
    FileUploader,
    TipBox,
    SampleImageTipBox,
    PostalCodeInput,
  },
  props: {
      childData: Object,
      index: Number,
      usedPHNs: {
        type: Array,
        default: () => {
          return [];
        }
      }
  },
  setup () {
    return { v$: useVuelidate() }
  },
  data: () => {
    return {
      pageLoaded: false,
      // Radio and select options
      radioChildAgeOptions: radioOptionsChildAge,
      radioGenderOptions: radioOptionsGender,
      radioOptionsNoYes: radioOptionsNoYes,
      statusOptions: StatusInCanada,
      canadianStatusReasons: CanadianStatusReasons,
      childAgeTypes: ChildAgeTypes,
      citizenshipStatusOptions: selectOptionsImmigrationStatus,
      citizenshipStatusReasonOptions: radioOptionsCitizenStatusReasons,
      nameChangeSupportDocumentOptions: selectOptionsNameChangeSupportDocuments,
      temporaryResidentStatusReasonOptions: radioOptionsTemporaryResidentStatusReasons,
      overageChildTemporaryResidentStatusReasonOptions: radioOptionsOverageChildTemporaryResidentStatusReasons,
      mediumStyles: mediumStyles,
      smallStyles: smallStyles,
      // Data to be saved
      collapsed: false,
        
      ageRange: null,
      firstName: null,
      middleName: null,
      lastName: null,
      birthDate: null,
      birthDateData: null,
      personalHealthNumber: null,
      gender: null,
      
      status: null,
      statusReason: null,
      citizenshipSupportDocumentType: null,
      genderMatches: null,
      citizenshipSupportDocuments: [],
      isNameChanged: null,
      nameChangeSupportDocumentType: null,
      nameChangeSupportDocuments: [],
      
      moveFromOrigin: null,
      livedInBCSinceBirth: null,
      previousHealthNumber: null,
      recentBCMoveDate: null,
      recentBCMoveDateData: null,
      canadaArrivalDate: null,
      canadaArrivalDateData: null,
      madePermanentMove: null,
      outsideBCLast12Months: null,
      outsideBCLast12MonthsReason: null,
      outsideBCLast12MonthsDestination: null,
      outsideBCLast12MonthsDepartureDate: null,
      outsideBCLast12MonthsDepartureDateData: null,
      outsideBCLast12MonthsReturnDate: null,
      outsideBCLast12MonthsReturnDateData: null,
      hasPreviousBCHealthNumber: null,
      previousBCHealthNumber: null,
      hasBeenReleasedFromInstitution: null,
      dischargeDate: null,
      dischargeDateData: null,
      
      schoolName: null,
      schoolAddressLine1: null,
      schoolAddressLine2: null,
      schoolAddressLine3: null,
      schoolCity: null,
      schoolProvinceOrState: null,
      schoolCountry: null,
      schoolPostalCode: null,
      schoolDepartureDate: null,
      schoolDepartureDateData: null,
      schoolCompletionDate: null,
      schoolCompletionDateData: null,
      willResideInBCAfterStudies: null,
    };
  },
  created() {
    setTimeout(() => {
      this.pageLoaded = true;
    }, 0);

    this.collapsed = this.childData.collapsed;
    this.ageRange = this.childData.ageRange;
    this.firstName = this.childData.firstName;
    this.middleName = this.childData.middleName;
    this.lastName = this.childData.lastName;
    this.birthDate = this.childData.birthDate;
    this.personalHealthNumber = this.childData.personalHealthNumber;
    this.gender = this.childData.gender;
    this.status = this.childData.status;
    this.statusReason = this.childData.statusReason;
    this.citizenshipSupportDocumentType = this.childData.citizenshipSupportDocumentType;
    this.genderMatches = this.childData.genderMatches;
    this.citizenshipSupportDocuments = this.childData.citizenshipSupportDocuments;
    this.isNameChanged = this.childData.isNameChanged;
    this.nameChangeSupportDocumentType = this.childData.nameChangeSupportDocumentType;
    this.nameChangeSupportDocuments = this.childData.nameChangeSupportDocuments;
        
    this.moveFromOrigin = this.childData.moveFromOrigin;
    this.livedInBCSinceBirth = this.childData.livedInBCSinceBirth;
    this.previousHealthNumber = this.childData.previousHealthNumber;
    this.recentBCMoveDate = this.childData.recentBCMoveDate;
    this.canadaArrivalDate = this.childData.canadaArrivalDate;
    this.madePermanentMove = this.childData.madePermanentMove;
    this.outsideBCLast12Months = this.childData.outsideBCLast12Months;
    this.outsideBCLast12MonthsReason = this.childData.outsideBCLast12MonthsReason;
    this.outsideBCLast12MonthsDestination = this.childData.outsideBCLast12MonthsDestination;
    this.outsideBCLast12MonthsDepartureDate = this.childData.outsideBCLast12MonthsDepartureDate;
    this.outsideBCLast12MonthsReturnDate = this.childData.outsideBCLast12MonthsReturnDate;
    this.hasPreviousBCHealthNumber = this.childData.hasPreviousBCHealthNumber;
    this.previousBCHealthNumber = this.childData.previousBCHealthNumber;
    this.hasBeenReleasedFromInstitution = this.childData.hasBeenReleasedFromInstitution;
    this.dischargeDate = this.childData.dischargeDate;
        
    this.schoolName = this.childData.schoolName;
    this.schoolAddressLine1 = this.childData.schoolAddressLine1;
    this.schoolAddressLine2 = this.childData.schoolAddressLine2;
    this.schoolAddressLine3 = this.childData.schoolAddressLine3;
    this.schoolCity = this.childData.schoolCity;
    this.schoolProvinceOrState = this.childData.schoolProvinceOrState;
    this.schoolCountry = this.childData.schoolCountry ? this.childData.schoolCountry : 'Canada';
    this.schoolPostalCode = this.childData.schoolPostalCode;
    this.schoolDepartureDate = this.childData.schoolDepartureDate;
    this.schoolCompletionDate = this.childData.schoolCompletionDate;
    this.willResideInBCAfterStudies = this.childData.willResideInBCAfterStudies;
  },
  validations() {
    const validations = {
      ageRange: {},
      firstName: {
        required,
        nameValidator,
      },
      middleName: {
        nameValidator: optionalValidator(nameValidator),
      },
      lastName: {
        required,
        nameValidator,
      },
      birthDate: {
        required: dateDataRequiredValidator(this.birthDateData),
        dateDataValidator: dateDataValidator(this.birthDateData),
        distantPastValidator: optionalValidator(distantPastValidator),
        birthDatePastValidator: optionalValidator(birthDatePastValidator),
        birthDateYouthValidator: optionalValidator(birthDateYouthValidator),
        birthDateStudentValidator: optionalValidator(birthDateStudentValidator),
      },
      personalHealthNumber: {},
      gender: {},
      status: {},
      statusReason: {},
      citizenshipSupportDocumentType: {},
      genderMatches: {},
      citizenshipSupportDocuments: {},
      isNameChanged: {},
      nameChangeSupportDocumentType: {},
      nameChangeSupportDocuments: {},
      livedInBCSinceBirth: {},
      madePermanentMove: {},
      moveFromOrigin: {},
      previousHealthNumber: {},
      recentBCMoveDate: {},
      canadaArrivalDate: {},
      outsideBCLast12Months: {},
      outsideBCLast12MonthsReason: {},
      outsideBCLast12MonthsDestination: {},
      outsideBCLast12MonthsDepartureDate: {},
      outsideBCLast12MonthsReturnDate: {},
      hasPreviousBCHealthNumber: {},
      previousBCHealthNumber: {},
      hasBeenReleasedFromInstitution: {},
      dischargeDate: {},
      schoolName: {},
      schoolAddressLine1: {},
      schoolAddressLine2: {},
      schoolAddressLine3: {},
      schoolCity: {},
      schoolProvinceOrState: {},
      schoolCountry: {},
      schoolPostalCode: {},
      schoolDepartureDate: {},
      schoolCompletionDate: {},
      willResideInBCAfterStudies: {},
    }

    if (this.requestAgeRange) {
      validations.ageRange.required = required;
    }

    if (this.requestPersonalHealthNumber) {
      validations.personalHealthNumber.required = required;
      validations.personalHealthNumber.phnValidator = optionalValidator(phnValidator);
      validations.personalHealthNumber.phnFirstDigitValidator = optionalValidator(phnFirstDigitValidator);
      validations.personalHealthNumber.uniquePHNValidator = optionalValidator(uniquePHNValidator);
    }
    
    if (this.requestGender) {
      validations.gender.required = required;
    }

    if (this.requestImmigrationStatus) {
      validations.status.required = required;
      validations.statusReason.required = required;
      validations.citizenshipSupportDocumentType.required = required;
      validations.genderMatches.required = required;
      validations.citizenshipSupportDocuments.required = required;
      validations.isNameChanged.required = required;
      validations.madePermanentMove.required = required;
      validations.madePermanentMove.permanentMoveValidator = optionalValidator(permanentMoveValidator);
      validations.outsideBCLast12Months.required = required;
      validations.hasPreviousBCHealthNumber.required = required;

      if (this.isNameChanged === 'Y') {
        validations.nameChangeSupportDocumentType.required = required;
        validations.nameChangeSupportDocuments.required = required;
      }

      if (this.showLivedInBCSinceBirth) {
        validations.livedInBCSinceBirth.required = required;
      }

      if (this.showOriginTextField) {
        validations.moveFromOrigin.required = required;
        validations.moveFromOrigin.cityStateProvinceContentValidator = cityStateProvinceContentValidator;
      }

      if (this.showProvinceSelector) {
        validations.moveFromOrigin.required = required;
        validations.moveFromOrigin.nonBCValidator = nonBCValidator;
      }
      
      if (this.showCountrySelector) {
        validations.moveFromOrigin.required = required;
        validations.moveFromOrigin.nonCanadaValidator = nonCanadaValidator;
      }

      if (this.showMoveDateInputs) {
        validations.recentBCMoveDate.required = dateDataRequiredValidator(this.recentBCMoveDateData);
        validations.recentBCMoveDate.dateDataValidator = dateDataValidator(this.recentBCMoveDateData);
        validations.recentBCMoveDate.dateOrderValidator = dateOrderValidator;
        validations.recentBCMoveDate.beforeBirthdateValidator = beforeBirthdateValidator;
        validations.recentBCMoveDate.pastDateValidator = optionalValidator(pastDateValidator);
        
        validations.canadaArrivalDate.required = this.canadaArrivalDateLabel === 'Arrival date in Canada' ? dateDataRequiredValidator(this.canadaArrivalDateData) : () => true,
        validations.canadaArrivalDate.dateDataValidator = dateDataValidator(this.canadaArrivalDateData);
        validations.canadaArrivalDate.dateOrderValidator = optionalValidator(dateOrderValidator);
        validations.canadaArrivalDate.beforeBirthdateValidator = optionalValidator(beforeBirthdateValidator);
        validations.canadaArrivalDate.pastDateValidator = optionalValidator(pastDateValidator);
      }

      if (this.outsideBCLast12Months === 'Y') {
        validations.outsideBCLast12MonthsReason.required = required;
        validations.outsideBCLast12MonthsReason.reasonDestinationContentValidator = reasonDestinationContentValidator;
        validations.outsideBCLast12MonthsDestination.required = required;
        validations.outsideBCLast12MonthsDestination.reasonDestinationContentValidator = reasonDestinationContentValidator;
        validations.outsideBCLast12MonthsDepartureDate.required = dateDataRequiredValidator(this.outsideBCLast12MonthsDepartureDateData);
        validations.outsideBCLast12MonthsDepartureDate.dateDataValidator = dateDataValidator(this.outsideBCLast12MonthsDepartureDateData);
        validations.outsideBCLast12MonthsDepartureDate.departureDateValidator = optionalValidator(departureDateValidator);

        validations.outsideBCLast12MonthsReturnDate.required = dateDataRequiredValidator(this.outsideBCLast12MonthsReturnDateData);
        validations.outsideBCLast12MonthsReturnDate.dateDataValidator = dateDataValidator(this.outsideBCLast12MonthsReturnDateData);
        validations.outsideBCLast12MonthsReturnDate.returnDateValidator = optionalValidator(returnDateValidator); 
      }

      if (this.hasPreviousBCHealthNumber === 'Y') {
        validations.previousBCHealthNumber.phnValidator = optionalValidator(phnValidator);
      }

      if (this.showDischargeInputs) {
        validations.hasBeenReleasedFromInstitution.required = required;
        
        if (this.hasBeenReleasedFromInstitution === 'Y') {
          validations.dischargeDate.required = dateDataRequiredValidator(this.dischargeDateData);
          validations.dischargeDate.dateDataValidator = dateDataValidator(this.dischargeDateData);
          validations.dischargeDate.dischargeDateValidator = optionalValidator(dischargeDateValidator);
          validations.dischargeDate.pastDateValidator = optionalValidator(pastDateValidator);
        }
      }
    }

    if (this.requestSchoolInfo) {
      validations.schoolName.required = required;
      validations.schoolName.schoolNameContentValidator = schoolNameContentValidator;
      validations.schoolAddressLine1.required = required;
      validations.schoolAddressLine1.addressLineContentValidator = addressLineContentValidator;
      validations.schoolAddressLine2.addressLineContentValidator = addressLineContentValidator;
      validations.schoolAddressLine3.addressLineContentValidator = addressLineContentValidator;
      validations.schoolCity.required = required;
      validations.schoolCity.cityStateProvinceContentValidator = cityStateProvinceContentValidator;
      validations.schoolProvinceOrState.required = required;
      validations.schoolProvinceOrState.cityStateProvinceContentValidator = cityStateProvinceContentValidator;
      validations.schoolCountry.required = required;
      validations.schoolPostalCode.required = required;

      if (this.schoolCountry === 'Canada') {
        validations.schoolPostalCode.completePostalCodeValidator = completePostalCodeValidator;
      } else {
        validations.schoolPostalCode.specialCharacterValidator = optionalValidator(specialCharacterValidator);
      }

      validations.schoolDepartureDate.dateDataValidator = dateDataValidator(this.schoolDepartureDateData);
      validations.schoolDepartureDate.pastDateValidator = optionalValidator(pastDateValidator);

      if (this.schoolProvinceOrState !== 'British Columbia') {
        validations.schoolDepartureDate.required = dateDataRequiredValidator(this.schoolDepartureDateData);
      }

      validations.schoolCompletionDate.required = dateDataRequiredValidator(this.schoolCompletionDateData);
      validations.schoolCompletionDate.dateDataValidator = dateDataValidator(this.schoolCompletionDateData);
      validations.schoolCompletionDate.futureDateValidator = optionalValidator(futureDateValidator);

      validations.willResideInBCAfterStudies.required = required;
      validations.willResideInBCAfterStudies.permanentMoveValidator = optionalValidator(permanentMoveValidator);
    }
    
    return validations;
  },
  methods: {
    saveData() {
      if (this.pageLoaded) {
        const childData = {
          collapsed: this.collapsed,
          ageRange: this.ageRange,
          firstName: this.firstName,
          middleName: this.middleName,
          lastName: this.lastName,
          birthDate: this.birthDate,
          personalHealthNumber: this.personalHealthNumber,
          gender: this.gender,
          
          status: this.status,
          statusReason: this.statusReason,
          citizenshipSupportDocumentType: this.citizenshipSupportDocumentType,
          genderMatches: this.genderMatches,
          citizenshipSupportDocuments: this.citizenshipSupportDocuments,
          isNameChanged: this.isNameChanged,
          nameChangeSupportDocumentType: this.nameChangeSupportDocumentType,
          nameChangeSupportDocuments: this.nameChangeSupportDocuments,
          
          moveFromOrigin: this.moveFromOrigin,
          livedInBCSinceBirth: this.livedInBCSinceBirth,
          previousHealthNumber: this.previousHealthNumber,
          recentBCMoveDate: this.recentBCMoveDate,
          canadaArrivalDate: this.canadaArrivalDate,
          madePermanentMove: this.madePermanentMove,
          outsideBCLast12Months: this.outsideBCLast12Months,
          outsideBCLast12MonthsReason: this.outsideBCLast12MonthsReason,
          outsideBCLast12MonthsDestination: this.outsideBCLast12MonthsDestination,
          outsideBCLast12MonthsDepartureDate: this.outsideBCLast12MonthsDepartureDate,
          outsideBCLast12MonthsReturnDate: this.outsideBCLast12MonthsReturnDate,
          hasPreviousBCHealthNumber: this.hasPreviousBCHealthNumber,
          previousBCHealthNumber: this.previousBCHealthNumber,
          hasBeenReleasedFromInstitution: this.hasBeenReleasedFromInstitution,
          dischargeDate: this.dischargeDate,
          
          schoolName: this.schoolName,
          schoolAddressLine1: this.schoolAddressLine1,
          schoolAddressLine2: this.schoolAddressLine2,
          schoolAddressLine3: this.schoolAddressLine3,
          schoolCity: this.schoolCity,
          schoolProvinceOrState: this.schoolProvinceOrState,
          schoolCountry: this.schoolCountry,
          schoolPostalCode: this.schoolPostalCode,
          schoolDepartureDate: this.schoolDepartureDate,
          schoolCompletionDate: this.schoolCompletionDate,
          willResideInBCAfterStudies: this.willResideInBCAfterStudies,
        };

        this.$emit('updateChild', childData);
      }
    },
    handleBlurField(validationObject) {
      if (validationObject) {
        validationObject.$touch();
      }
    },
    handleProcessBirthdate(data) {
      this.birthDateData = data;
    },
    handleProcessDateBCMove(data) {
      this.recentBCMoveDateData = data;
    },
    handleProcessDateCanadaArrival(data) {
      this.canadaArrivalDateData = data;
    },
    handleProcessDate12MonthsDeparture(data) {
      this.outsideBCLast12MonthsDepartureDateData = data;
    },
    handleProcessDate12MonthsReturn(data) {
      this.outsideBCLast12MonthsReturnDateData = data;
    },
    handleProcessDateDischarge(data) {
      this.dischargeDateData = data;
    },
    handleProcessDateSchoolDeparture(data) {
      this.schoolDepartureDateData = data;
    },
    handleProcessDateSchoolCompletion(data) {
      this.schoolCompletionDateData = data;
    },
    handleSchoolAddressSelected(address) {
      const addressLines = truncateAddressLines(address.addressLines, 25);

      // Remove all address lines.
      for (let i=0; i<3; i++) {
        this[`schoolAddressLine${i+1}`] = null;
      }
      // Add new address lines.
      for (let i=0; i<(addressLines.length <= 3 ? addressLines.length : 3); i++) {
        this[`schoolAddressLine${i+1}`] = replaceSpecialCharacters(addressLines[i]);
      }
      this.schoolCountry = replaceSpecialCharacters(address.country);
      this.schoolProvinceOrState = getProvinceNameByCode(address.province);
      this.schoolCity = typeof address.city === 'string' ? replaceSpecialCharacters(address.city).substring(0, 25) : null;
      this.schoolPostalCode = replaceSpecialCharacters(address.postalCode);
    }
  },
  watch: {
    ageRange() {
      if (this.pageLoaded) {
        this.statusReason = null;
        this.v$.statusReason.$reset();
        
        this.saveData();
      }
    },
    firstName() {
      this.saveData();
    },
    middleName() {
      this.saveData();
    },
    lastName() {
      this.saveData();
    },
    birthDate() {
      this.saveData();
    },
    personalHealthNumber() {
      this.saveData();
    },
    gender() {
      this.saveData();
    },
    status() {
      if (this.pageLoaded) {
        this.statusReason = null;
        this.v$.statusReason.$reset();

        this.saveData();
      }
    },
    statusReason() {
      if (this.pageLoaded) {
        this.citizenshipSupportDocumentType = null;
        this.genderMatches = null;
        this.citizenshipSupportDocuments = [];
        this.isNameChanged = null;
        this.livedInBCSinceBirth = null;
        this.previousHealthNumber = null;
        this.madePermanentMove = null;
        this.moveFromOrigin = null;
        this.recentBCMoveDate = null;
        this.canadaArrivalDate = null;
        this.outsideBCLast12Months = null;
        this.hasPreviousBCHealthNumber = null;
        this.hasBeenReleasedFromInstitution = null;

        this.v$.citizenshipSupportDocumentType.$reset();
        this.v$.genderMatches.$reset();
        this.v$.citizenshipSupportDocuments.$reset();
        this.v$.isNameChanged.$reset();
        this.v$.livedInBCSinceBirth.$reset();
        this.v$.madePermanentMove.$reset();
        this.v$.moveFromOrigin.$reset();
        this.v$.recentBCMoveDate.$reset();
        this.v$.canadaArrivalDate.$reset();
        this.v$.outsideBCLast12Months.$reset();
        this.v$.hasPreviousBCHealthNumber.$reset();
        this.v$.hasBeenReleasedFromInstitution.$reset();

        this.saveData();
      }
    },
    citizenshipSupportDocumentType() {
      if (this.pageLoaded) {
        this.citizenshipSupportDocuments = [];
        this.v$.citizenshipSupportDocuments.$reset();
        
        this.saveData();
      }
    },
    genderMatches() {
      this.saveData();
    },
    citizenshipSupportDocuments() {
      this.saveData();
    },
    isNameChanged() {
      if (this.pageLoaded) {
        this.nameChangeSupportDocumentType = null;
        this.v$.nameChangeSupportDocumentType.$reset();
      
        this.saveData();
      }
    },
    nameChangeSupportDocumentType() {
      if (this.pageLoaded) {
        this.nameChangeSupportDocuments = [];
        this.v$.nameChangeSupportDocuments.$reset();
             
        this.saveData();
      }
    },
    nameChangeSupportDocuments() {
      this.saveData();
    },
    moveFromOrigin() {
      this.saveData();
    },
    livedInBCSinceBirth() {
      if (this.pageLoaded) {
        this.moveFromOrigin = null;
        this.canadaArrivalDate = null;
        this.recentBCMoveDate = null;
        this.v$.moveFromOrigin.$reset();
        this.v$.canadaArrivalDate.$reset();
        this.v$.recentBCMoveDate.$reset();
             
        this.saveData();
      }
    },
    previousHealthNumber() {
      this.saveData();
    },
    recentBCMoveDate() {
      this.saveData();
    },
    canadaArrivalDate() {
      this.saveData();
    },
    madePermanentMove() {
      this.saveData();
    },
    outsideBCLast12Months() {
      if (this.pageLoaded) {
        this.outsideBCLast12MonthsReason = null;
        this.outsideBCLast12MonthsDestination = null;
        this.outsideBCLast12MonthsDepartureDate = null;
        this.outsideBCLast12MonthsReturnDate = null;
        this.v$.outsideBCLast12MonthsReason.$reset();
        this.v$.outsideBCLast12MonthsDestination.$reset();
        this.v$.outsideBCLast12MonthsDepartureDate.$reset();
        this.v$.outsideBCLast12MonthsReturnDate.$reset();
             
        this.saveData();
      }
    },
    outsideBCLast12MonthsReason() {
      this.saveData();
    },
    outsideBCLast12MonthsDestination() {
      this.saveData();
    },
    outsideBCLast12MonthsDepartureDate() {
      this.saveData();
    },
    outsideBCLast12MonthsReturnDate() {
      this.saveData();
    },
    hasPreviousBCHealthNumber() {
      if (this.pageLoaded) {
        this.previousBCHealthNumber = null;
        this.v$.previousBCHealthNumber.$reset();
             
        this.saveData();
      }
    },
    previousBCHealthNumber() {
      this.saveData();
    },
    hasBeenReleasedFromInstitution() {
      if (this.pageLoaded) {
        this.dischargeDate = null;
        this.v$.dischargeDate.$reset();
             
        this.saveData();
      }
    },
    dischargeDate() {
      this.saveData();
    },
    schoolName() {
      this.saveData();
    },
    schoolAddressLine1() {
      this.saveData();
    },
    schoolAddressLine2() {
      this.saveData();
    },
    schoolAddressLine3() {
      this.saveData();
    },
    schoolCity() {
      this.saveData();
    },
    schoolProvinceOrState() {
      this.saveData();
    },
    schoolCountry(newVal, oldVal) {
      // If they switch countries, make them reselect province / state
      if (this.pageLoaded && newVal !== oldVal) {
        this.schoolProvinceOrState = null;
      }

      this.saveData();
    },
    schoolPostalCode() {
      this.saveData();
    },
    schoolDepartureDate() {
      this.saveData();
    },
    schoolCompletionDate() {
      this.saveData();
    },
    willResideInBCAfterStudies() {
      this.saveData();
    },
  },
  computed: {
    requestAgeRange() {
      return this.$store.state.enrolmentModule.isApplyingForMSP;
    },
    requestGender() {
      return this.$store.state.enrolmentModule.isApplyingForMSP;
    },
    requestPersonalHealthNumber() {
      return !this.$store.state.enrolmentModule.isApplyingForMSP;
    },
    requestImmigrationStatus() {
      return this.$store.state.enrolmentModule.isApplyingForMSP;
    },
    requestMovingInfo() {
      return this.$store.state.enrolmentModule.isApplyingForMSP
        && this.citizenshipSupportDocuments.length > 0 
        && (this.isNameChanged === 'N' || this.nameChangeSupportDocuments.length > 0);
    },
    requestSchoolInfo() {
      return this.$store.state.enrolmentModule.isApplyingForMSP
        && this.ageRange === this.childAgeTypes.Child19To24;
    },
    citizenshipSupportDocumentOptions() {
      let options;

      if (this.status === StatusInCanada.PermanentResident) {
        options = selectOptionsPermanentResidentSupportDocuments;
      } else if (this.status === StatusInCanada.TemporaryResident){
        if (this.statusReason === CanadianStatusReasons.WorkingInBC) {
          options = selectOptionWorkPermitSupportDocument;
        } else if (this.statusReason === CanadianStatusReasons.StudyingInBC) {
          options = selectOptionStudyPermitSupportDocument;
        } else if (this.statusReason === CanadianStatusReasons.ReligiousWorker) {
          options = selectOptionReligiousWorkSupportDocument;
        } else if (this.statusReason === CanadianStatusReasons.Diplomat) {
          options = selectOptionDiplomaticFoilSupportDocument;
        } else if (this.statusReason === CanadianStatusReasons.Visiting) {
          options = selectOptionVisitorVisaSupportDocument;
        }
      } else {
        options = selectOptionsCitizenshipSupportDocuments;
      }

      return options;
    },
    canadaArrivalDateLabel() {
      if (this.statusReason === this.canadianStatusReasons.MovingFromProvince
        && this.status !== this.statusOptions.TemporaryResident) {
        return 'Arrival date in Canada (Optional)';
      }
      if (this.status === this.statusOptions.Citizen && this.livedInBCSinceBirth === 'N') {
        return 'Arrival date in Canada (Optional)';
      }
      if (this.status === this.statusOptions.PermanentResident 
        && this.statusReason === this.canadianStatusReasons.LivingInBCWithoutMSP) {
        return 'Arrival date in Canada (Optional)';
      }

      return 'Arrival date in Canada';
    },
    bcMoveDateLabel() {
      if (this.statusReason === this.canadianStatusReasons.LivingInBCWithoutMSP) {
        return 'Most recent move to B.C.';
      } else {
        return 'Arrival date in B.C.';
      }
    },
    showPreviousHealthNumber() {
      return this.statusReason === this.canadianStatusReasons.MovingFromProvince;
    },
    showLivedInBCSinceBirth() {
      return this.status === this.statusOptions.Citizen
        && this.statusReason === this.canadianStatusReasons.LivingInBCWithoutMSP;
    },
    showMoveDateInputs() {
      return this.statusReason !== this.canadianStatusReasons.LivingInBCWithoutMSP
       || this.status !== this.statusOptions.Citizen || this.livedInBCSinceBirth === 'N';
    },
    showOriginTextField() {
      return this.status === this.statusOptions.TemporaryResident
        || (this.status === this.statusOptions.PermanentResident 
        && this.statusReason === this.canadianStatusReasons.LivingInBCWithoutMSP);
    },
    showMovedPermanentlyQuestion() {
      // Not sure if this always shows but it seems like it so far
      return true;
    },
    showProvinceSelector() {
      if (this.status === this.statusOptions.Citizen) {
        return this.statusReason === this.canadianStatusReasons.MovingFromProvince
              || (this.statusReason === this.canadianStatusReasons.LivingInBCWithoutMSP && this.livedInBCSinceBirth === 'N')
      } else if (this.status === this.statusOptions.PermanentResident) {
        return this.statusReason === this.canadianStatusReasons.MovingFromProvince;
      }

      return false;
    },
    showCountrySelector() {
      if (this.status === this.statusOptions.Citizen) {
        return this.statusReason === this.canadianStatusReasons.MovingFromCountry;
      } else if(this.status === this.statusOptions.PermanentResident) {
        return this.statusReason === this.canadianStatusReasons.MovingFromCountry;
      }

      return false;
    },
    showDischargeInputs() {
      return this.status === this.statusOptions.Citizen;
    },
    isAddressValidatorEnabled() {
      return spaEnvService.values.SPA_ENV_JHA_ENABLE_ADDRESS_VALIDATOR === 'true';
    },
    citizenshipSamples() {
      if (this.genderMatches === 'N') {
        return [this.citizenshipSupportDocumentType, SupportDocumentTypes.ChangeGenderDocs];
      } else {
        return this.citizenshipSupportDocumentType;
      }
    },
  },
}
</script>