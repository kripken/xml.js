'use strict';

/** @type {import("./index").MemoryPagesConstant} */
const memoryPages = {
	MiB: 16,
	GiB: 16384,
	default: 256,
	max: 65536
};

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

	return {
		inputFiles, args,
		initialMemory: options.initialMemoryPages || memoryPages.default,
		maxMemory: options.maxMemoryPages || memoryPages.default,
	};
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

/** @type {import("./index").validateXML} */
function validateXML(options) {
	const preprocessedOptions = preprocessOptions(options);
	var worker;

	return new Promise(function validateXMLPromiseCb(resolve, reject) {
		function onmessage(event) {
			// #ifdef browser
			var data = event.data;
			// #ifdef node
			var data = event;
			// #endif

			const valid = validationSucceeded(data.exitCode);
			if (valid === null) {
				const err = new Error(data.stderr);
				err.code = data.exitCode;
				reject(err);
			} else {
				resolve({
					valid: valid,
					normalized: data.stdout,
					errors: valid ? [] : parseErrors(data.stderr),
					rawOutput: data.stderr
					/* Traditionally, stdout has been suppressed both
					 * by libxml2 compile options as well as explict
					 * --noout in arguments; hence »rawOutput« refers
					 * only to stderr, which is a reasonable attribute value
					 * despite the slightly odd attribute name.
					 */
				});
			}
		}

		function onerror(err) {
			reject(err);
		}

		// #ifdef browser
		worker = new Worker(new URL('./xmllint-browser.mjs', import.meta.url), { type: 'module' });
		// #ifdef node
		const {Worker} = require('worker_threads');
		worker = new Worker(require('path').resolve(__dirname, './xmllint-node.js'));
		// #endif

		// #ifdef browser
		var addEventListener = worker.addEventListener.bind(worker);
		// #ifdef node
		var addEventListener = worker.on.bind(worker);
		// #endif

		addEventListener('message', onmessage);
		addEventListener('error', onerror);
		worker.postMessage(preprocessedOptions);
	}).finally(() => worker.terminate());
}

// #ifdef browser
export { validateXML, memoryPages };
// #ifdef node
module.exports.validateXML = validateXML;
module.exports.memoryPages = memoryPages;
// #endif
