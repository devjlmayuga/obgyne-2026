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
        callback(false);
      });
  });
}

export function fetchCheckUpList(id, callback) {
  return new Promise(resolve => {
    const url = `${API_URL}/api/admin/patient/checkup-history/${id}`;
    const promise = httpMethod(url, 'get');
    promise
      .then(response => {
        let success = true;
        let someData = {
          type: PATIENT_CHECKUP_LIST,
          payload: response
        };
        if (response.error) {
          someData = {
            type: PATIENT_CHECKUP_LIST,
            payload: []
          };
          success = false;
        }
        resolve(someData);
        callback(success);
      })
      .catch(() => {
        callback(false);
      });
  });
}
