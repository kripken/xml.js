const {workerData, parentPort} = require('worker_threads');

function stdout(msg) {
	parentPort.postMessage(msg);
}

require('./xmllint.js')({
	stdout, stderr: stdout,
	opt_xmls: workerData.xmllintOptions.xmls,
	opt_schemas: workerData.xmllintOptions.schemas,
	opt_preloads: workerData.xmllintOptions.preloads,
	opt_extension: `--${workerData.xmllintOptions.extension}`
});
