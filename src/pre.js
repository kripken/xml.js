
Module['preRun'] = function () {
	var i
	;
	FS.createDataFile('/', 'test.xml', Module['intArrayFromString'](Module['xml']), true, true);
	if ('[object Array]' !== Object.prototype.toString.call(Module['schema'])) {
		console.log('not an array');
		Module['schema'] = [Module['schema']];
	}
	for (i = 0; i < Module['schema'].length; i++) {
		FS.createDataFile('/', 'file_' + i + '.xsd', Module['intArrayFromString'](Module['schema'][i]), true,true);
	}
};
Module.arguments = ['--noout'];
(function () {
	var i
	;
	for (i = 0; i < Module['schema'].length; i++) {
		Module.arguments.push('--schema');
		Module.arguments.push('file_' + i + '.xsd');
	}
}());
Module.arguments.push('test.xml');
Module['return'] = '';
Module['print'] = function (text) {
	Module['return'] += text + '\n';
};
/*
  Module['preRun'] = function() {
    FS.createDataFile('/', 'test.xml', Module['intArrayFromString'](Module['xml']), true, true);
    FS.createDataFile('/', 'test.xsd', Module['intArrayFromString'](Module['schema']), true, true);
  };
  Module.arguments = ['--noout', '--schema', 'test.xsd', 'test.xml'];
  Module['return'] = '';
  Module['print'] = function(text) {
    Module['return'] += text + '\n';
  };

*/
