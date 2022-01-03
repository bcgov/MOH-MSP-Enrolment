<template>
  <div>
    <PageContent :deltaHeight='pageContentDeltaHeight'>
      <div class="container pt-3 pt-sm-5 mb-3">
        <h1>Add child information and upload documents</h1>
        <p>Do you have a child who also needs to enrol for MSP coverage? If so, you are required to provide child information and provide supporting documents.</p>
        <hr class="mt-0"/>
        <Radio v-if="hasChildren !== 'Y'"
                label="Do you have a child who also needs to enrol for MSP coverage?"
                :id="'has-children'"
                :name="'has-children'"
                class="mt-3"
                v-model="hasChildren"
                @blur="handleBlurField($v.hasChildren)"
                :items="radioOptionsNoYes" />
              <div class="text-danger"
                v-if="$v.hasChildren.$dirty && !$v.hasChildren.required"
                aria-live="assertive">Please indicate if you have a child who needs to enrol for MSP coverage.</div>
        <div v-for="(child, index) in children"
            :key="'child-' + index"
            :set="v = $v.children.$each[index]">
          <div class="heading mt-3">
            <div v-if="!child.collapsed" @click="collapseChild(index)" class="icon-header">
              <font-awesome-icon icon="angle-down" size="3x" />
              <h2 class="m-0 ml-2">{{getChildTitle(index)}}</h2>
            </div>
            <div v-if="child.collapsed" @click="expandChild(index)" class="icon-header">
              <font-awesome-icon icon="angle-right" size="3x" />
              <h2 class="m-0 ml-2">{{getChildTitle(index)}}</h2>
            </div>
            <div class="remove-icon" @click="removeChild(index)">
                <font-awesome-icon icon="times-circle" size="2x"/>
            </div>
          </div>
          <hr/>
          <div :class="{'collapsed': child.collapsed}">
            <Radio
              label='How old is the child?'
              :id="'child-age-range-' + index"
              :name="'child-age-range-' + index"
              v-model='child.ageRange'
              @blur="handleBlurField(v.ageRange)"
              className="mt-3"
              :items='radioChildAgeOptions'
            />
            <div class="text-danger"
              v-if="v.ageRange.$dirty && !v.ageRange.required"
              aria-live="assertive">Please indicate the child's age range.</div>
            <Input label='First name'
              :id="'child-first-name-' + index"
              className='mt-3'
              maxlength="18"
              @blur="handleBlurField(v.firstName)"
              v-model='child.firstName'
              :inputStyle='mediumStyles' />
            <div class="text-danger"
              v-if="v.firstName.$dirty && !v.firstName.required"
              aria-live="assertive">First name is required.</div>
            <div class="text-danger"
              v-if="v.firstName.$dirty && v.firstName.required && !v.firstName.nameValidator"
              aria-live="assertive">First name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.<br/>First name must be a letter.</div>
            <Input label='Middle name (optional)'
              :id="'child-middle-name-' + index"
              className='mt-3'
              maxlength="18"
              @blur="handleBlurField(v.middleName)"
              v-model='child.middleName'
              :inputStyle='mediumStyles' />
            <div class="text-danger"
              v-if="v.middleName.$dirty && !v.middleName.nameValidator"
              aria-live="assertive">Middle name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.<br/>Middle name must be a letter.</div>
            <Input label='Last name'
              :id="'child-last-name-' + index"
              className='mt-3'
              maxlength="18"
              @blur="handleBlurField(v.lastName)"
              v-model='child.lastName'
              :inputStyle='mediumStyles' />
            <div class="text-danger"
              v-if="v.lastName.$dirty && !v.lastName.required"
              aria-live="assertive">Last name is required.</div>
            <div class="text-danger"
              v-if="v.lastName.$dirty && v.lastName.required && !v.lastName.nameValidator"
              aria-live="assertive">First name must begin with a letter and cannot include special characters except hyphens, periods, apostrophes and blank characters.<br/>First name must be a letter.</div>
            <DateInput label='Birth date'
              :id="'child-birth-date-' + index"
              className='mt-3'
              @blur="handleBlurField(v.birthDate)"
              @processDate="handleProcessBirthdate($event, child)"
              v-model='child.birthDate' />
            <div class="text-danger"
              v-if="v.birthDate.$dirty && !v.birthDate.required"
              aria-live="assertive">Birth date is required.</div>
            <div class="text-danger"
              v-if="v.birthDate.$dirty
                && !v.birthDate.dateDataValidator"
              aria-live="assertive">Invalid birth date.</div>
            <div class="text-danger"
              v-if="v.birthDate.$dirty
                && !v.birthDate.distantPastValidator"
              aria-live="assertive">Invalid birth date.</div>
            <div class="text-danger"
              v-if="v.birthDate.$dirty
                    && v.birthDate.required
                    && !v.birthDate.birthDatePastValidator"
              aria-live="assertive">Birth date cannot be in the future.</div>
            <div class="text-danger"
              v-if="v.birthDate.$dirty
                    && v.birthDate.required
                    && v.birthDate.birthDatePastValidator
                    && !v.birthDate.birthDateYouthValidator"
              aria-live="assertive">A child must be less than 19 years old.</div>
            <div class="text-danger"
              v-if="v.birthDate.$dirty
                    && v.birthDate.required
                    && v.birthDate.birthDatePastValidator
                    && !v.birthDate.birthDateStudentValidator"
              aria-live="assertive">A post-secondary student must be between 19 and 24 years.</div>
            <Radio
              label='Gender'
              :id="'child-gender-' + index"
              :name="'child-gender-' + index"
              v-model='child.gender'
              className="mt-3"
              @blur="handleBlurField(v.gender)"
              :items='radioGenderOptions'/>
            <div class="text-danger"
              v-if="v.gender.$dirty && !v.gender.required"
              aria-live="assertive">Please indicate the child's gender.</div>
            <h2 class="mt-3">Child's status in Canada</h2>
            <p>Please provide child immigration status information. You will be required to upload documents to support your status in Canada.</p>
            <hr />
            <Select 
              :id="'child-status-' + index"
              :name="'child-status-' + index"
              label="Immigration status in Canada"
              class='mt-3'
              @blur="handleBlurField(v.status)"
              @change="handleStatusChange($event, child, v)"
              v-model='child.status'
              :options='citizenshipStatusOptions'
              :inputStyle='mediumStyles'/>
            <div class="text-danger"
              v-if="v.status.$dirty && !v.status.required"
              aria-live="assertive">Please select your child's immigration status.</div>
            <div v-if="child.status === statusOptions.Citizen || child.status === statusOptions.PermanentResident">
              <Radio
                :id="'child-status-reason-' + index"
                :name="'child-status-reason-' + index"
                label=''
                v-model='child.statusReason'
                @blur="handleBlurField(v.statusReason)"
                @change="handleStatusReasonChange($event, child, v)"
                :items='citizenshipStatusReasonOptions' />
              <div class="text-danger"
                v-if="v.statusReason.$dirty && !v.statusReason.required"
                aria-live="assertive">Please select one of the above.</div>
            </div>
            <div v-if="child.status === statusOptions.TemporaryResident">
              <Radio
                :id="'child-status-reason' + index"
                :name="'child-status-reason' + index"
                label=''
                v-model='child.statusReason'
                @blur="handleBlurField(v.statusReason)"
                @change="handleStatusReasonChange($event, child, v)"
                :items='temporaryResidentStatusReasonOptions' />
              <div class="text-danger"
                v-if="v.statusReason.$dirty && !v.statusReason.required"
                aria-live="assertive">Please select one of the above.</div>
            </div>
            <div v-if="child.statusReason !== null && child.statusReason !== undefined" class="mt-3">
              <h2>Documents</h2>
              <p>Provide one of the following documents to support your status in Canada. If your child's name has changed since your ID was issued you are also required to upload document to support the name change.</p>
              <hr/>
              <Select 
                label="Document Type"
                :name="'citizen-support-document-type-' + index"
                :id="'citizen-support-document-type-' + index"
                class="mb-3"
                v-model="child.citizenshipSupportDocumentType"
                @blur="handleBlurField(v.citizenshipSupportDocumentType)"
                :options="citizenshipSupportDocumentOptions(child)"
                :inputStyle='mediumStyles' />
              <div class="text-danger"
                v-if="v.citizenshipSupportDocumentType.$dirty && !v.citizenshipSupportDocumentType.required"
                aria-live="assertive">Please select one of the above.</div>
              <div v-if="child.citizenshipSupportDocumentType">
                <h2>{{child.citizenshipSupportDocumentType}}</h2>
                <hr/>
                <FileUploader v-model="child.citizenshipSupportDocuments" />
                <div class="text-danger"
                  v-if="v.citizenshipSupportDocuments.$dirty && !v.citizenshipSupportDocuments.required"
                  aria-live="assertive">File upload required.</div>
              </div>

              <Radio label="Has your child's name changed since their ID was issued due to marriage or legal name change?"
                :id="'name-change-' + index"
                :name="'name-change-' + index"
                class="mt-3 mb-3"
                v-model="child.isNameChanged"
                @blur="handleBlurField(v.isNameChanged)"
                :items="radioOptionsNoYes" />
              <div class="text-danger"
                v-if="v.isNameChanged.$dirty && !v.isNameChanged.required"
                aria-live="assertive">Please indicate if your child's name changed.</div>
              <div v-if="child.isNameChanged === 'Y'"
                class="tabbed-section">
                <h2>Additional Documents</h2>
                <p>Provide one of the required documents to support the name change.</p>
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
                  v-model="child.nameChangeSupportDocumentType"
                  @blur="handleBlurField(v.nameChangeSupportDocumentType)"
                  :options="nameChangeSupportDocumentOptions"
                  :inputStyle='mediumStyles' />
                <div class="text-danger"
                  v-if="v.nameChangeSupportDocumentType.$dirty && !v.nameChangeSupportDocumentType.required"
                  aria-live="assertive">Please select one of the above.</div>
                <div v-if="child.nameChangeSupportDocumentType">
                  <h2>{{child.nameChangeSupportDocumentType}}</h2>
                  <hr/>
                  <FileUploader class="mb-3"
                    v-model="child.nameChangeSupportDocuments"/>
                  <div class="text-danger"
                    v-if="v.nameChangeSupportDocuments.$dirty && !v.nameChangeSupportDocuments.required"
                    aria-live="assertive">File upload required.</div>
                </div>
              </div>

              <div v-if="child.citizenshipSupportDocuments.length > 0 && (child.isNameChanged === 'N' || child.nameChangeSupportDocuments.length > 0)">
                <h2 class="mt-4">Moving Information</h2>
                <hr/>
                <div class="row">
                  <div class="col-md-7">
                    <div v-if="showLivedInBCSinceBirth(child)">
                      <Radio 
                        label='Has your child lived in B.C. since birth?'
                        :id="'lived-in-bc-' + index"
                        :name="'lived-in-bc-' + index"
                        v-model='child.livedInBCSinceBirth'
                        className="mt-3"
                        @blur="handleBlurField(v.livedInBCSinceBirth)"
                        :items='radioOptionsNoYes' />
                      <!-- <div class="text-danger"
                        v-if="v.livedInBCSinceBirth.$dirty && !v.livedInBCSinceBirth.required"
                        aria-live="assertive">Please indicate whether your child has lived in B.C. since birth.</div> -->
                    </div>
                    <div v-if="showOriginTextField(child)">
                      <Input 
                          className="mt-3"
                          label="From which province or country?"
                          maxlength="25"
                          v-model="child.moveFromOrigin"
                          @blur="handleBlurField(v.moveFromOrigin)"
                          :inputStyle='mediumStyles' />
                      <!-- <div class="text-danger"
                          v-if="v.moveFromOrigin.$dirty
                            && !v.moveFromOrigin.required"
                          aria-live="assertive">Province or country of origin is required.</div> -->
                    </div>
                    <div v-if="showMovedPermanentlyQuestion(child)">
                      <Radio
                        label='Has your child moved to B.C. permanently?'
                        :id="'permanent-move-' + index"
                        :name="'permanent-move-' + index"
                        v-model='child.madePermanentMove'
                        className="mt-3"
                        @blur="handleBlurField(v.madePermanentMove)"
                        :items='radioOptionsNoYes'/>
                      <!-- <div class="text-danger"
                        v-if="v.madePermanentMove.$dirty && !v.madePermanentMove.required"
                        aria-live="assertive">Please indicate whether your child has made a permanent move to B.C.</div>
                      <div class="text-danger"
                        v-if="child.madePermanentMove === 'N' && child.status !== statusOptions.TemporaryResident"
                        aria-live="assertive">You have indicated that a recent move to B.C. is not permanent. As a result, your child is not eligible for enrolment in the Medical Services Plan. Please contact <a target="_blank" href="http://www2.gov.bc.ca/gov/content/health/health-drug-coverage/msp/bc-residents-contact-us">Health Insurance BC</a> for further information.</div> -->
                    </div>
                    <div v-if="child.madePermanentMove !== 'N' || child.status === statusOptions.TemporaryResident">
                      <div v-if="showProvinceSelector(child)">
                        <RegionSelect
                          className="mt-3"
                          :id="'province-select-' + index"
                          :name="'province-select-' + index"
                          label="Which province is your child moving from?" 
                          v-model="child.moveFromOrigin"
                          :disablePlaceholder="true"
                          defaultOptionLabel="Please select a province"
                          @blur="handleBlurField(v.moveFromOrigin)"
                          :inputStyle='mediumStyles' />
                        <!-- <div class="text-danger"
                          v-if="v.moveFromOrigin.$dirty
                            && !v.moveFromOrigin.required"
                          aria-live="assertive">Province of origin is required.</div>
                        <div class="text-danger"
                          v-if="child.moveFromOrigin === 'BC' || child.moveFromOrigin === 'British Columbia'"
                          aria-live="assertive">Province of origin cannot be British Columbia.</div> -->
                      </div>
                      <div v-if="showCountrySelector(child)">
                        <CountrySelect 
                          className="mt-3"
                          :id="'country-select-' + index"
                          :name="'country-select-' + index"
                          label="Which country is your child moving from?" 
                          v-model="child.moveFromOrigin"
                          :disablePlaceholder="true"
                          defaultOptionLabel="Please select a country"
                          @blur="handleBlurField(v.moveFromOrigin)"
                          :inputStyle='mediumStyles' />
                        <!-- <div class="text-danger"
                          v-if="v.moveFromOrigin.$dirty && !v.moveFromOrigin.required"
                          aria-live="assertive">Country of origin is required.</div>
                        <div class="text-danger"
                          v-if="child.moveFromOrigin === 'Canada'"
                          aria-live="assertive">Country of origin cannot be Canada.</div> -->
                      </div>
                      <div v-if="showMoveDateInputs(child)">
                        <DateInput 
                          :label='bcMoveDateLabel(child)'
                          :id="'bc-move-' + index"
                          :name="'bc-move-' + index"
                          className='mt-3'
                          v-model='child.recentBCMoveDate'
                          @blur="handleBlurField(v.recentBCMoveDate)"
                          @processDate="handleProcessDateBCMove($event, child)" />
                        <div v-if="bcMoveDateLabel(child) === 'Most recent move to B.C.'">
                          <!-- <div class="text-danger"
                            v-if="v.recentBCMoveDate.$dirty && !v.recentBCMoveDate.required"
                            aria-live="assertive">Most recent move to B.C. is required.</div>
                          <div class="text-danger"
                            v-if="v.recentBCMoveDate.$dirty
                                  && v.recentBCMoveDate.required
                                  && !v.recentBCMoveDate.dateDataValidator"
                            aria-live="assertive">Invalid most recent move to B.C. date.</div>
                          <div class="text-danger"
                            v-if="v.recentBCMoveDate.$dirty
                                  && v.recentBCMoveDate.required
                                  && v.recentBCMoveDate.dateDataValidator
                                  && !v.recentBCMoveDate.pastDateValidator"
                            aria-live="assertive">Most recent move to B.C. date cannot be in the future.</div>
                          <div class="text-danger"
                            v-if="v.recentBCMoveDate.$dirty
                                  && v.recentBCMoveDate.required
                                  && v.recentBCMoveDate.dateDataValidator
                                  && v.recentBCMoveDate.pastDateValidator
                                  && !v.recentBCMoveDate.beforeBirthdateValidator"
                            aria-live="assertive">The child's most recent move to B.C. cannot be before the child's date of birth.</div>
                          <div class="text-danger"
                            v-if="v.recentBCMoveDate.$dirty
                                  && v.recentBCMoveDate.required
                                  && v.recentBCMoveDate.dateDataValidator
                                  && v.recentBCMoveDate.pastDateValidator
                                  && v.recentBCMoveDate.beforeBirthdateValidator
                                  && !v.recentBCMoveDate.dateOrderValidator"
                            aria-live="assertive">The child's most recent move to B.C. cannot be before the move to Canada date.</div> -->
                        </div>
                        <div v-else>
                          <!-- <div class="text-danger"
                            v-if="v.recentBCMoveDate.$dirty && !v.recentBCMoveDate.required"
                            aria-live="assertive">Arrival date in B.C. is required.</div>
                          <div class="text-danger"
                            v-if="v.recentBCMoveDate.$dirty
                                  && v.recentBCMoveDate.required
                                  && !v.recentBCMoveDate.dateDataValidator"
                            aria-live="assertive">Invalid arrival date in BC.</div>
                          <div class="text-danger"
                            v-if="v.recentBCMoveDate.$dirty
                                  && v.recentBCMoveDate.required
                                  && v.recentBCMoveDate.dateDataValidator
                                  && !v.recentBCMoveDate.pastDateValidator"
                            aria-live="assertive">Arrival date in B.C. cannot be in the future.</div>
                          <div class="text-danger"
                            v-if="v.recentBCMoveDate.$dirty
                                  && v.recentBCMoveDate.required
                                  && v.recentBCMoveDate.dateDataValidator
                                  && v.recentBCMoveDate.pastDateValidator
                                  && !v.recentBCMoveDate.beforeBirthdateValidator"
                            aria-live="assertive">The child's arrival date in B.C. cannot be before the child's date of birth.</div>
                          <div class="text-danger"
                            v-if="v.recentBCMoveDate.$dirty
                                  && v.recentBCMoveDate.required
                                  && v.recentBCMoveDate.dateDataValidator
                                  && v.recentBCMoveDate.pastDateValidator
                                  && v.recentBCMoveDate.beforeBirthdateValidator
                                  && !v.recentBCMoveDate.dateOrderValidator"
                            aria-live="assertive">The child's arrival date in B.C. cannot be before the move to Canada date.</div> -->
                        </div>
                        <DateInput :label='canadaArrivalDateLabel(child)'
                          :id="'canada-arrival-date-' + index"
                          :name="'canada-arrival-date-' + index"
                          className='mt-3'
                          v-model='child.canadaArrivalDate'
                          @blur="handleBlurField(v.canadaArrivalDate)"
                          @processDate="handleProcessDateCanadaArrival($event, child)" />
                        <!-- <div class="text-danger"
                          v-if="canadaArrivalDateLabel === 'Arrival date in Canada'
                            && v.canadaArrivalDate.$dirty
                            && !v.canadaArrivalDate.required"
                          aria-live="assertive">Arrival date in Canada is required.</div>
                        <div class="text-danger"
                          v-if="v.canadaArrivalDate.$dirty && !v.canadaArrivalDate.dateDataValidator"
                          aria-live="assertive">Invalid Arrival date in Canada.</div>
                        <div class="text-danger"
                          v-if="v.canadaArrivalDate.$dirty
                                && v.canadaArrivalDate.dateDataValidator
                                && !v.canadaArrivalDate.pastDateValidator"
                          aria-live="assertive">Most recent move to Canada date cannot be in the future.</div>
                        <div class="text-danger"
                          v-if="v.canadaArrivalDate.$dirty 
                                && v.canadaArrivalDate.dateDataValidator
                                && v.canadaArrivalDate.pastDateValidator
                                && !v.canadaArrivalDate.beforeBirthdateValidator"
                          aria-live="assertive">The child's most recent move to Canada cannot be before the child's date of birth.</div>
                        <div class="text-danger"
                          v-if="v.canadaArrivalDate.$dirty 
                                && v.canadaArrivalDate.dateDataValidator
                                && v.canadaArrivalDate.pastDateValidator
                                && v.canadaArrivalDate.beforeBirthdateValidator
                                && !v.canadaArrivalDate.dateOrderValidator"
                          aria-live="assertive">The child's most recent move to Canada cannot be after the move to B.C. date.</div> -->
                      </div>
                      <div v-if="showPreviousHealthNumber(child)">
                        <Input 
                          className="mt-3"
                          :id="'health-number-' + index"
                          :name="'health-number-' + index"
                          label="Health Number from that province (optional)"
                          maxlength="50"
                          v-model="child.previousHealthNumber"
                          :inputStyle='mediumStyles' />
                      </div>
                      <Radio
                        label='Has your spouse been outside B.C. for more than 30 days in total in the past 12 months?'
                        :id="'outside-bc-' + index"
                        :name="'outside-bc-' + index"
                        v-model='child.outsideBCLast12Months'
                        className="mt-3"
                        @blur="handleBlurField(v.outsideBCLast12Months)"
                        :items='radioOptionsNoYes'/>
                      <!-- <div class="text-danger"
                        v-if="v.outsideBCLast12Months.$dirty && !v.outsideBCLast12Months.required"
                        aria-live="assertive">Please indicate whether your child has been outside BC in the past 12 months.</div> -->
                      <div v-if="child.outsideBCLast12Months === 'Y'" class="tabbed-section">
                        <Input 
                          className="mt-3"
                          :id="'outside-bc-reason-' + index"
                          :name="'outside-bc-reason-' + index"
                          label="Reason for departure"
                          maxlength="20"
                          v-model="child.outsideBCLast12MonthsReason"
                          @blur="handleBlurField(v.outsideBCLast12MonthsReason)"
                          :inputStyle='mediumStyles' />
                        <!-- <div class="text-danger"
                          v-if="v.outsideBCLast12MonthsReason.$dirty && !v.outsideBCLast12MonthsReason.required"
                          aria-live="assertive">Reason for departure is required.</div> -->
                        <Input 
                          className="mt-3"
                          :id="'outside-bc-destination-' + index"
                          :name="'outside-bc-destination-' + index"
                          label="Location"
                          maxlength="20" 
                          v-model="child.outsideBCLast12MonthsDestination"
                          @blur="handleBlurField(v.outsideBCLast12MonthsDestination)"
                          :inputStyle='mediumStyles' />
                        <!-- <div class="text-danger"
                          v-if="v.outsideBCLast12MonthsDestination.$dirty && !v.outsideBCLast12MonthsDestination.required"
                          aria-live="assertive">Location is required.</div> -->
                        <DateInput label='Departure date'
                          :id="'outside-bc-departure-' + index"
                          :name="'outside-bc-departure-' + index"
                          className='mt-3'
                          @blur="handleBlurField(v.outsideBCLast12MonthsDepartureDate)"
                          @processDate="handleProcessDate12MonthsDeparture($event, child)"
                          v-model='child.outsideBCLast12MonthsDepartureDate' />
                        <!-- <div class="text-danger"
                          v-if="v.outsideBCLast12MonthsDepartureDate.$dirty && !v.outsideBCLast12MonthsDepartureDate.required"
                          aria-live="assertive">Departure date is required.</div>
                        <div class="text-danger"
                          v-if="v.outsideBCLast12MonthsDepartureDate.$dirty
                            && !v.outsideBCLast12MonthsDepartureDate.dateDataValidator"
                          aria-live="assertive">Invalid departure date.</div>
                        <div class="text-danger"
                          v-if="v.outsideBCLast12MonthsDepartureDate.$dirty
                            && !v.outsideBCLast12MonthsDepartureDate.departureDateValidator"
                          aria-live="assertive">Departure date must be within the last 12 months and prior to return date.</div> -->
                        <DateInput label='Return date'
                          :id="'outside-bc-return-' + index"
                          :name="'outside-bc-return-' + index"
                          className='mt-3'
                          @blur="handleBlurField(v.outsideBCLast12MonthsReturnDate)"
                          @processDate="handleProcessDate12MonthsReturn($event, child)"
                          v-model='child.outsideBCLast12MonthsReturnDate' />
                        <!-- <div class="text-danger"
                          v-if="v.outsideBCLast12MonthsReturnDate.$dirty && !v.outsideBCLast12MonthsReturnDate.required"
                          aria-live="assertive">Return date is required.</div>
                        <div class="text-danger"
                          v-if="v.outsideBCLast12MonthsReturnDate.$dirty
                            && !v.outsideBCLast12MonthsReturnDate.dateDataValidator"
                          aria-live="assertive">Invalid return date.</div>
                        <div class="text-danger"
                          v-if="v.outsideBCLast12MonthsReturnDate.$dirty
                            && !v.outsideBCLast12MonthsReturnDate.returnDateValidator"
                          aria-live="assertive">Return date must be within the last 12 months and after departure date.</div> -->
                      </div>
                      <Radio
                        label='Does your child have a previous B.C. Personal Health Number?'
                        :id="'has-bc-health-number-' + index"
                        :name="'has-bc-health-number-' + index"
                        v-model='child.hasPreviousBCHealthNumber'
                        className="mt-3"
                        @blur="handleBlurField(v.hasPreviousBCHealthNumber)"
                        :items='radioOptionsNoYes'/>
                      <!-- <div class="text-danger"
                        v-if="v.hasPreviousBCHealthNumber.$dirty && !v.hasPreviousBCHealthNumber.required"
                        aria-live="assertive">Please indicate whether your child has a previous BC Personal Health Number.</div> -->
                      <div v-if="child.hasPreviousBCHealthNumber === 'Y'" class="tabbed-section">
                        <PhnInput 
                          className="mt-3"
                          :id="'bc-phn-' + index"
                          :name="'bc-phn-' + index"
                          label="Your child's previous B.C. Personal Health Number (optional)" 
                          v-model="child.previousBCHealthNumber"
                          placeholder="1111 111 111"
                          @blur="handleBlurField(v.previousBCHealthNumber)"
                          :inputStyle='mediumStyles' />
                        <!-- <div class="text-danger"
                          v-if="v.previousBCHealthNumber.$dirty && !v.previousBCHealthNumber.phnValidator"
                          aria-live="assertive">Invalid Personal Health Number</div> -->
                      </div>
                      <div v-if="showDischargeInputs(child)">
                        <Radio
                          label='Has your child been released from the Canadian Armed Forces or an institution?'
                          :id="'been-released-' + index"
                          :name="'been-released-' + index"
                          v-model='child.hasBeenReleasedFromInstitution'
                          className="mt-3"
                          @blur="handleBlurField(v.hasBeenReleasedFromInstitution)"
                          :items='radioOptionsNoYes' />
                        <!-- <div class="text-danger"
                          v-if="v.hasBeenReleasedFromInstitution.$dirty && !v.hasBeenReleasedFromInstitution.required"
                          aria-live="assertive">Please indicate whether your spouse has been released from an institution.</div> -->
                      </div>
                      <div v-if="showDischargeInputs(child) && child.hasBeenReleasedFromInstitution === 'Y'" class="tabbed-section">
                        <DateInput label='Discharge date'
                          :id="'discharge-date-' + index"
                          :name="'discharge-date-' + index"
                          className='mt-3'
                          @blur="handleBlurField(v.dischargeDate)"
                          @processDate="handleProcessDateDischarge($event, child)"
                          v-model='child.dischargeDate' />
                        <!-- <div class="text-danger"
                          v-if="v.dischargeDate.$dirty && !v.dischargeDate.required"
                          aria-live="assertive">Discharge date is required.</div>
                        <div class="text-danger"
                          v-if="v.dischargeDate.$dirty
                            && !v.dischargeDate.dateDataValidator"
                          aria-live="assertive">Invalid discharge date.</div>
                        <div class="text-danger"
                          v-if="v.dischargeDate.$dirty
                            && !v.dischargeDate.dischargeDateValidator"
                          aria-live="assertive">Discharge date cannot be before the child's date of birth.</div>
                        <div class="text-danger"
                          v-if="v.dischargeDate.$dirty
                            && !v.dischargeDate.pastDateValidator"
                          aria-live="assertive">Discharge date cannot be in the future.</div> -->
                      </div>
                    </div>
                  </div>
                  <div class="col-md-5 mt-3">
                    <TipBox>
                      <p>A permanent move means that you intend to make B.C. your primary residence for 6 months or longer.</p>
                    </TipBox>
                  </div>
                </div>
                <div v-if="child.ageRange === childAgeTypes.Child19To24">
                  <h2 class="mt-3">School Information</h2>
                  <p class="m-0">Enter information of the school that this child is attending (must be in full time attendance)</p>
                  <hr/>
                  <Input label='School name'
                    :id="'school-name-' + index"
                    className='mt-3'
                    maxlength="18"
                    v-model='child.schoolName' />
                  <div class="text-danger"
                    v-if="v.schoolName.$dirty && !v.schoolName.required"
                    aria-live="assertive">School name is required.</div>
                  <Input label="Full street address, rural route, PO box or general delivery"
                    :id="'school-address-line1-' + index"
                    v-model="child.schoolAddressLine1"
                    maxlength="25"
                    @blur="handleBlurField(v.schoolAddressLine1)" />
                  <div class="text-danger" v-if="v.schoolAddressLine1.$dirty && !v.schoolAddressLine1.required" aria-live="assertive">Street address is required.</div>
                  <div class="text-danger"
                      v-if="v.schoolAddressLine1.$dirty && !v.schoolAddressLine1.specialCharacterValidator"
                      aria-live="assertive">Street address cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
                  <Input label="Address Line 2 (optional)"
                    :id="'school-address-line2-' + index"
                    v-model="child.schoolAddressLine2"
                    maxlength="25"
                    @blur="handleBlurField(v.schoolAddressLine2)" />
                  <div class="text-danger"
                      v-if="v.schoolAddressLine2.$dirty && !v.schoolAddressLine2.specialCharacterValidator"
                      aria-live="assertive">Street address cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
                  <Input label="Address Line 3 (optional)"
                    :id="'school-address-line3-' + index"
                    v-model="child.schoolAddressLine3"
                    maxlength="25"
                    @blur="handleBlurField(v.schoolAddressLine3)" />
                  <div class="text-danger"
                      v-if="v.schoolAddressLine3.$dirty && !v.schoolAddressLine3.specialCharacterValidator"
                      aria-live="assertive">Street address cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
                  <Input label="City"
                    :id="'school-city-' + index"
                    v-model="child.schoolCity"
                    maxlength="25"
                    @blur="handleBlurField(v.schoolCity)" />
                  <div class="text-danger" v-if="v.schoolCity.$dirty && !v.schoolCity.required" aria-live="assertive">City is required.</div>
                  <div class="text-danger"
                      v-if="v.schoolCity.$dirty && !v.schoolCity.specialCharacterValidator"
                      aria-live="assertive">City cannot include special characters except hyphen, period, apostrophe, number sign and blank space.</div>
                  <Input label="Province"
                    :id="'school-province-' + index"
                    v-model="child.schoolProvinceOrState"
                    @blur="handleBlurField(v.schoolProvinceOrState)"/>
                  <div class="text-danger" v-if="v.schoolProvinceOrState.$dirty && !v.schoolProvinceOrState.required" aria-live="assertive">Province/state is required.</div>
                  <Input label="Country"
                    :id="'school-country-' + index"
                    v-model="child.schoolCountry"
                    @blur="handleBlurField(v.schoolCountry)"/>
                  <div class="text-danger" v-if="v.schoolCountry.$dirty && !v.schoolCountry.required" aria-live="assertive">Country is required.</div>
                  <PostalCodeInput label="Postal Code"
                    :id="'school-postal-code-' + index"
                    v-model="child.schoolPostalCode"
                    @blur="handleBlurField(v.schoolPostalCode)" />
                  <div class="text-danger" v-if="v.schoolPostalCode.$dirty && !v.schoolPostalCode.required" aria-live="assertive">Postal code is required.</div>
                  <DateInput label="Original departure date from B.C. (if school is outside B.C.)"
                    :id="'school-departure-date-' + index"
                    class="mt-3"
                    v-model="child.schoolDepartureDate"
                    @blur="handleBlurField(v.schoolDepartureDate)" />
                  <DateInput label="Expected school completion date"
                    :id="'school-completion-date-' + index"
                    class="mt-3"
                    v-model="child.schoolCompletionDate"
                    @blur="handleBlurField(v.schoolCompletionDate)" />
                  <div class="text-danger"
                    v-if="v.schoolCompletionDate.$dirty
                      && !v.schoolCompletionDate.required"
                    aria-live="assertive">Expected school completion date is required.</div>
                  <Radio label="Will your child reside in BC after completing their studies?"
                    class="mt-3"
                    :id="'will-reside-in-bc-after-studies-' + index"
                    :name="'will-reside-in-bc-after-studies-' + index"
                    v-model="child.willResideInBCAfterStudies"
                    :items="radioOptionsNoYes"
                    @blur="handleBlurField(v.willResideInBCAfterStudies)"/>
                  <div class="text-danger"
                    v-if="v.willResideInBCAfterStudies.$dirty
                      && !v.willResideInBCAfterStudies.required"
                    aria-live="assertive">This field is required.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContent>
    <ContinueBar 
      @continue="validateFields()" 
      @secondary="addChild()"
      :hasSecondaryButton="hasChildren === 'Y' && !maximumChildrenReached"
      :secondaryButtonLabel="'Add Child'"  
    />
  </div>
