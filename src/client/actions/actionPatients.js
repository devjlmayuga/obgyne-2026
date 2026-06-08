import { API_URL } from '../configuration/client_config';
import { httpMethod, encodeTextToUri } from '../utilities/http';

export const TODAYS_PATIENT_LIST = 'TODAYS_PATIENT_LIST';
export const PATIENT_CONFINEMENT_LIST = 'PATIENT_CONFINEMENT_LIST';
export const PATIENT_LIST = 'PATIENT_LIST';
export const SAVE_PATIENT_INFO = 'SAVE_PATIENT_INFO';
export const FETCH_PATIENT_INFO = 'FETCH_PATIENT_INFO';
export const FETCH_MEDICAL_HISTORY = 'FETCH_MEDICAL_HISTORY';
export const FETCH_PATIENT_DELIVERY = 'FETCH_PATIENT_DELIVERY';
export const PATIENT_SCHED = 'PATIENT_SCHED';
export const SELECTED_CHECKUP_FORM = 'SELECTED_CHECKUP_FORM';

export function fetchTodaysPatientList(token, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/patient/get-list/today-patient`;
    const promise = httpMethod(url, 'get', null, null, token);
    let success = true;
    promise
      .then(response => {
        if (response.error) {
          success = false;
          return;
        }
        const someData = {
          type: TODAYS_PATIENT_LIST,
          payload: response
        };
        resolve(someData);
      })
      .then(() => {
        callback(success);
      })
      .catch(error => {
        reject(error);
        callback(false);
      });
  });
}

export function fetchTodaysPatientSched(patientId, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/patient/is-scheduled-today/${patientId}`;
    const promise = httpMethod(url, 'get');
    let success = true;
    promise
      .then(response => {
        if (response.error) {
          success = false;
          return;
        }
        const someData = {
          type: PATIENT_SCHED,
          payload: response
        };
        resolve(someData);
      })
      .then(() => {
        callback(success);
      })
      .catch(error => {
        reject(error);
        callback(false);
      });
  });
}

export function fetchPatientConfinementList(token, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/patient/get-patient-confinement/list`;
    const promise = httpMethod(url, 'get', null, null, token);
    let success = true;
    promise
      .then(response => {
        if (response.error) {
          success = false;
          return;
        }
        const someData = {
          type: PATIENT_CONFINEMENT_LIST,
          payload: response
        };
        resolve(someData);
      })
      .then(() => {
        callback(success);
      })
      .catch(error => {
        reject(error);
        callback(false);
      });
  });
}

export function fetchPatientList(term, callback, page = 1, limit = 10) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/patient/get-list?name=${encodeTextToUri(
      term
    )}&order=asc&page=${page}&limit=${limit}`;
    const promise = httpMethod(url, 'get');
    let success = true;
    promise
      .then(response => {
        success = response;
        if (response.error) {
          success = false;
          return;
        }
        const someData = {
          type: PATIENT_LIST,
          payload: response
        };
        resolve(someData);
      })
      .then(() => {
        callback(success);
      })
      .catch(error => {
        reject(error);
        callback(false);
      });
  });
}

export function savePatientInfo(requestBody, callback) {
  return new Promise(() => {
    const url = `${API_URL}/api/admin/patient/insert`;
    const promise = httpMethod(url, 'post', JSON.stringify(requestBody));
    promise
      .then(response => {
        if (response.error) {
          callback(false);
          return;
        }
        callback(response);
      })
      .catch(() => {
        callback(false);
      });
  });
}

export function deleteTestResult(googleId, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/patient/delete-file/${googleId}`;
    const promise = httpMethod(url, 'delete');
    let success = true;
    promise
      .then(response => {
        if (response.error) {
          success = false;
          return;
        }
      })
      .then(() => {
        callback(success);
      })
      .catch(error => {
        reject(error);
        callback(false);
      });
  });
}

export function deletePatient(patientId, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/patient/delete/${patientId}/true`;
    const promise = httpMethod(url, 'delete');
    let success = true;
    promise
      .then(response => {
        if (response.error) {
          success = false;
          return;
        }
      })
      .then(() => {
        callback(success);
      })
      .catch(error => {
        reject(error);
        callback(false);
      });
  });
}

export function updatePatientInfo(requestBody, callback) {
  return new Promise(() => {
    const url = `${API_URL}/api/admin/patient/update`;
    const promise = httpMethod(url, 'post', JSON.stringify(requestBody));
    promise
      .then(response => {
        if (response.error) {
          callback(false);
          return;
        }
        callback(response);
      })
      .catch(() => {
        callback(false);
      });
  });
}

