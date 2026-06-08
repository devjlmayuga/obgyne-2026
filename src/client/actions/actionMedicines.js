import { API_URL } from '../configuration/client_config';
import { httpMethod, encodeTextToUri } from '../utilities/http';
import { dispatcher } from '../utilities/dispatcher';

export const MEDICINE_SALES_LIST = 'MEDICINE_SALES_LIST';
export const INVENTORY_LIST = 'INVENTORY_LIST';
export const SELECTED_ITEM = 'SELECTED_ITEM';

export function fetchTodayMedSalesList(token, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/medicine/get-total-sale/today`;
    const promise = httpMethod(url, 'get', null, null, token);
    let success = true;
    promise
      .then(response => {
        if (response.error) {
          success = false;
          return;
        }
        const someData = {
          type: MEDICINE_SALES_LIST,
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

export function fetchInventoryList(term, callback, page = 1, limit = 10) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/medicine/get-list?name=${encodeTextToUri(
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
          type: INVENTORY_LIST,
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

export function addNewItem(requestBody, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/medicine/insert`;
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

export function updateItem(requestBody, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/medicine/update`;
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

export const setSelectedItem = data => dispatch => {
  dispatch(dispatcher(SELECTED_ITEM, data));
};

export function deleteItem(medId, callback) {
  return new Promise((resolve, reject) => {
    const url = `${API_URL}/api/admin/medicine/delete/${medId}`;
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
