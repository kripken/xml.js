Module['preRun'] = function () {
	/** @type {Object[]} */
	var schemas = Module['opt_schema'];
	/** @type {Object[]} */
	var xmlFiles = Module['opt_xml'];
	/** @type {Object[]} */
	var preload = Module['opt_preload'];
	xmlFiles.concat(schemas, preload).forEach(function(xmlInfo) {
		FS.createDataFile('/', xmlInfo['fileName'], intArrayFromString(xmlInfo['contents']), true, true);
	});
};

// Don't print back the xml file in output.
Module['arguments'] = ['--noout'];

(function() {
	var ext = Module['opt_extension']; // --schema or --relaxng
	/** @type {Object[]} */
	var schemas = Module['opt_schema'];
	/** @type {Object[]} */
	var xmlFiles = Module['opt_xml'];
	schemas.forEach(function(schemaInfo) {
		Module.arguments.push(ext);
		Module.arguments.push(schemaInfo['fileName']);
	});
	xmlFiles.forEach(function(xmlInfo) {
		Module.arguments.push(xmlInfo['fileName']);
	});
})();
