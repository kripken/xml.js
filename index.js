const { Worker } = require('worker_threads');

function validateXML(options) {
  return new Promise(function validateXMLPromiseCb(resolve, reject) {
    const worker = new Worker('./worker.js', {
      workerData: options,
    });

    let output = ''

    function stdout(msg) {
      output += String.fromCharCode(msg);
    }

    function onExit(code) {
      if (code === 0) {
        resolve({
          errors: [],
        })
      }
      if (code === 3 || code === 4 /* validationError */) {
        resolve({
          errors: output.length
            ? output.split('\n').slice(0, -2)
            : []
        })
      } else {
        const err = new Error(output);
        err.code = code;
        reject(err);
      }
    }

    worker.on('message', stdout);
    worker.on('exit', onExit);
    worker.on('error', err => {
      console.error('Unexpected error event from worker: ' + err);
      reject(err);
    });
  });
}

module.exports.validateXML = validateXML