export function saveMedicalHistory(requestBody, callback) {
  return new Promise(() => {
    const url = `${API_URL}/api/admin/patient/medical-hitory/save`;
    const promise = httpMethod(url, 'post', JSON.stringify(requestBody));
    promise
      .then(response => {
        if (response.error) {
          callback(false);
          return;
        }
        callback(true);
      })
      .catch(() => {
        callback(false);
      });
  });
}

export function schedulePatient(requestBody, callback) {
  return new Promise(() => {
    const url = `${API_URL}/api/admin/patient/schedule`;
    const promise = httpMethod(url, 'post', JSON.stringify(requestBody));
    promise
      .then(response => {
        if (response.error) {
          callback(false);
          return;
        }

        callback(response);
      })
      .catch(() => {
        callback(false);
      });
  });
}

export function fetchPatientInformation(id, callback) {
  return new Promise(resolve => {
    const url = `${API_URL}/api/admin/patient/get-info/${id}`;
    const promise = httpMethod(url, 'get');
    promise
      .then(response => {
        let success = true;
        let obj = response;
        if (response.error) {
          obj = {};
          success = false;
        } else {
          obj = response.length > 0 ? response[0] : {};
        }
        const someData = {
          type: FETCH_PATIENT_INFO,
          payload: obj
        };
        resolve(someData);
        callback(success);
      })
      .catch(() => {
        const someData = {
          type: FETCH_PATIENT_INFO,
          payload: {}
        };
        resolve(someData);
        callback(false);
      });
  });
}

export function fetchMedicalHistory(id, callback) {
  return new Promise(resolve => {
    const url = `${API_URL}/api/admin/patient/get-medical-history/${id}`;
    const promise = httpMethod(url, 'get');
    promise
      .then(response => {
        let success = true;
        let obj = response;
        if (response.error) {
          obj = {};
          success = false;
        } else {
          obj = response.length > 0 ? response[0] : {};
        }
        const someData = {
          type: FETCH_MEDICAL_HISTORY,
          payload: obj
        };
        resolve(someData);
        callback(success);
      })
      .catch(() => {
        const someData = {
          type: FETCH_MEDICAL_HISTORY,
          payload: {}
        };
        resolve(someData);
        callback(false);
      });
  });
}

export function fetchPatientDelivery(id, callback) {
  return new Promise(resolve => {
    const url = `${API_URL}/api/admin/patient-delivery/get-list-by-patient-id/${id}`;
    const promise = httpMethod(url, 'get');
    promise
      .then(response => {
        let success = true;
        let obj = response;
        if (response.error) {
          obj = [];
          success = false;
        }
        const someData = {
          type: FETCH_PATIENT_DELIVERY,
          payload: obj
        };
        resolve(someData);
        callback(success);
      })
      .catch(() => {
        const someData = {
          type: FETCH_PATIENT_DELIVERY,
          payload: []
        };
        resolve(someData);
        callback(false);
      });
  });
}

export function removeInConfinementList(checkupHistoryId, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/patient/delivered/${checkupHistoryId}/true`;
    const promise = httpMethod(url, 'post');
    let success = true;
    promise
      .then(response => {
        success = response;
        if (response.error) {
          success = false;
          return;
        }
        const someData = {
          type: PATIENT_LIST,
          payload: response
        };
        resolve(someData);
      })
      .then(() => {
        callback(success);
      })
      .catch(error => {
        reject(error);
        callback(false);
      });
  });
}

export function saveCheckup(requestBody, callback) {
  return new Promise(() => {
    const url = `${API_URL}/api/admin/patient/checkup/save`;
    const promise = httpMethod(url, 'post', JSON.stringify(requestBody));
    promise
      .then(response => {
        if (response.error) {
          callback(false);
          return;
        }
        callback(true);
      })
      .catch(() => {
        callback(false);
      });
  });
}

export function updateCheckup(requestBody, callback) {
  return new Promise(() => {
    const url = `${API_URL}/api/admin/patient/checkup/update`;
    const promise = httpMethod(url, 'post', JSON.stringify(requestBody));
    promise
      .then(response => {
        if (response.error) {
          callback(false);
          return;
        }
        callback(true);
      })
      .catch(() => {
        callback(false);
      });
  });
}

export const selectCheckupForm = formValues => dispatch => {
  const someData = {
    type: SELECTED_CHECKUP_FORM,
    payload: formValues
  };
  dispatch(someData);
};

export function uploadFile(requestBody, callback) {
  const { patient_id, test_type, file } = requestBody;
  return new Promise(() => {
    const url = `${API_URL}/api/admin/patient/upload`;

    let formData = new FormData();
    formData.append('patient_id', patient_id);
    formData.append('test_type', test_type);
    formData.append('file', file);

    const promise = httpMethod(url, 'post', formData, true);
    promise
      .then(response => {
        if (response.error) {
          callback(false);
          return;
        }
        callback(true);
      })
      .catch(() => {
        callback(false);
      });
  });
}