</template>

<script>
import pageStateService from '@/services/page-state-service';
import {
  enrolmentRoutes,
  isPastPath,
} from '@/router/routes';
import {
  scrollTo,
  scrollToError,
  getTopScrollPosition
} from '@/helpers/scroll';
import {
  childBirthdateRequiredValidator,
  childBirthdateValidator,
  nameValidator,
  // nonBCValidator,
  // nonCanadaValidator,
} from '@/helpers/validators';
import {
  getConvertedPath,
} from '@/helpers/url';
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
  PostalCodeInput,
  FileUploader,
  optionalValidator,
  cloneDeep,
  pastDateValidator,
  distantPastValidator,
  phnValidator,
  specialCharacterValidator,
} from 'common-lib-vue';
import {
  required
} from 'vuelidate/lib/validators';
import {
  addYears,
  isSameDay,
  startOfToday,
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
  radioOptionsGender,
} from '@/constants/radio-options';
import { 
  StatusInCanada,
  CanadianStatusReasons, 
} from '@/constants/immigration-status-types';
import {
  MODULE_NAME as enrolmentModule,
  RESET_FORM,
  SET_HAS_CHILDREN,
  SET_NUM_CHILDREN,
  SET_CHILDREN,
} from '@/store/modules/enrolment-module';
import { ChildAgeTypes } from '../../constants/child-age-types';
import { isAfter, isBefore } from 'date-fns/esm';
import TipBox from '@/components/TipBox.vue';
import { mediumStyles } from '@/constants/input-styles'

