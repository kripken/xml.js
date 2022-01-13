const {workerData, parentPort} = require('worker_threads');

function stdout(msg) {
	parentPort.postMessage(msg);
}

require('./xmllint.js')({
	stdout, stderr: stdout,
	opt_xml: workerData.xmllintOptions.xml,
	opt_schema: workerData.xmllintOptions.schema,
	opt_preload: workerData.xmllintOptions.preload,
	opt_extension: `--${workerData.xmllintOptions.extension}`
});
