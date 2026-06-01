import { API_URL } from '../configuration/client_config';
import { httpMethod } from '../utilities/http';

export function changePassword(requestBody, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/user/reset-password`;
    const promise = httpMethod(url, 'post', JSON.stringify(requestBody));
    let succ = { success: true, data: '' };
    promise
      .then(response => {
        if (response.error) {
          succ = { success: false, data: response };
          return;
        }
      })
      .then(() => {
        callback(succ);
      })
      .catch(error => {
        reject(error);
        callback({ success: false, data: error });
      });
  });
}
