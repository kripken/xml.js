if(typeof FS === 'undefined')/** @suppress{checkTypes}*/FS={"__EMSCRIPTEN_PRIVATE_MODULE_EXPORT_NAME_SUBSTITUTION__":1};

Module['preRun'] = function () {
	var i;
	Module['intArrayFromString'] = intArrayFromString;
	//Clamping this to `1` xml file for the moment since it's unclear how best to format the return value to support multiple xml files.
	for (i = 0; i < (1 || Module['xml'].length); i++) {
		FS.createDataFile('/', 'file_' + i + '.xml', Module['intArrayFromString'](Module['xml'][i]), true, true);
	}
	for (i = 0; i < Module['schema'].length; i++) {
		FS.createDataFile('/', 'file_' + i + '.xsd', Module['intArrayFromString'](Module['schema'][i]), true, true);
	}
};

Module.arguments = ['--noout'];

(function () {
	var i;
	if ('[object Array]' !== Object.prototype.toString.call(Module['schema'])) {
		Module['schema'] = [Module['schema']];
	}
	if ('[object Array]' !== Object.prototype.toString.call(Module['xml'])) {
		Module['xml'] = [Module['xml']];
	}
	for (i = 0; i < Module['schema'].length; i++) {
		Module.arguments.push(Module['extension']);
		Module.arguments.push('file_' + i + '.xsd');
	}
	for (i = 0; i < (1 || Module['xml'].length); i++) {
		Module.arguments.push('file_' + i + '.xml');
	}
}());

Module['return'] = '';

Module['stdout'] = Module['stderr'] = function (code) {
	console.log('stdout or err called', code);
	Module['return'] += String.fromCharCode(code);
};