const birthDatePastValidator = (value) => {
  return pastDateValidator(value) || isSameDay(value, startOfToday());
};

const birthDateYouthValidator = (value, vm) => {
  if (vm.ageRange === ChildAgeTypes.Child0To18) {
    return isAfter(value, addYears(startOfToday(), -18));
  }

  return true;
}
            
const birthDateStudentValidator = (value, vm) => {
  if (vm.ageRange === ChildAgeTypes.Child19To24) {
    return isAfter(value, addYears(startOfToday(), -24)) && isBefore(value, addYears(startOfToday(), -19));
  }

  return true;
}

const permanentMoveValidator = (value) => {
  return value === 'Y';
}

const doesRequireNameChangeDocuments = (val, vm) => {
  if (vm && vm.isNameChanged === 'Y') {
    if (Array.isArray(val)) {
      return val.length > 0;
    } else {
      return !!val;
    }
  } else {
    return true;
  }
}

const doesRequireOutsideBCInfo = (val, vm) => {
  if (vm && vm.outsideBCLast12Months === 'Y') {
    return !!val;
  } else {
    return true;
  }
}

const doesRequireSchoolInfo = (val, vm) => {
  if (vm && vm.ageRange === ChildAgeTypes.Child19To24) {
    return !!val;
  } else {
    return true;
  }
}

