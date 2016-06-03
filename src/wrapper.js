var xmllint = {}
;

xmllint.validateXML = function (options) {
	var Module = {
		xml: options.xml,
		schema: options.schema,
		TOTAL_MEMORY: options.TOTAL_MEMORY
	}
	;

	/* XMLLINT.RAW.JS */

	Module['return'] = Module['return'].split('\n').slice(0,-2);

	// Do this in a JSLint style way...
	return {
		errors: Module['return'].length ? Module['return'] : null
	};
}

if ("undefined" === typeof window) {
	if ("undefined" !== typeof module) {
		module.exports = xmllint;
	}
}
