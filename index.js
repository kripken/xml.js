
const workerModule = 'xmllint/xmllint_worker.js';

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

function preprocessOptions(options) {
	const xmls = normalizeInput(options.xml, 'xml');
	const extension = options.extension || 'schema';

	validateOption(['schema', 'relaxng'], 'extension', extension);
	const schemas = normalizeInput(options.schema || [], 'xsd');
	const preloads = normalizeInput(options.preload || [], 'xml');
	const normalization = options.normalization || '';
	validateOption(['', 'format', 'c14n'], 'normalization', normalization);

	const inputFiles = xmls.concat(schemas, preloads);
	const args = [];
	schemas.forEach(function(schema) {
		args.push(`--${extension}`);
		args.push(schema['fileName']);
	});

	if (normalization) {
		args.push(`--${normalization}`);
	} else {
		// If no normalization is requested, we'll default to no output at all to "normalized" field.
		args.push('--noout');
	}

	xmls.forEach(function(xml) {
		args.push(xml['fileName']);
	});

	return {inputFiles, args};
}

function validationSucceeded(exitCode) {
	if (exitCode === 0) {
		return true;
	} else if (exitCode === 3 || exitCode === 4 /* validationError */) {
		return false;
	} else /* unknown situation */ {
		return null;
	}
}

function validateOption(allowedValues, optionName, actualValue) {
	if (!allowedValues.includes(actualValue)) {
		const actualValueStr = typeof actualValue === 'string' ? `"${actualValue}"` : actualValue;
		throw new Error(`Invalid value for option ${optionName}: ${actualValueStr}`);
	}
}

function parseErrors(/** @type {string} */ output) {
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

export function validateXML(options) {

	const preprocessedOptions = preprocessOptions(options);

	return new Promise(function validateXMLPromiseCb(resolve, reject) {

		let stdout = '';
		let stderr = '';
		let exitCode = -1;

		function onmessage(event) {
			const data = event.data;
			if (data.stdout) {
				stdout += String.fromCharCode(data.stdout);
			} else if (data.stderr) {
				stderr += String.fromCharCode(data.stderr);
			} else {
				exitCode = data.exitCode;
				const valid = validationSucceeded(exitCode);
				if (valid === null) {
					const err = new Error(stderr);
					err.code = exitCode;
					reject(err);
				} else {
					resolve({
						valid: valid,
						normalized: stdout,
						errors: valid ? [] : parseErrors(stderr),
						rawOutput: stderr
						/* Traditionally, stdout has been suppressed both
						 * by libxml2 compile options as well as explict
						 * --noout in arguments; hence »rawOutput« refers
						 * only to stderr, which is a reasonable attribute value
						 * despite the slightly odd attribute name.
						 */
					});
				}
			}
		}

		function onerror(err) {
			console.error('Unexpected error event from worker: ' + err);
			reject(err);
		}

		const worker = new Worker(workerModule);
		worker.onmessage = onmessage;
		worker.onerror = onerror;
		worker.postMessage(preprocessedOptions);
	});
}

export default {
	validateXML
}
