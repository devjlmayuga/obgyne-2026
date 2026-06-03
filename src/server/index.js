const apiApp = require('./apiApp');

if (require.main === module) {
  apiApp.listen(process.env.PORT || 8080, () =>
    console.log('Listening on port', process.env.PORT || 8080)
  );
}

module.exports = apiApp;
