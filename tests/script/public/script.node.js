const path = require('path');
const Script = require('../../../build/classes/Script');

module.exports = function (script) {
  script.setBody('script.ok');
  script.setStatusCode(200);
};
