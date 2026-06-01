import axios from 'axios';
import { post } from 'axios';
import { createDefaultStore as getStore } from '../store';

function getInstance(url, token) {
  let { authToken } = getStore().getState().userIdentity.data;

  if (!authToken) {
    authToken = token;
  }

  const instance = axios.create({
    baseURL: url,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      'x-auth': `bearer ${authToken}`
    }
  });
  return instance;
}

function getInstanceFileUpload(url, token) {
  let { authToken } = getStore().getState().userIdentity.data;

  if (!authToken) {
    authToken = token;
  }

  const instance = axios.create({
    baseURL: url,
    timeout: 120000,
    headers: {
      'Content-Type': 'multipart/form-data',
      'x-auth': `bearer ${authToken}`
    }
  });
  return instance;
}

// eslint-disable-next-line import/prefer-default-export
export function httpMethod(url, method, body, isFileUpload = false, token) {
  return new Promise(resolve => {
    const axiosInstance = isFileUpload
      ? getInstanceFileUpload(url, token)
      : getInstance(url, token);
    axiosInstance({
      method,
      data: body
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        console.log('caught an error :', err);
        let error;
        if (err.response) {
          console.log('response :', err.response);
          const { data, status } = err.response;
          error = { message: data, status };
        } else {
          error = {
            message: 'Network Error!',
            status: 404
          };
        }
        resolve({ error });
      });
  });
}

export function encodeTextToUri(text) {
  return encodeURIComponent(text)
    .replace(/%20/g, '%20')
    .replace(/%2F/g, '%5C')
    .toLowerCase();
}
