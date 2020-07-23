function toArray(val) {
	return Array.isArray(val) ? val : [val];
}

function validateXML(options) {
	return new Promise((_wrapperPrivateResolve, _wrapperPrivateReject) => {
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
		var _wrapperPrivateExited = false;

		function _wrapperPrivateReturn() {
			_wrapperPrivateExited = true;
			_wrapperPrivateResolve({
				errors: Module['return'].length
				? Module['return'].split('\n').slice(0, -2)
				: null
			})
		}

		var _wrapperPrivateErrorHandlers = [];

		var process = {
			argv: [],
			exit(code) {
				console.log('exiting', code, _wrapperPrivateExited, Module['return']);
				if (_wrapperPrivateExited) return
				_wrapperPrivateExited = true;
				if (code === 3 || code === 4 /* Validation error */) {
					return _wrapperPrivateReturn()
				} else {
					const err = new Error(Module['return']);
					err.code = code;
					_wrapperPrivateReject(err);
				}
			},
			on(eventType, cb) {
				if (eventType === 'uncaughtException' || eventType === 'unhandledRejection') {
					_wrapperPrivateErrorHandlers.push(cb);
				}
			}
		};

		try {
		/* XMLLINT.RAW.JS */
		} catch(err) {
			for (const handler of _wrapperPrivateErrorHandlers) {
				handler(err);
			}
		}
		setTimeout(() => {
			if (!_wrapperPrivateExited) {
				_wrapperPrivateReturn();
			}
		});
	});
}

module.exports.validateXML = validateXML