export default {
  name: 'ChildInfoPage',
  mixins: [pageContentMixin],
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
    FileUploader,
    TipBox,
    PostalCodeInput,
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
      mediumStyles: mediumStyles,
      // Data to be saved
      hasChildren: null,
      children: [],
    };
  },
  created() {
    this.hasChildren = this.$store.state.enrolmentModule.hasChildren;
    this.children = this.$store.state.enrolmentModule.children ? cloneDeep(this.$store.state.enrolmentModule.children) : [];
    
    setTimeout(() => {
      this.pageLoaded = true;
    }, 0);

    logService.logNavigation(
      this.$store.state.enrolmentModule.applicationUuid,
      enrolmentRoutes.CHILD_INFO_PAGE.path,
      enrolmentRoutes.CHILD_INFO_PAGE.title
    );
  },
  validations() {
    const validations = {
      hasChildren: { 
        required
      },
      children: {
        $each: {
          ageRange: {
            required,
          },
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
            required: childBirthdateRequiredValidator(),
            dateDataValidator: childBirthdateValidator(),
            distantPastValidator: optionalValidator(distantPastValidator),
            birthDatePastValidator: optionalValidator(birthDatePastValidator),
            birthDateYouthValidator: optionalValidator(birthDateYouthValidator),
            birthDateStudentValidator: optionalValidator(birthDateStudentValidator),
          },
          gender: {
            required,
          },
          status: {
            required,
          },
          statusReason: {
            required,
          },
          citizenshipSupportDocumentType: {
            required,
          },
          citizenshipSupportDocuments: {
            required,
          },
          isNameChanged: {
            required,
          },
          nameChangeSupportDocumentType: {
            required: doesRequireNameChangeDocuments,
          },
          nameChangeSupportDocuments: {
            required: doesRequireNameChangeDocuments,
          },
          livedInBCSinceBirth: {

          },
          madePermanentMove: {
            required,
            permanentMoveValidator: optionalValidator(permanentMoveValidator),
          },
          moveFromOrigin: {

          },
          previousHealthNumber: {

          },
          recentBCMoveDate: {

          },
          canadaArrivalDate: {

          },
          outsideBCLast12Months: {

          },
          outsideBCLast12MonthsReason: {
            required: doesRequireOutsideBCInfo
          },
          outsideBCLast12MonthsLocation: {
          
          },
          outsideBCLast12MonthsDepartureDate: {
          
          },
          outsideBCLast12MonthsReturnDate: {
          
          },
          hasPreviousBCHealthNumber: {
          
          },
          previousBCHealthNumber: {
            phnValidator: optionalValidator(phnValidator),
          },
          hasBeenReleasedFromInstitution: {

          },
          dischargeDate: {

          },
          schoolName: {
            required: doesRequireSchoolInfo,
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolAddressLine1: {
            required: doesRequireSchoolInfo,
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolAddressLine2: {
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolAddressLine3: {
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolCity: {
            required: doesRequireSchoolInfo,
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolProvinceOrState: {
            required: doesRequireSchoolInfo,
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolCountry: {
            required: doesRequireSchoolInfo,
            specialCharacterValidator: optionalValidator(specialCharacterValidator),
          },
          schoolPostalCode: {
            required: doesRequireSchoolInfo,
          },
          schoolCompletionDate: {
            required: doesRequireSchoolInfo,
          },
          willResideInBCAfterStudies: {
            required: doesRequireSchoolInfo,
          },
        }
      }
    };

    return validations;
  },
  methods: {
    addChild() {
      this.children.push({
        collapsed: false,
        
        ageRange: null,
        firstName: null,
        middleName: null,
        lastName: null,
        birthDate: null,
        gender: null,
        
        status: null,
        statusReason: null,
        citizenshipSupportDocumentType: null,
        citizenshipSupportDocuments: [],
        isNameChanged: null,
        nameChangeSupportDocumentType: null,
        nameChangeSupportDocuments: [],
        
        moveFromOrigin: null,
        previousHealthNumber: null,
        recentBCMoveDate: null,
        canadaArrivalDate: null,
        madePermanentMove: null,
        outsideBCLast12Months: null,
        outsideBCLast12MonthsReason: null,
        outsideBCLast12MonthsDestination: null,
        outsideBCLast12MonthsDepartureDate: null,
        outsideBCLast12MonthsReturnDate: null,
        hasPreviousBCHealthNumber: null,
        previousBCHealthNumber: null,
        hasBeenReleasedFromInstitution: null,
        dischargeDate: null,
        
        schoolName: null,
        schoolAddressLine1: null,
        schoolAddressLine2: null,
        schoolAddressLine3: null,
        schoolCity: null,
        schoolProvinceOrState: null,
        schoolCountry: null,
        schoolPostalCode: null,
        schoolDepartureDate: null,
        schoolCompletionDate: null,
        willResideInBCAfterStudies: null,
      });
    },
    removeChild(index) {
      this.children.splice(index, 1);
    },
    getChildTitle(index) {
      return 'Child #' + (index + 1) + ' basic information';
    },
    collapseChild(index) {
      this.children[index].collapsed = true;
      this.children = [...this.children];
    },
    expandChild(index) {
      this.children[index].collapsed = false;
      this.children = [...this.children];
    },
    expandAllChildren() {
      const children = this.children;
      children.forEach(child => {
        child.collapsed = false;
      });
      this.children = [...children];
    },
    citizenshipSupportDocumentOptions(child) {
      let options;

      if (child.status === StatusInCanada.PermanentResident) {
        options = selectOptionsPermanentResidentSupportDocuments;
      } else if (child.status === StatusInCanada.TemporaryResident){
        if (child.statusReason === CanadianStatusReasons.WorkingInBC) {
          options = selectOptionWorkPermitSupportDocument;
        } else if (child.statusReason === CanadianStatusReasons.StudyingInBC) {
          options = selectOptionStudyPermitSupportDocument;
        } else if (child.statusReason === CanadianStatusReasons.ReligiousWorker) {
          options = selectOptionReligiousWorkSupportDocument;
        } else if (child.statusReason === CanadianStatusReasons.Diplomat) {
          options = selectOptionDiplomaticFoilSupportDocument;
        } else if (child.statusReason === CanadianStatusReasons.Visiting) {
          options = selectOptionVisitorVisaSupportDocument;
        }
      } else {
        options = selectOptionsCitizenshipSupportDocuments;
      }

      return options;
    },
    canadaArrivalDateLabel(child) {
      if (child.statusReason === this.canadianStatusReasons.MovingFromProvince
        && child.status !== this.statusOptions.TemporaryResident) {
        return 'Arrival date in Canada (Optional)';
      }
      if (child.status === this.statusOptions.Citizen && child.livedInBCSinceBirth === 'N') {
        return 'Arrival date in Canada (Optional)';
      }
      if (child.status === this.statusOptions.TemporaryResident && child.statusReason === this.canadianStatusReasons.LivingInBCWithoutMSP) {
        return 'Arrival date in Canada (Optional)';
      }
      return 'Arrival date in Canada';
    },
    bcMoveDateLabel(child) {
      if (child.statusReason === this.canadianStatusReasons.LivingInBCWithoutMSP) {
        return 'Most recent move to B.C.';
      } else {
        return 'Arrival date in B.C.';
      }
    },
    showPreviousHealthNumber(child) {
      return child.statusReason === this.canadianStatusReasons.MovingFromProvince;
    },
    showLivedInBCSinceBirth(child) {
      return child.status === this.statusOptions.Citizen
        && child.statusReason === this.canadianStatusReasons.LivingInBCWithoutMSP;
    },
    showMoveDateInputs(child) {
        return (child.statusReason === this.canadianStatusReasons.LivingInBCWithoutMSP && child.livedInBCSinceBirth === 'N') 
        || child.statusReason !== this.canadianStatusReasons.LivingInBCWithoutMSP;
    },
    showOriginTextField(child) {
      return child.status === this.statusOptions.TemporaryResident;
    },
    showMovedPermanentlyQuestion(child) {
      return child.statusReason !== this.canadianStatusReasons.LivingInBCWithoutMSP || child.livedInBCSinceBirth === 'Y' || child.livedInBCSinceBirth === 'N';
    },
    showProvinceSelector(child) {
      if (child.status === this.statusOptions.Citizen) {
        return child.statusReason === this.canadianStatusReasons.MovingFromProvince
              || (child.statusReason === this.canadianStatusReasons.LivingInBCWithoutMSP && child.livedInBCSinceBirth === 'N')
      } else if (child.status === this.statusOptions.PermanentResident) {
        return child.statusReason === this.canadianStatusReasons.MovingFromProvince;
      }

      return false;
    },
    showCountrySelector(child) {
      if (child.status === this.statusOptions.Citizen) {
        return child.statusReason === this.canadianStatusReasons.MovingFromCountry;
      } else if(child.status === this.statusOptions.PermanentResident) {
        return child.statusReason === this.canadianStatusReasons.MovingFromCountry;
      }

      return false;
    },
    showDischargeInputs(child) {
      return child.status === this.statusOptions.Citizen;
    },
    handleBlurField(validationObject) {
      if (validationObject) {
        validationObject.$touch();
      }
    },
    handleProcessBirthdate(data, child) {
      child.birthdateData = data;
    },
    handleProcessDateBCMove(data, child) {
      child.recentBCMoveDateData = data;
    },
    handleProcessDateCanadaArrival(data, child) {
      child.canadaArrivalDateData = data;
    },
    handleProcessDate12MonthsDeparture(data, child) {
      child.outsideBCLast12MonthsDepartureDateData = data;
    },
    handleProcessDate12MonthsReturn(data, child) {
      child.outsideBCLast12MonthsReturnDateData = data;
    },
    handleProcessDateDischarge(data, child) {
      child.dischargeDateData = data;
    },
    handleStatusChange(status, child, validationObject) {
      console.log('handleStatusChange(', status, child, validationObject, ')');
      if (this.pageLoaded) {
        child.statusReason = null;
        validationObject.statusReason.$reset();
      }
    },
    handleStatusReasonChange(reason, child, validationObject) {
      console.log('handleStatusReasonChange(', reason, child, validationObject, ')');
      child.citizenshipSupportDocumentType = null;
      child.citizenshipSupportDocuments = [];
      child.isNameChanged = null;
      child.livedInBCSinceBirth = null;
      child.madePermanentMove = null;
      child.previousHealthNumber = null;
      child.moveFromOrigin = null;
      child.recentBCMoveDate = null;
      child.canadaArrivalDate = null;
      child.outsideBCLast12Months = null;
      child.hasPreviousBCHealthNumber = null;
      child.hasBeenReleasedFromInstitution = null;
      validationObject.citizenshipSupportDocumentType.$reset();
      validationObject.citizenshipSupportDocuments.$reset();
      validationObject.isNameChanged.$reset();
      validationObject.livedInBCSinceBirth.$reset();
      validationObject.madePermanentMove.$reset();
      validationObject.previousHealthNumber.$reset();
      validationObject.moveFromOrigin.$reset();
      validationObject.recentBCMoveDate.$reset();
      validationObject.canadaArrivalDate.$reset();
      validationObject.outsideBCLast12Months.$reset();
      validationObject.hasPreviousBCHealthNumber.$reset();
      validationObject.hasBeenReleasedFromInstitution.$reset();
    },
    validateFields() {
      this.saveData();

      if (!this.hasChildren) {
        this.navigateToNextPage();
        return;
      }

      this.$v.$touch()
      if (this.$v.$invalid) {
        this.expandAllChildren();
        scrollToError();
        return;
      }

      this.navigateToNextPage();
    },
    saveData() {
      this.$store.dispatch(enrolmentModule + '/' + SET_HAS_CHILDREN, this.hasChildren);
      this.$store.dispatch(enrolmentModule + '/' + SET_NUM_CHILDREN, this.children.length);
      this.$store.dispatch(enrolmentModule + '/' + SET_CHILDREN, this.children);
    },
    navigateToNextPage() {
      // Determine which page to navigate to next
      let routePath;
      if (this.$store.state.enrolmentModule.isApplyingForFPCare) {
        routePath = enrolmentRoutes.FPCARE_INFO_PAGE.path;
      } else if (this.$store.state.enrolmentModule.isApplyingForSuppBen) {
        routePath = enrolmentRoutes.SUPP_BEN_INFO_PAGE.path;
      } else {
        routePath = enrolmentRoutes.CONTACT_INFO_PAGE.path;
      }

      // Navigate to next path
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        routePath
      );
      pageStateService.setPageComplete(toPath);
      pageStateService.visitPage(toPath);
      this.$router.push(toPath);
      scrollTo(0);
    },
  },
  watch: {
    children(arr) {
      if (arr.length > 0) {
        this.hasChildren = 'Y';
      } else {
        this.hasChildren = 'N';
      }
    },
    hasChildren(val) {
      if (this.pageLoaded) {
        if (val === 'Y') {
          this.addChild();
        } 
      }
    }
  },
  computed: {
    maximumChildrenReached() {
      return this.children.length > 27;
    },
  },
  // Required in order to block back navigation.
  beforeRouteLeave(to, from, next) {
    pageStateService.setPageIncomplete(from.path);
    if (to.path === enrolmentRoutes.HOME_PAGE.path) {
      this.$store.dispatch(enrolmentModule + '/' + RESET_FORM);
      next();
    } else if ((pageStateService.isPageComplete(to.path)) || isPastPath(to.path, from.path)) {
      next();
    } else {
      // Navigate to self.
      const topScrollPosition = getTopScrollPosition();
      const toPath = getConvertedPath(
        this.$router.currentRoute.path,
        enrolmentRoutes.CHILD_INFO_PAGE.path
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

.icon-header {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.remove-icon {
  cursor: pointer;
}

.collapsed {
  display: none;
}
</style>
