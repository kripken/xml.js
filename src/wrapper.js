function validateXML(options) {
	var Module = {
		xml: options.xml,
		schema: options.schema
	}
	;

	/* xmllint.raw.js */

	Module['return'] = Module['return'].split('\n').slice(0,-2);
	return Module['return'].length ? Module['return'] : null;
}
