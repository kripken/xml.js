Module['preRun'] = function () {
	const inputFiles = Module['inputFiles'];
	inputFiles.forEach(function(inputFile) {
		FS.createDataFile('/', inputFile['fileName'], intArrayFromString(inputFile['contents']), true, true);
	});
};

(function() {
	Module['arguments'] = Module['args'];
})();
