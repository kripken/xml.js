const {workerData, parentPort} = require('worker_threads');

function stdout(msg) {
	parentPort.postMessage(msg);
}

require('./xmllint.js')({
	stdout, stderr: stdout,
	preloads: workerData.preloads,
	args: workerData.args
});
