import { API_URL } from '../configuration/client_config';
import { httpMethod, encodeTextToUri } from '../utilities/http';

export function purchaseMed(requestBody, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/patient/purchase-medicine`;
    const promise = httpMethod(url, 'post', JSON.stringify(requestBody));
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
