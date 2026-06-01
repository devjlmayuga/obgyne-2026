import { API_URL } from '../configuration/client_config';
import { httpMethod, encodeTextToUri } from '../utilities/http';

export const UPPDATE_SCHEDULE_STATUS = 'UPPDATE_SCHEDULE_STATUS';

export function updateScheduleStatus(requestBody, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/patient/update/status`;
    const promise = httpMethod(url, 'post', JSON.stringify(requestBody));
    let success = true;
    promise
      .then(response => {
        if (response.error) {
          success = false;
          return;
        }
        const someData = {
          type: UPPDATE_SCHEDULE_STATUS,
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
