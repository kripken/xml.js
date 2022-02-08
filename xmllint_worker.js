
importScripts('xmllint.js');

onmessage = function(event) {
	function stderr(txt) {
		postMessage({stderr: txt});
	}

	Module({
		inputFiles: event.data.inputFiles,
		args: event.data.args,
		stderr: stderr,
	});
}
