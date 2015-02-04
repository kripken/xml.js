function validateXML(options) {
	var Module = {
		xml: options.xml,
		schema: options.schema
	}
	;

	/* XMLLINT.RAW.JS */

	Module['return'] = Module['return'].split('\n').slice(0,-2);

	// Do this is a JSLint style way...
	return {
		errors: Module['return'].length ? Module['return'] : null
	};
}
