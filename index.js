const { Worker } = require('worker_threads');
const workerFile = require.resolve('./worker.js');

function validateXML(options) {
	return new Promise(function validateXMLPromiseCb(resolve, reject) {
		const worker = new Worker(workerFile, {
			workerData: {
				xml: normalizeInput(options.xml, 'xml'),
				schema: normalizeInput(options.schema, 'xsd'),
				preload: normalizeInput(options.preload || [], 'xml'),
				extension: options.extension || 'schema',
			},
		});

		let output = '';

		function stdout(msg) {
			output += String.fromCharCode(msg);
		}

		function onExit(code) {
			if (code === 0) {
				resolve({
					valid: true,
					errors: [],
					rawOutput: output,
				});
			} else if (code === 3 || code === 4 /* validationError */) {
				resolve({
					valid: false,
					errors: parseErrors(output),
					rawOutput: output,
				});
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

function parseErrors(/** @type {string} */output) {
	const errorLines = output
		.split('\n')
		.slice(0, -2);

	return errorLines.map(line => {
		const [fileName, lineNumber, ...rest] = line.split(':');
		if (fileName && lineNumber && rest.length) {
			return {
				rawMessage: line,
				message: rest.join(':').trim(),
				loc: {
					fileName,
					lineNumber: parseInt(lineNumber),
				}
			};
		} else {
			return {
				rawMessage: line,
				message: line,
				loc: null,
			};
		}
	}).filter(errorInfo => {
		// xmllint outputs "file.xml validates" for those files that are valid.
		const wasValid = !errorInfo.loc && errorInfo.rawMessage
			.trim()
			.endsWith(' validates');
		// don't list those files in errors list
		return !wasValid;
	});
}

function normalizeInput(fileInput, extension) {
	if (!Array.isArray(fileInput)) fileInput = [fileInput];
	return fileInput.map((xmlInfo, i) => {
		if (typeof xmlInfo === 'string') {
			return {
				fileName: `file_${i}.${extension}`,
				contents: xmlInfo,
			};
		} else {
			return xmlInfo;
		}
	});
}

module.exports.validateXML = validateXML;
