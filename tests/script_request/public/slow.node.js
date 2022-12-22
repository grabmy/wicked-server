
module.exports = async function (script) {
  script.async();
  script.setStatusCode(201);
  script.setBody('script.slow');

  setTimeout(() => {
    script.resolve();
  }, 2000);

  /*
  script.async();
  script.setStatusCode(201);
  script.setBody('script.slow');
  script.end();
  */

  /*
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      script.setStatusCode(201);
      script.setBody('script.slow');
      resolve();
    }, 4000);
  });
  */
};
