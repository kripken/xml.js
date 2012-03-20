
  Module['preRun'] = function() {
    FS.createDataFile('/', 'test.xml', Module['intArrayFromString'](Module['xml']), true, true);
    FS.createDataFile('/', 'test.xsd', Module['intArrayFromString'](Module['schema']), true, true);
  };
  Module.arguments = ['--noout', '--schema', 'test.xsd', 'test.xml'];
  Module['return'] = '';
  Module['print'] = function(text) {
    Module['return'] += text + '\n';
  };

