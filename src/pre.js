
Module['preRun'] = function () {
	var i
	;
	for (i = 0; i < Module['xml'].length; i++) {
		FS.createDataFile('/', 'file_' + i + '.xml', Module['intArrayFromString'](Module['xml'][i]), true, true);
	}
	for (i = 0; i < Module['schema'].length; i++) {
		FS.createDataFile('/', 'file_' + i + '.xsd', Module['intArrayFromString'](Module['schema'][i]), true, true);
	}
};

Module.arguments = ['--noout'];

(function () {
	var i
	;
	if ('[object Array]' !== Object.prototype.toString.call(Module['schema'])) {
		Module['schema'] = [Module['schema']];
	}
	if ('[object Array]' !== Object.prototype.toString.call(Module['xml'])) {
		Module['xml'] = [Module['xml']];
	}
	for (i = 0; i < Module['schema'].length; i++) {
		Module.arguments.push('--schema');
		Module.arguments.push('file_' + i + '.xsd');
	}
	for (i = 0; i < Module['xml'].length; i++) {
		Module.arguments.push('file_' + i + '.xml');
	}
	Module.arguments.push('--output');
	Module.arguments.push('out.txt');
}());

Module['return'] = '';

Module['stderr'] = function (code) {
	Module['return'] += String.fromCharCode(code);
};
