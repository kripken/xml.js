Module['preRun'] = function () {
	const preloads = Module['preloads'];
	preloads.forEach(function(data) {
		FS.createDataFile('/', data['fileName'], intArrayFromString(data['contents']), true, true);
	});
};

(function() {
	Module['arguments'] = Module['args'];
})();
