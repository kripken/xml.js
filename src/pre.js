const stdoutBuffer = [];
const stderrBuffer = [];

Module['preRun'] = function () {
	const inputFiles = Module['inputFiles'];
	inputFiles.forEach(function(inputFile) {
		FS.createDataFile('/', inputFile['fileName'], intArrayFromString(inputFile['contents']), true, true);
	});
};

Module['stdout'] = stdoutBuffer.push.bind(stdoutBuffer);
Module['stderr'] = stderrBuffer.push.bind(stderrBuffer);

Module['onExit'] = function(exitCode) {
    postMessage({
        'exitCode': exitCode,
        'stdout': intArrayToString(stdoutBuffer),
        'stderr': intArrayToString(stderrBuffer),
    });
};

(function() {
	Module['arguments'] = Module['args'];
})();
