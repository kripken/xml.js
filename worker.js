const {workerData, parentPort} = require('worker_threads');

function stdout(msg) {
	parentPort.postMessage(msg);
}

require('./xmllint.js')({
	opt_xml: workerData.xml,
	opt_schema: workerData.schema,
	opt_preload: workerData.preload,
	opt_extension: `--${workerData.extension}`,
	stdout, stderr: stdout,
});
