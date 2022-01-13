const {workerData, parentPort} = require('worker_threads');

function stdout(msg) {
	parentPort.postMessage(msg);
}

require('./xmllint.js')({
	stdout, stderr: stdout,
	xmllintOptions: workerData.xmllintOptions
});
