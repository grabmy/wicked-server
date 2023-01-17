
module.exports = async function (script) {
  script.setStatusCode(200);
  script.setBody('script.slow');

  setTimeout(() => {
    script.resolve();
  }, 2000);
};
