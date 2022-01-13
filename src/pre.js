Module['preRun'] = function () {
	const xmllintOptions = Module['xmllintOptions'];
	const schemas = xmllintOptions['schemas'];
	const xmls = xmllintOptions['xmls'];
	const preloads = xmllintOptions['preloads'];
	xmls.concat(schemas, preloads).forEach(function(xmlInfo) {
		FS.createDataFile('/', xmlInfo['fileName'], intArrayFromString(xmlInfo['contents']), true, true);
	});
};

// Don't print back the xml file in output.
Module['arguments'] = ['--noout'];

(function() {
	const xmllintOptions = Module['xmllintOptions'];
	const ext = `--${xmllintOptions['extension']}` // --schema or --relaxng
	const schemas = xmllintOptions['schemas'];
	const xmls = xmllintOptions['xmls'];
	schemas.forEach(function(schemaInfo) {
		Module.arguments.push(ext);
		Module.arguments.push(schemaInfo['fileName']);
	});
	xmls.forEach(function(xmlInfo) {
		Module.arguments.push(xmlInfo['fileName']);
	});
})();
