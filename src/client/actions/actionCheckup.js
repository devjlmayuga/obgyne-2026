import { API_URL } from '../configuration/client_config';
import { httpMethod, encodeTextToUri } from '../utilities/http';

export const CHECKUP_HISTORY = 'CHECKUP_HISTORY';
export const PATIENT_CHECKUP_LIST = 'PATIENT_CHECKUP_LIST';

export function fetchCheckUpHistory(id, callback) {
  return new Promise(resolve => {
    const url = `${API_URL}/api/admin/patient/checkup/history-list/${id}`;
    const promise = httpMethod(url, 'get');
    promise
      .then(response => {
        let success = true;
        let someData = {
          type: CHECKUP_HISTORY,
          payload: response
        };
        if (response.error) {
          someData = {
            type: CHECKUP_HISTORY,
            payload: []
          };
          success = false;
        }
        resolve(someData);
        callback(success);
      })
      .catch(() => {
        resolve({
          type: CHECKUP_HISTORY,
          payload: []
        });
        callback(false);
      });
  });
}

export function fetchCheckUpList(id, callback, page = 1, limit = 10, append = false) {
  return new Promise(resolve => {
    const url = `${API_URL}/api/admin/patient/checkup-history/${id}?page=${page}&limit=${limit}`;
    const promise = httpMethod(url, 'get');
    promise
      .then(response => {
        let success = true;
        let someData = {
          type: PATIENT_CHECKUP_LIST,
          payload: response,
          append
        };
        if (response.error) {
          someData = {
            type: PATIENT_CHECKUP_LIST,
            payload: [],
            append
          };
          success = false;
        }
        resolve(someData);
        callback(success);
      })
      .catch(() => {
        resolve({
          type: PATIENT_CHECKUP_LIST,
          payload: [],
          append
        });
        callback(false);
      });
  });
}
