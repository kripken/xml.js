Module['preRun'] = function () {
	const xmllintOptions = Module['xmllintOptions'];
	const schemas = xmllintOptions['schemas'];
	const xmls = xmllintOptions['xmls'];
	const preloads = xmllintOptions['preloads'];
	xmls.concat(schemas, preloads).forEach(function(data) {
		FS.createDataFile('/', data['fileName'], intArrayFromString(data['contents']), true, true);
	});
};

// Don't print back the xml file in output.
Module['arguments'] = ['--noout'];

(function() {
	const xmllintOptions = Module['xmllintOptions'];
	const ext = `--${xmllintOptions['extension']}` // --schema or --relaxng
	const schemas = xmllintOptions['schemas'];
	const xmls = xmllintOptions['xmls'];
	schemas.forEach(function(schema) {
		Module.arguments.push(ext);
		Module.arguments.push(schema['fileName']);
	});
	xmls.forEach(function(xml) {
		Module.arguments.push(xml['fileName']);
	});
})();
