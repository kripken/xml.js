Module['preRun'] = function () {
	var i;
	//Clamping this to `1` xml file for the moment since it's unclear how best to format the return value to support multiple xml files.
	for (i = 0; i < (1 || Module['xml'].length); i++) {
		FS.createDataFile('/', 'file_' + i + '.xml', intArrayFromString(Module['xml'][i]), true, true);
	}
	for (i = 0; i < Module['schema'].length; i++) {
		FS.createDataFile('/', 'file_' + i + '.xsd', intArrayFromString(Module['schema'][i]), true, true);
	}
};

Module['arguments'] = ['--noout'];

(function() {
	var i;
	if (!Array.isArray(Module['schema'])) {
		Module['schema'] = [Module['schema']];
	}
	if (!Array.isArray(Module['xml'])) {
		Module['xml'] = [Module['xml']];
	}
	for (i = 0; i < Module['schema'].length; i++) {
		Module.arguments.push(Module['extension']);
		Module.arguments.push('file_' + i + '.xsd');
	}
	for (i = 0; i < (1 || Module['xml'].length); i++) {
		Module.arguments.push('file_' + i + '.xml');
	}
})();
