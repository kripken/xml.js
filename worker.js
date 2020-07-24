const {workerData, parentPort} = require('worker_threads');

function stdout(msg) {
	parentPort.postMessage(msg);
}

require('./xmllint.js')({
	xml: workerData.xml, schema: workerData.schema,
	extension: '--schema',
	stdout, stderr: stdout,
});
