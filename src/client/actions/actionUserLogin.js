import { API_URL } from '../configuration/client_config';
import { httpMethod } from '../utilities/http';

export const ADMIN_USER_LOGIN = 'ADMIN_USER_LOGIN';
export const CLEAR_USER_SESSION = 'CLEAR_USER_SESSION';

export function userLogin(requestBody, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/auth/login`;
    const promise = httpMethod(url, 'post', JSON.stringify(requestBody));
    let success = true;
    promise
      .then(response => {
        if (response.error) {
          success = false;
          return;
        }
        const someData = {
          type: ADMIN_USER_LOGIN,
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

export const userLogout = () => dispatch => {
  const someData = {
    type: CLEAR_USER_SESSION,
    payload: {}
  };
  dispatch(someData);
};
