import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { formatISODate } from 'common-lib-vue';

const BASE_API_PATH = '/jha/api/';
const SUBMIT_FORM_A_APPLICATION_URL = BASE_API_PATH + 'jhaIntegration/payPatientSubmission';

class ApiService {
  submitEnrolmentApplication(token, formState) {
    const jsonPayload = {
      applicationUuid: formState.applicationUuid,
      requestUuid: uuidv4(),
      submissionDate: formatISODate(formState.submissionDate) || '',
    };
    return this._sendPostRequest(SUBMIT_FORM_A_APPLICATION_URL, token, jsonPayload);
  }

  _sendPostRequest(url, token, jsonPayload) {
    const headers = this._getHeaders(token);
    return axios.post(url, jsonPayload, { headers });
  }

  _getHeaders(token) {
    return {
      "Content-Type": "application/json",
      "Response-Type": "application/json",
      "X-Authorization": "Bearer " + token
    }
  }
}

export default new ApiService();
