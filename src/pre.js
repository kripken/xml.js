Module['preRun'] = function () {
	/** @type {Object[]} */
	var schemas = Module['schema'];
	/** @type {Object[]} */
	var xmlFiles = Module['xml'];
	xmlFiles.concat(schemas).forEach(function(xmlInfo) {
		FS.createDataFile('/', xmlInfo['fileName'], intArrayFromString(xmlInfo['xml']), true, true);
	});
};

// Don't print back the xml file in output.
Module['arguments'] = ['--noout'];

(function() {
	var ext = Module['extension']; // --schema or --relaxng
	/** @type {Object[]} */
	var schemas = Module['schema'];
	/** @type {Object[]} */
	var xmlFiles = Module['xml'];
	schemas.forEach(function(schemaInfo) {
		Module.arguments.push(ext);
		Module.arguments.push(schemaInfo['fileName']);
	});
	xmlFiles.forEach(function(xmlInfo) {
		Module.arguments.push(xmlInfo['fileName']);
	});
})();
