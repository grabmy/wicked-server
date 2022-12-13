
module.exports = function (script) {
  script.setHeader('Location', '/script_201.node.js');
  script.setBody('script.status.code');
  script.setStatusCode(301);
};
