const apiApp = require('../../src/server/apiApp');

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
};

export default function handler(req, res) {
  return apiApp(req, res);
}
