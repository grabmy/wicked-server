
const nothing = require('nothing');

module.exports = function (script) {
  script.setBody('script.status.code');
  script.setStatusCode(200);
};
