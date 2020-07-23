function toArray(val) {
	return Array.isArray(val) ? val : [val];
}

function fileNotFound(path) {
	throw new Error(`File ${path} not found`)
}

function validateXML(options) {
	return new Promise((resolve, reject) => {
		var Module = {
			xml: toArray(options.xml),
			schema: toArray(options.schema),
			TOTAL_MEMORY: options.TOTAL_MEMORY,
		};
		if (options.format === 'rng') {
			Module['extension'] = '--relaxng';
		} else {
			Module['extension'] = '--schema';
		}

		function $return() {
			resolve({
				errors: Module['return'].length
				? Module['return'].split('\n').slice(0, -2)
				: null
			})
		}

		// Mock FS instead of passing directly to Node's file system.
		// https://emscripten.org/docs/api_reference/Filesystem-API.html
		var FS = {
			readFile(path, opts) {
				console.log('Reading file');
				// Parse filename based on the name pattern that is used in pre.js
				const filenameParts = path.match(/^file_([0-9]+)\.(xsd|xml)$/);
				if (!filenameParts) {
					fileNotFound(path);
				}
				const index = parseInt(filenameParts[1])
				let file
				if (filenameParts[2] === 'xsd') {
					file = Module.schema[index];
				} else {
					file = Module.xml[index];
				}
				if (opts.encoding === 'utf8') {
					return new TextEncoder().encode(file).buffer;
				}
			}
		};

		var errorHandlers = [];
		var exited = false;

		var process = {
			argv: [],
			exit(code) {
				console.log('exiting', code, exited);
				if (exited) return
				exited = true;
				if (code === 4 /* Validation error */) {
					resolve(makeResult(num));
				} else {
					const err = new Error(Module['return']);
					err.code = code;
					reject(err);
				}
			},
			on(eventType, cb) {
				if (eventType === 'uncaughtException' || eventType === 'unhandledRejection') {
					errorHandlers.push(cb);
				}
			}
		};

		try {
		/* XMLLINT.RAW.JS */
		} catch(err) {
			for (const handler of errorHandlers) {
				handler(err);
			}
		}

		return makeResult(0);
	});
}

module.exports.validateXML = validateXML
